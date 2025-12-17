import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

/**
 * Componente de diseño principal de la aplicación.
 * Define la estructura general con una barra lateral (Sidebar), una barra superior (TopBar)
 * y un área principal de contenido donde se renderizan las rutas anidadas (Outlet).
 *
 * @returns {JSX.Element} La estructura de la interfaz de usuario de la aplicación.
 */
export function Layout() {
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500/30">
            <Sidebar />
            <div className="md:ml-64 h-screen flex flex-col relative overflow-hidden">
                <TopBar />
                <main className="flex-1 p-6 flex justify-center overflow-y-auto scrollbar-hide">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
