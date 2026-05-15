import { useLocation } from "react-router-dom"

/* eslint-disable react/prop-types */
function Layout({ children }) {
  const currentPath = useLocation().pathname
  return (
    <main>
      <section className="main-section-layout">
        {children}
      </section>
    </main>
  )
}

export default Layout