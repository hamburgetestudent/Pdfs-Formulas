import { NavLink } from 'react-router-dom';
import { BookOpen, Trophy, Zap, User, Terminal } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Función de utilidad para combinar clases de Tailwind de manera condicional y segura.
 * @param inputs Lista de clases o condiciones.
 * @returns {string} Cadena de clases combinadas.
 */
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

/**
 * Componente de barra lateral de navegación.
 * Muestra el logo, enlaces de navegación y un widget de progreso de misión diaria.
 * Solo visible en pantallas medianas y grandes (hidden md:flex).
 *
 * @returns {JSX.Element} La barra lateral de navegación.
 */
export function Sidebar() {
    const navItems = [
        { icon: BookOpen, label: "Aprender", to: "/" },
        { icon: Trophy, label: "Clasificación", to: "/leaderboard" },
        { icon: Zap, label: "Desafíos", to: "/quests" },
        { icon: User, label: "Perfil", to: "/profile" },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-6 fixed h-full z-10">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
                    <Terminal size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-wider">PhysiCode</h1>
            </div>

            <nav className="space-y-4 flex-1">
                {navItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-gray-800 text-cyan-400 border border-gray-700 font-semibold"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white font-semibold"
                            )
                        }
                    >
                        <item.icon size={22} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-2">Misión Diaria</h3>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full w-3/4"></div>
                </div>
                <p className="text-xs text-right text-cyan-400 mt-1">3/4 Lecciones</p>
            </div>
        </div>
    );
}
