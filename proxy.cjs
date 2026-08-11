const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Función auxiliar para mapear los nombres de ICFES a los códigos que espera tu React App
function getMateriaCode(nombreIcfes) {
  const n = nombreIcfes.toLowerCase();
  if (n.includes('lectura')) return 'LEC';
  if (n.includes('matem')) return 'MAT';
  if (n.includes('sociales')) return 'SOC';
  if (n.includes('ciencias')) return 'CIE';
  if (n.includes('ingl')) return 'ING';
  return 'LEC'; // fallback
}

// Health check endpoint para no agotar cuotas completas
app.get('/consulta', async (req, res) => {
  try {
    const authRes = await axios.post('https://resultadosbackend.icfes.gov.co/api/segurity/autenticacionResultados', {
      tipoDocumento: 'TI', numeroDocumento: '111111111', fechaNacimiento: '01/01/2000', numeroRegistro: '', captcha: 'ping'
    }, { timeout: 8000 });
    res.json({ status: true, message: 'Funcionando' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Caído' });
  }
});

app.post('/consulta', async (req, res) => {
  const { document, young, born } = req.body;
  const docType = young ? 'TI' : 'CC';

  console.log(`[PROXY-AXIOS] Iniciando consulta súper rápida para: ${docType} ${document}`);

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

    console.log('[PROXY-AXIOS] ¡Datos enviados a la interfaz exitosamente!');
    res.json(mappedData);

  } catch (error) {
    console.error('[PROXY-AXIOS] Error:', error.response?.status || error.message);
    if (error.response?.status === 404) {
      return res.json({ status: false, message: 'El ICFES indica que no se pudieron generar los resultados.' });
    }
    res.status(500).json({ status: false, message: 'Error interno conectando al ICFES.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Proxy 100% AUTOMÁTICO escuchando en http://localhost:${PORT}`);
  console.log(`👉 Ya no necesitas el CAPTCHA ni abrir Chrome.`);
});
