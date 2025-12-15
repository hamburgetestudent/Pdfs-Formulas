import { Terminal, Flame, Zap } from 'lucide-react';
import { useState } from 'react';

export function TopBar() {
    const [streak] = useState(12);
    const [gems] = useState(1240);

    return (
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur z-20 border-b border-gray-800 p-4 flex justify-between md:justify-end gap-6 items-center w-full h-16">
            <div className="md:hidden flex items-center gap-2">
                <Terminal size={24} className="text-purple-500" />
            </div>

            <div className="flex gap-6">
                <div className="flex items-center gap-2 text-orange-400 font-bold">
                    <Flame size={20} fill="currentColor" />
                    <span>{streak}</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Zap size={20} fill="currentColor" />
                    <span>{gems}</span>
                </div>
            </div>
        </div>
    );
}
