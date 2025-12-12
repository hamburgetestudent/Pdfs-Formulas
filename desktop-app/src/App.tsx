import { useState } from 'react'
import './App.css'

import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Placeholder Pages
const Dashboard = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Dashboard</h1><p>Próximamente</p></div>;
const Lessons = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Lecciones</h1><p>Próximamente</p></div>;
const PDFGenerator = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Generador de PDF</h1><p>Próximamente</p></div>;
const Stats = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Estadísticas</h1><p>Próximamente</p></div>;
const Profile = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Perfil</h1><p>Próximamente</p></div>;

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="pdf-generator" element={<PDFGenerator />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
