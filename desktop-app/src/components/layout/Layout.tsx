import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
    return (
        <div className="flex h-screen bg-[#111] text-white overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 overflow-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5 pointer-events-none" />
                <Outlet />
            </main>
        </div>
    );
}
