import './App.css'

import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import Profile from './pages/Profile';

// Páginas de marcador de posición (Placeholder)
/**
 * Componente de marcador de posición para el generador de PDF.
 */
const PDFGenerator = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Generador de PDF</h1><p>Próximamente</p></div>;

/**
 * Componente de marcador de posición para las estadísticas.
 */
const Stats = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Estadísticas</h1><p>Próximamente</p></div>;

import { DevModeProvider } from './context/DevModeContext';

/**
 * Componente principal de la aplicación.
 * Configura el enrutador (HashRouter) y define las rutas principales dentro del diseño (Layout).
 *
 * @returns {JSX.Element} La estructura de enrutamiento de la aplicación.
 */
function App() {
  return (
    <DevModeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="lessons/:lessonId" element={<Lesson />} />
            <Route path="pdf-generator" element={<PDFGenerator />} />
            <Route path="stats" element={<Stats />} />
            <Route path="profile" element={<Profile />} />
          </Route >
        </Routes >
      </HashRouter >
    </DevModeProvider>
  );
}

export default App;
