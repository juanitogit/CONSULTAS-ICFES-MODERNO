export const IcfesIcons = {
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Printer: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
  ),
  Trophy: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#009ca6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8"></path>
      <path d="M12 17v4"></path>
      <path d="M7 4h10"></path>
      <path d="M17 4v8a5 5 0 0 1-10 0V4"></path>
      <path d="M7 9H4.5A2.5 2.5 0 0 1 2 6.5v0A2.5 2.5 0 0 1 4.5 4H7"></path>
      <path d="M17 9h2.5A2.5 2.5 0 0 0 22 6.5v0A2.5 2.5 0 0 0 19.5 4H17"></path>
    </svg>
  ),
  Pin: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#009ca6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Bulb: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6"></path>
      <path d="M10 22h4"></path>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.8 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path>
    </svg>
  ),
  Contrast: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2v20"></path>
    </svg>
  ),
  ZoomIn: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="11" y1="8" x2="11" y2="14"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
  ),
  ZoomOut: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
  ),
  // Subject Icons (Colored with pastel backgrounds as in the image)
  Lectura: () => (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="#FCE4EC" />
      <path d="M10 12v12c0 1 1 2 2 2h6v-14h-8zm8 0v14h6c1 0 2-1 2-2v-12h-8z" fill="none" stroke="#D81B60" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 16h4M12 20h4M20 16h4M20 20h4" stroke="#D81B60" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Matematicas: () => (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="#FFF3E0" />
      <rect x="10" y="10" width="16" height="18" rx="2" fill="none" stroke="#E65100" strokeWidth="1.5"/>
      <path d="M14 14h8M13 18h2M14 17v2M19 18h2M13 22h2M19 21h2M19 23h2" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Sociales: () => (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="#FCE4EC" />
      <circle cx="18" cy="18" r="7" fill="none" stroke="#C2185B" strokeWidth="1.5"/>
      <path d="M18 11v14M11 18h14M14 12c2 4 2 8 0 12M22 12c-2 4-2 8 0 12" stroke="#C2185B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 26l-2 3M22 26l2 3" stroke="#C2185B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Ciencias: () => (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="#E8F5E9" />
      <path d="M18 10c-4 0-7 3-7 7s3 7 7 7M18 24c4 0 7-3 7-7" stroke="#2E7D32" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M18 10l-2 2M18 10l2 2M18 24l-2-2M18 24l2-2" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 14c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" fill="none" stroke="#2E7D32" strokeWidth="1.5"/>
    </svg>
  ),
  Ingles: () => (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="#FFFDE7" />
      <path d="M10 18c0-4 3.5-7 8-7s8 3 8 7-3.5 7-8 7c-1.5 0-3-.5-4-1l-4 2 1-3.5c-1-1.5-1.5-3-1.5-5z" fill="none" stroke="#F57F17" strokeWidth="1.5" strokeLinejoin="round"/>
      <text x="18" y="21" fontSize="10" fontFamily="Arial" fontWeight="bold" fill="#F57F17" textAnchor="middle">Hi</text>
    </svg>
  )
}
