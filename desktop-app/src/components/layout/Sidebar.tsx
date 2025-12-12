import { NavLink } from 'react-router-dom';
import { Home, BookOpen, FileText, BarChart2, User, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export function Sidebar() {
    const navItems = [
        { icon: Home, label: 'Inicio', to: '/' },
        { icon: BookOpen, label: 'Lecciones', to: '/lessons' },
        { icon: FileText, label: 'Generador PDF', to: '/pdf-generator' },
        { icon: BarChart2, label: 'Estadísticas', to: '/stats' },
        { icon: User, label: 'Perfil', to: '/profile' },
    ];

    return (
        <aside className="w-64 bg-[#1e1e1e] border-r border-[#333] flex flex-col h-screen">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    PhysiCode
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 font-medium"
                                    : "text-gray-400 hover:bg-[#252526] hover:text-white"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-[#333]">
                <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full rounded-xl hover:bg-[#252526]">
                    <Settings className="w-5 h-5" />
                    <span>Configuración</span>
                </button>
            </div>
        </aside>
    );
}
