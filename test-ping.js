import axios from 'axios';

async function testPing() {
  try {
    const authRes = await axios.post('https://resultadosbackend.icfes.gov.co/api/segurity/autenticacionResultados', {
        tipoDocumento: 'TI', numeroDocumento: '111111111', fechaNacimiento: '01/01/2000', numeroRegistro: '', captcha: 'ping'
      }, { timeout: 8000 });
    console.log("Success", authRes.status);
  } catch (err) {
    console.log("Error status:", err.response ? err.response.status : err.code);
  }
}
testPing();
