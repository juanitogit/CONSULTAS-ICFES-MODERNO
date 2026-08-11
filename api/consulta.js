import axios from 'axios';

// Función auxiliar para mapear los nombres de ICFES a los códigos
function getMateriaCode(nombreIcfes) {
  const n = nombreIcfes.toLowerCase();
  if (n.includes('lectura')) return 'LEC';
  if (n.includes('matem')) return 'MAT';
  if (n.includes('sociales')) return 'SOC';
  if (n.includes('ciencias')) return 'CIE';
  if (n.includes('ingl')) return 'ING';
  return 'LEC'; // fallback
}

export default async function handler(req, res) {
  // Enviar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint para no agotar cuotas completas
  if (req.method === 'GET') {
    try {
      const authRes = await axios.post('https://resultadosbackend.icfes.gov.co/api/segurity/autenticacionResultados', {
        tipoDocumento: 'TI', numeroDocumento: '111111111', fechaNacimiento: '01/01/2000', numeroRegistro: '', captcha: 'ping'
      }, { timeout: 8000 });
      return res.status(200).json({ status: true, message: 'Funcionando' });
    } catch (error) {
      // Si el servidor responde con 4xx (ej. 404 porque no existe el usuario), significa que ESTÁ VIVO.
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        return res.status(200).json({ status: true, message: 'Funcionando' });
      }
      return res.status(500).json({ status: false, message: 'Caído' });
    }
  }

  // Solo permitir POST para las consultas
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { document, young, born } = req.body;
  const docType = young ? 'TI' : 'CC';

  try {
    // 1. Obtener Token (ICFES ignora el captcha en la API backend!)
    const authRes = await axios.post('https://resultadosbackend.icfes.gov.co/api/segurity/autenticacionResultados', {
      tipoDocumento: docType,
      numeroDocumento: document,
      fechaNacimiento: born,
      numeroRegistro: '',
      captcha: 'dummy_token'
    });
    
    if (!authRes.data.datosAutenticacion || authRes.data.datosAutenticacion.length === 0) {
      return res.json({ status: false, message: 'No se encontraron resultados para los datos proporcionados.' });
    }

    const token = authRes.data.token;
    const authData = authRes.data.datosAutenticacion[0];
    
    // 2. Obtener Datos Básicos (para el nombre)
    const configBasicos = {
      headers: { 'Authorization': `Bearer ${token}` },
      params: {
        identificacionUnica: authData.numeroRegistro,
        examen: authData.datosParametros.examen
      }
    };
    const basicRes = await axios.get('https://resultadosbackend.icfes.gov.co/api/datos-basicos/datosBasicosRespuesta', configBasicos);
    
    let nombreEstudiante = 'Estudiante';
    if (basicRes.data && basicRes.data.camposDatosBasicos) {
      const nombreCampo = basicRes.data.camposDatosBasicos.find(c => c.labelDatoBasico.includes('Nombre'));
      if (nombreCampo) nombreEstudiante = nombreCampo.valorDatoBasico;
    }

    // 3. Obtener Reporte General (Puntajes)
    const configResultados = {
      headers: { 'Authorization': `Bearer ${token}` },
      params: {
        identificacionUnica: authData.numeroRegistro,
        examen: authData.datosParametros.examen,
        periodoAnioExamen: authData.datosParametros.periodoAnioExamen
      }
    };
    
    const resultsRes = await axios.get('https://resultadosbackend.icfes.gov.co/api/resultados/datosReporteGeneral', configResultados);
    const dataIcfes = resultsRes.data;

    // 4. Mapear al formato que espera tu App.jsx
    const puntajeMaterias = dataIcfes.reporteIndividuales.map(prueba => ({
      code: getMateriaCode(prueba.nombrePrueba),
      nombrePrueba: prueba.nombrePrueba,
      puntaje: parseInt(prueba.puntajePrueba, 10)
    }));

    const mappedData = {
      status: true,
      estudiante: nombreEstudiante,
      examenes: [
        {
          ACREGISTRO: authData.numeroRegistro,
          puntaje: parseInt(dataIcfes.resultadosGenerales.puntajeGlobal, 10),
          puntajeMaterias: puntajeMaterias
        }
      ]
    };

    return res.status(200).json(mappedData);

  } catch (error) {
    if (error.response?.status === 404) {
      return res.json({ status: false, message: 'El ICFES indica que no se pudieron generar los resultados.' });
    }
    return res.status(500).json({ status: false, message: 'Error interno conectando al ICFES.' });
  }
}
