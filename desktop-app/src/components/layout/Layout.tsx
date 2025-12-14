import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Layout() {
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500/30">
            <Sidebar />
            <div className="md:ml-64 min-h-screen flex flex-col relative">
                <TopBar />
                <main className="flex-1 p-6 flex justify-center">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
