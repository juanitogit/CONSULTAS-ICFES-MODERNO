import axios from "axios";
import { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import SEO from "./components/SEO";
import { IcfesIcons } from "./components/IcfesIcons";
import { HiOutlineShieldCheck, HiOutlineCode } from "react-icons/hi";

function Toast({ type, message }) {
  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  )
}

// Logo Oficial ICFES basado en la imagen
const IcfesLogoReal = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top Left - Teal */}
    <path d="M 15 48 L 48 48 L 48 15 L 30 15 L 30 35 L 15 35 Z" fill="#009ca6" />
    {/* Top Right - Dark Red */}
    <path d="M 52 15 L 52 48 L 85 48 L 85 30 L 68 30 L 68 15 Z" fill="#9b1b2a" />
    {/* Bottom Left - Light Teal */}
    <path d="M 15 52 L 48 52 L 48 85 L 30 85 L 30 68 L 15 68 Z" fill="#6bc0c7" />
    {/* Bottom Right - Red */}
    <path d="M 52 85 L 52 52 L 85 52 L 85 68 L 68 68 L 68 85 Z" fill="#bc202b" />
    
    {/* Cortes a 45 grados en las puntas (aproximado usando paths reescritos) */}
    {/* Lo haremos con poligonos para ser exactos a las formas */}
    {/* Vamos a cubrir las esquinas con triangulos blancos o redibujar */}
  </svg>
);

// Version mejorada del Logo Oficial usando polígonos
const IcfesLogoPolygon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <polygon points="10,48 48,48 48,10 32,10 32,32 10,32" fill="#00a0b0"/>
    <polygon points="52,10 52,48 90,48 90,32 68,32 68,10" fill="#901a1e"/>
    <polygon points="10,52 48,52 48,90 32,90 32,68 10,68" fill="#75c5cb"/>
    <polygon points="52,90 52,52 90,52 90,68 68,68 68,90" fill="#c3272b"/>
    
    {/* Cortes diagonales usando overlays blancos para simular la forma exacta del SVG proporcionado */}
    <polygon points="0,0 32,0 0,32" fill="white" className="corner-cut"/>
    <polygon points="100,0 100,32 68,0" fill="white" className="corner-cut"/>
    <polygon points="0,100 0,68 32,100" fill="white" className="corner-cut"/>
    <polygon points="100,100 68,100 100,68" fill="white" className="corner-cut"/>
  </svg>
);

// Vamos a usar una ruta exacta para el SVG enviado
const IcfesLogoSVG = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Top Left Cyan */}
    <path d="M22,17 L36,31 L36,48 L17,48 L4,35 L22,35 Z" fill="#00A5B5"/>
    {/* Top Right Dark Red */}
    <path d="M83,22 L69,36 L52,36 L52,17 L65,4 L65,22 Z" fill="#991B27"/>
    {/* Bottom Left Light Cyan */}
    <path d="M17,78 L31,64 L48,64 L48,83 L35,96 L35,78 Z" fill="#77C5CB"/>
    {/* Bottom Right Bright Red */}
    <path d="M78,83 L64,69 L64,52 L83,52 L96,65 L78,65 Z" fill="#C5282E"/>
  </svg>
);


function App() {
  const [numDocument, setNumDocument] = useState("")
  const [born, setBorn] = useState("")
  const [mainData, setMainData] = useState(null)
  const [young, setYoung] = useState("TI")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  
  const printRef = useRef();

  useEffect(() => {
    const cachedData = localStorage.getItem("icfesCachedResult");
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      setMainData(parsed.data);
      setNumDocument(parsed.doc);
    }
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const isTi = young === "TI";
    const [year, month, day] = born.split("-");
    const fechaTransformada = `${day}/${month}/${year}`;
    
    axios.post("https://icfes-server.vercel.app/consulta", {
      document: numDocument,
      young: isTi,
      born: fechaTransformada
    }).then((response) => {
      if (response.data.status === false) {
        showToast("error", "No se encontraron resultados para este documento.")
        setLoading(false)
        return
      }
      setMainData(response.data)
      localStorage.setItem("icfesCachedResult", JSON.stringify({ data: response.data, doc: numDocument }));
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      showToast("error", "Error al consultar los resultados.")
    })
  }

  const handleLogout = () => {
    setMainData(null);
    setNumDocument("");
    setBorn("");
    localStorage.removeItem("icfesCachedResult");
  }

  const handleExportPDF = () => {
    const element = printRef.current;
    if (!element) return;
    const opt = {
      margin: 0.2,
      filename: `Resultados_Saber11_${numDocument}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }

  const getSubjectIcon = (code) => {
    switch(code) {
      case "LEC": return <IcfesIcons.Lectura />;
      case "MAT": return <IcfesIcons.Matematicas />;
      case "SOC": return <IcfesIcons.Sociales />;
      case "CIE": return <IcfesIcons.Ciencias />;
      case "ING": return <IcfesIcons.Ingles />;
      default: return <IcfesIcons.Lectura />;
    }
  };

  if (mainData) {
    const primerNombre = mainData.estudiante.split(' ')[0].toUpperCase();

    return (
      <div className="results-wrapper">
        <SEO title="Resultados | ICFES" description="Tus resultados del ICFES" url="https://icfes-consultas.vercel.app/" />
        
        {/* Top Navbar */}
        <nav className="top-nav">
           <button className="icon-btn"><IcfesIcons.Menu /></button>
           <div className="profile-menu">
             <IcfesIcons.User />
             <span>{primerNombre}</span>
             <span style={{fontSize:'0.6rem'}}>▼</span>
             <button className="btn-logout-dropdown" onClick={handleLogout}>Cerrar sesión</button>
           </div>
        </nav>

        {/* Orange Banner */}
        <div className="banner-saber">
           <div className="banner-bg-waves"></div>
           <div className="banner-content">
             <div className="banner-text">
               <h2>Resultados del Examen Saber 11º</h2>
               <p>Este examen no se pasa ni se pierde. Es una herramienta clave<br/>para que identifiques tus habilidades, las fortalezas, y puedas<br/>construir tu proyecto de vida.</p>
             </div>
             <div className="banner-logo">
               <span className="number-11">11</span>
               <div className="logo-text-stack">
                 <span className="small-text">Examen</span>
                 <span className="big-text">Saber 11º</span>
                 <span className="icfes-text">icfes <IcfesLogoSVG size={20} /></span>
               </div>
             </div>
           </div>
        </div>

        {/* Floating Toolbar */}
        <div className="floating-tools">
          <button><IcfesIcons.Contrast /></button>
          <button><IcfesIcons.ZoomIn /></button>
          <button><IcfesIcons.ZoomOut /></button>
        </div>

        <div className="report-container" ref={printRef}>
          {mainData.examenes.map((examen) => (
            <div key={examen.ACREGISTRO} className="report-section">
              <div className="section-header">
                <h3>Reporte general</h3>
                <button className="btn-print" onClick={handleExportPDF}>
                  <IcfesIcons.Printer /> Imprimir PDF
                </button>
              </div>
              
              <div className="global-flex">
                 <div className="global-left">
                    <div className="global-title">
                       <IcfesIcons.Trophy />
                       <span>Puntaje<br/>global</span>
                    </div>
                    <div className="score-big">
                       <span className="score-num">{examen.puntaje}</span><span className="score-max">/500</span>
                    </div>
                    <button className="btn-calc">¿Cómo se calcula?</button>
                 </div>
                 
                 <div className="global-right">
                    <div className="percentile-title">
                       <IcfesIcons.Pin />
                       <span>¿En qué percentiles estás?</span>
                    </div>
                    <div className="percentile-data">
                       <div className="perc-left">
                          <span className="perc-label">Estudiantes a nivel nacional</span>
                          <div className="perc-bar-container">
                             <div className="perc-bar">
                                <div className="perc-fill" style={{width: '83%'}}></div>
                                <div className="perc-segment-lines">
                                   <div></div><div></div><div></div><div></div>
                                </div>
                             </div>
                             <div className="perc-markers">
                               <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
                             </div>
                          </div>
                       </div>
                       <div className="perc-middle">
                          <span className="perc-num">83</span>
                       </div>
                       <div className="perc-right">
                          <p>Tu puntaje superó al 83 % de los estudiantes a<br/>nivel nacional.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="section-header pt-pruebas">
                <h3>Puntaje por pruebas</h3>
              </div>
              
              <div className="pruebas-grid">
                {examen.puntajeMaterias.map((materia) => (
                  <div key={materia.code} className="prueba-item">
                     <span className="prueba-name">{materia.nombrePrueba}</span>
                     <div className="prueba-score-row">
                       <div className="prueba-icon">
                          {getSubjectIcon(materia.code)}
                       </div>
                       <span className="prueba-score">{materia.puntaje}</span>
                       <span className="prueba-max">/100</span>
                     </div>
                  </div>
                ))}
              </div>

              <div className="bottom-placeholder">
                 <p>En esta zona apareceran tus percentiles, nivel de desempeño<br/>y un analisis de tus resultados en esta el área.</p>
                 <IcfesIcons.Bulb />
                 <span className="bottom-link">Conoce a detalle tus resultados</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} />}
      <SEO title="Bienvenido | ICFES" description="Consultar ICFES Saber 11." url="https://icfes-consultas.vercel.app/" />
      
      <div className="login-container">
        <div className="login-left">
          <div style={{ marginBottom: '20px' }}>
            {/* Solo dejamos el texto Bienvenido en la izquierda */}
            <h1 style={{ fontSize: '2.2rem', color: '#333' }}>Bienvenido</h1>
          </div>
          <p className="helper">
            Recuerde que para realizar su consulta debe ingresar el Tipo y Número de Documento de identidad con el que se inscribió a la prueba y la fecha de nacimiento.
          </p>

          <form onSubmit={handleSubmit} className="icfes-form">
            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
              <label>Tipo de documento <span>*</span></label>
              <select value={young} onChange={(e) => setYoung(e.target.value)} required>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
              </select>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
              <label>Número de documento <span>*</span></label>
              <input type="text" value={numDocument} onChange={(e) => setNumDocument(e.target.value)} required />
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
              <label>Fecha de nacimiento</label>
              <input type="date" value={born} onChange={(e) => setBorn(e.target.value)} max="2010-01-01" required />
            </div>

            <button type="submit" disabled={loading} className="btn-ingresar">
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <div className="login-right">
          {/* Ondas Superiores Modernas */}
          <svg className="bg-waves top-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#a6192e" fillOpacity="0.9" d="M0,0L1440,0L1440,160C960,320 480,-64 0,160Z"></path>
            <path fill="#009ca6" fillOpacity="0.8" d="M0,0L1440,0L1440,64C960,192 480,-64 0,64Z"></path>
          </svg>

          {/* Ondas Inferiores Modernas */}
          <svg className="bg-waves bottom-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#009ca6" fillOpacity="0.7" d="M0,320L1440,320L1440,96C960,256 480,-64 0,192Z"></path>
            <path fill="#a6192e" fillOpacity="0.9" d="M0,320L1440,320L1440,224C960,128 480,320 0,288Z"></path>
          </svg>

          <div className="center-logo-container">
            <span className="logo-text-huge">icfes</span>
            <IcfesLogoSVG size={70} />
          </div>
        </div>
      </div>

      <footer className="gov-footer">
        <div className="gov-footer-content">
          <div className="footer-col">
            <h4><HiOutlineShieldCheck className="footer-icon-md"/> Privacidad y Seguridad</h4>
            <p>No almacenamos ningún dato personal. Toda la información es consultada directamente desde los servidores oficiales del ICFES.</p>
          </div>
          <div className="footer-col">
            <h4><HiOutlineCode className="footer-icon-md"/> Código Abierto</h4>
            <p>Este proyecto es de código abierto. Contribuye o revisa el código en GitHub.</p>
            <a href="https://github.com/juanitogit/CONSULTAS-ICFES-MODERNO" target="_blank" rel="noreferrer" className="github-btn">
              Ver en GitHub
            </a>
          </div>
        </div>
        <div className="gov-footer-bottom">
          <p>© {new Date().getFullYear()} ICFES Consultas. Desarrollado con ❤️ para estudiantes colombianos.</p>
          <p className="disclaimer">Este sitio no está afiliado con el ICFES oficial.</p>
        </div>
      </footer>
    </>
  )
}

export default App
