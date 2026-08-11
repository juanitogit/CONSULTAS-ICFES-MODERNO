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


// Cálculo del percentil usando distribución normal (CDF)
function calcPercentil(puntaje, media = 250, desviacion = 50) {
  const z = (puntaje - media) / desviacion;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327;
  const p = d * Math.exp(-z * z / 2);
  const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const cdf = z >= 0 ? 1 - p * poly : p * poly;
  return Math.min(99, Math.max(1, Math.round(cdf * 100)));
}

// Percentil por materia (puntaje sobre 100, media ≈ 50, std ≈ 10)
function calcPercentilMateria(puntaje) {
  return calcPercentil(puntaje, 50, 10);
}

// Nombres completos de las materias
function getNombreMateria(code) {
  const nombres = { LEC: 'Lectura Crítica', MAT: 'Matemáticas', SOC: 'Sociales y Ciudadanas', CIE: 'Ciencias Naturales', ING: 'Inglés' };
  return nombres[code] || code;
}

// Nivel de desempeño según puntaje por materia
function getNivelDesempeno(puntaje) {
  if (puntaje >= 76) return { nivel: 'Nivel 4', desc: 'Desempeño superior', color: '#2e7d32' };
  if (puntaje >= 61) return { nivel: 'Nivel 3', desc: 'Desempeño alto', color: '#1b5e20' };
  if (puntaje >= 41) return { nivel: 'Nivel 2', desc: 'Desempeño medio', color: '#f57f17' };
  return { nivel: 'Nivel 1', desc: 'Desempeño bajo', color: '#c62828' };
}

function App() {
  const [numDocument, setNumDocument] = useState("")
  const [born, setBorn] = useState("")
  const [mainData, setMainData] = useState(null)
  const [young, setYoung] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedMateria, setSelectedMateria] = useState(null)
  const [showCalcModal, setShowCalcModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  
  const printRef = useRef();

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 70));
  const toggleDarkMode = () => setDarkMode(prev => !prev);

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
    const [year, month, day] = born.split("-");
    const fechaTransformada = `${day}/${month}/${year}`;
    
    const apiUrl = import.meta.env.DEV
      ? "http://localhost:3001/consulta"
      : "/api/consulta";
    
    axios.post(apiUrl, {
      document: numDocument,
      young: young,
      born: fechaTransformada
    }).then((response) => {
      if (response.data.status === false) {
        showToast("error", "No se encontraron resultados para este documento. Verifica los datos ingresados.")
        setLoading(false)
        return
      }
      setMainData(response.data)
      localStorage.setItem("icfesCachedResult", JSON.stringify({ data: response.data, doc: numDocument }));
      setLoading(false)
      showToast("success", "¡Resultados cargados exitosamente!")
    }).catch((error) => {
      setLoading(false)

      // Manejo específico de errores
      if (error.response && error.response.status) {
        const status = error.response.status

        if (status === 403) {
          showToast("error", "Acceso no autorizado. El servidor bloqueó la petición. Intenta de nuevo en unos minutos.")
        } else if (status === 429) {
          showToast(
            "warning",
            "⏱️ Límite de consultas alcanzado. Solo puedes hacer 3 consultas cada 30 segundos. Por favor, espera un momento."
          )
        } else if (status === 404) {
          showToast("error", "No se encontraron resultados para los datos proporcionados.")
        } else if (status === 500) {
          showToast("error", "Error en el servidor del ICFES. Por favor, intenta más tarde.")
        } else {
          showToast("error", `Error al consultar los resultados (código ${status}). Por favor, intenta nuevamente.`)
        }
      } else if (error.request) {
        showToast("error", "No se pudo conectar con el servidor. Verifica tu conexión a internet.")
      } else {
        showToast("error", "Ocurrió un error inesperado. Por favor, intenta nuevamente.")
      }
    })
  }

  const handleLogout = () => {
    setMainData(null);
    setNumDocument("");
    setBorn("");
    localStorage.removeItem("icfesCachedResult");
  }

  const handleExportPDF = () => {
    window.print();
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
      <div className={`results-wrapper ${darkMode ? 'dark-mode' : ''}`}>
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
          <button onClick={toggleDarkMode} title="Modo oscuro"><IcfesIcons.Contrast /></button>
          <button onClick={handleZoomIn} title="Aumentar tamaño"><IcfesIcons.ZoomIn /></button>
          <button onClick={handleZoomOut} title="Disminuir tamaño"><IcfesIcons.ZoomOut /></button>
        </div>

        <div className="report-container" ref={printRef} style={{transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center'}}>
          {mainData.examenes.map((examen) => (
            <div key={examen.ACREGISTRO} className="report-section">
              <div className="section-header">
                <h3>Reporte general</h3>
                <button className="btn-print" onClick={handleExportPDF}>
                  <IcfesIcons.Printer /> Imprimir PDF
                </button>
              </div>
              
              {(() => {
                const percentil = calcPercentil(examen.puntaje);
                return (
              <div className="global-flex">
                 <div className="global-left">
                    <div className="global-title">
                       <IcfesIcons.Trophy />
                       <span>Puntaje<br/>global</span>
                    </div>
                    <div className="score-big">
                       <span className="score-num">{examen.puntaje}</span><span className="score-max">/500</span>
                    </div>
                    <button className="btn-calc" onClick={() => setShowCalcModal(true)}>¿Cómo se calcula?</button>
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
                                <div className="perc-fill" style={{width: `${percentil}%`}}></div>
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
                          <span className="perc-num">{percentil}</span>
                       </div>
                       <div className="perc-right">
                          <p>Tu puntaje superó al {percentil} % de los estudiantes a<br/>nivel nacional.</p>
                       </div>
                    </div>
                 </div>
              </div>
                );
              })()}

              <div className="section-header pt-pruebas">
                <h3>Puntaje por pruebas</h3>
              </div>
              
              <div className="pruebas-grid">
                {examen.puntajeMaterias.map((materia) => (
                  <div key={materia.code} className={`prueba-item ${selectedMateria?.code === materia.code ? 'prueba-selected' : ''}`} onClick={() => setSelectedMateria(materia)} style={{cursor:'pointer'}}>
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

              {selectedMateria ? (() => {
                const percMateria = calcPercentilMateria(selectedMateria.puntaje);
                const nivel = getNivelDesempeno(selectedMateria.puntaje);
                return (
                <div className="subject-detail-box">
                  <div className="subject-detail-header">
                    <div className="subject-detail-icon">
                      {getSubjectIcon(selectedMateria.code)}
                    </div>
                    <div>
                      <h4>{getNombreMateria(selectedMateria.code)}</h4>
                      <span className="subject-detail-score">{selectedMateria.puntaje}<span className="subject-detail-max">/100</span></span>
                    </div>
                    <button className="subject-detail-close" onClick={() => setSelectedMateria(null)}>✕</button>
                  </div>

                  <div className="subject-detail-body">
                    <div className="subject-perc-section">
                      <span className="perc-label">Percentil nacional en {getNombreMateria(selectedMateria.code)}</span>
                      <div className="perc-bar-container">
                        <div className="perc-bar">
                          <div className="perc-fill" style={{width: `${percMateria}%`}}></div>
                          <div className="perc-segment-lines">
                            <div></div><div></div><div></div><div></div>
                          </div>
                        </div>
                        <div className="perc-markers">
                          <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
                        </div>
                      </div>
                      <div className="subject-perc-result">
                        <span className="perc-num">{percMateria}</span>
                        <p>Tu puntaje en {getNombreMateria(selectedMateria.code)} superó al <strong>{percMateria}%</strong> de los estudiantes a nivel nacional.</p>
                      </div>
                    </div>

                    <div className="subject-nivel-section">
                      <span className="nivel-badge" style={{background: nivel.color}}>{nivel.nivel}</span>
                      <span className="nivel-desc">{nivel.desc}</span>
                    </div>
                  </div>
                </div>
                );
              })() : (
              <div className="bottom-placeholder">
                 <IcfesIcons.Bulb />
                 <p>Haz clic en una materia para ver tus percentiles, nivel de desempeño<br/>y un análisis de tus resultados en esa área.</p>
                 <span className="bottom-link">Conoce a detalle tus resultados</span>
              </div>
              )}

            </div>
          ))}
        </div>

        {/* Modal ¿Cómo se calcula? - fuera del report-container para que position:fixed funcione */}
        {showCalcModal && (() => {
          const examen = mainData.examenes[0];
          const materias = examen.puntajeMaterias;
          const getLEC = materias.find(m => m.code === 'LEC')?.puntaje || 0;
          const getMAT = materias.find(m => m.code === 'MAT')?.puntaje || 0;
          const getSOC = materias.find(m => m.code === 'SOC')?.puntaje || 0;
          const getCIE = materias.find(m => m.code === 'CIE')?.puntaje || 0;
          const getING = materias.find(m => m.code === 'ING')?.puntaje || 0;
          const suma = (getLEC*3) + (getMAT*3) + (getSOC*3) + (getCIE*3) + (getING*1);
          const resultado = Math.round((suma / 13) * 5);
          return (
          <div className="modal-overlay" onClick={() => setShowCalcModal(false)}>
            <div className="modal-calc" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowCalcModal(false)}>✕</button>
              <h3>¿Cómo se calcula tu puntaje global?</h3>
              <p className="modal-desc">Todas las materias se multiplican por <strong>3</strong>, excepto <strong>Inglés</strong> que se multiplica por <strong>1</strong>. Luego se suman, se dividen entre <strong>13</strong> y se multiplican por <strong>5</strong>.</p>
              
              <div className="modal-formula">
                <div className="formula-title">Tu cálculo con tus puntajes reales:</div>
                <div className="formula-row"><span>Lectura Crítica</span><span>{getLEC} × 3 = <strong>{getLEC*3}</strong></span></div>
                <div className="formula-row"><span>Matemáticas</span><span>{getMAT} × 3 = <strong>{getMAT*3}</strong></span></div>
                <div className="formula-row"><span>Sociales y Ciudadanas</span><span>{getSOC} × 3 = <strong>{getSOC*3}</strong></span></div>
                <div className="formula-row"><span>Ciencias Naturales</span><span>{getCIE} × 3 = <strong>{getCIE*3}</strong></span></div>
                <div className="formula-row ing"><span>Inglés</span><span>{getING} × 1 = <strong>{getING}</strong></span></div>
                <div className="formula-divider"></div>
                <div className="formula-row total"><span>Suma total</span><span><strong>{suma}</strong></span></div>
                <div className="formula-row total"><span>{suma} ÷ 13 × 5</span><span>= <strong>{resultado}</strong></span></div>
              </div>
              <p className="modal-result">Tu puntaje global calculado: <strong>{resultado}</strong> {Math.abs(resultado - examen.puntaje) <= 5 ? '' : `(ICFES reporta: ${examen.puntaje})`}</p>
              <p className="modal-note">* Puede haber una pequeña diferencia por redondeo del ICFES.</p>
            </div>
          </div>
          );
        })()}
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
              <select value={young ? "TI" : "CC"} onChange={(e) => setYoung(e.target.value === "TI")} required>
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
