# 🎓 ICFES WEB CONSULTA

Una aplicación moderna, limpia y altamente profesional para consultar resultados de exámenes ICFES Saber 11 en Colombia.

## ✨ Características del Diseño

### 🎨 Estética Oficial e Institucional

- **Diseño Corporativo**: Interfaz inspirada en el portal oficial del ICFES, transmitiendo confianza y seriedad.
- **Paleta de Colores**: Uso de los colores institucionales exactos (Cian `#009ca6` y Granate `#a6192e`).
- **Ondas Vectoriales**: Implementación nativa de las ondas del diseño oficial mediante `SVG` para una resolución perfecta sin imágenes pesadas.
- **Iconografía Personalizada**: Íconos de asignaturas y herramientas vectorizados a mano respetando la estética en colores pastel.

### 🎭 Componentes Funcionales

- **Formulario de Ingreso Clean**: Diseño "split-screen" con validación visual.
- **Reporte Detallado**: Gráficos de barras nativos y visualización de puntaje global y percentiles.
- **Exportación a PDF**: Generación en un clic del reporte de resultados exacto para imprimir o guardar, mediante `html2pdf.js`.

### 🎯 Experiencia de Usuario & Productividad

- **Caché Inteligente**: Tus resultados se guardan localmente para que no tengas que volver a llenar el formulario si refrescas la página.
- **Visualización Rápida**: Interfaz optimizada sin tiempos de carga innecesarios.
- **Diseño Responsivo**: Perfectamente adaptable a teléfonos móviles, manteniendo la legibilidad de puntajes.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool y optimización
- **Axios** - Peticiones HTTP al servidor de consultas
- **html2pdf.js** - Exportación de resultados
- **CSS Moderno** - Vectores SVG, flexbox y diseño responsivo puro

## 🚀 Optimización SEO

- ✅ Title, Description, Keywords optimizados
- ✅ Configuración Schema.org JSON-LD y Open Graph
- ✅ `robots.txt` y `sitemap.xml` integrados

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── IcfesIcons.jsx   # Colección de íconos SVG vectorizados
│   └── SEO.jsx          # Componente de meta tags dinámicos
├── App.jsx              # Vista principal (Login y Resultados)
├── index.css            # Hoja de estilos institucionales
└── main.jsx             # Punto de entrada
```

## 🌟 Características Técnicas

- ✅ UI Renderizada completamente sin imágenes de mapa de bits externas para los fondos (Full SVG)
- ✅ Guardado en caché de sesión en `localStorage`
- ✅ Code splitting automático y arquitectura minimalista
- ✅ Rendimiento excepcional (Score 100 en Lighthouse)

## 📝 Contribuciones y Autoría

Desarrollado y mantenido de código abierto por **[@juanitogit](https://github.com/juanitogit)**.
Repositorio oficial: [CONSULTAS-ICFES-MODERNO](https://github.com/juanitogit/CONSULTAS-ICFES-MODERNO)

> **Aviso Legal:** Este sitio de código abierto es una herramienta independiente desarrollada con fines educativos y de accesibilidad. No está afiliado, avalado ni respaldado por el ICFES oficial.

---

Desarrollado con ❤️ para mejorar la experiencia de consulta de resultados de los estudiantes colombianos.
