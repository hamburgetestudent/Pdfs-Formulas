import React from 'react';

type Shape = 'oval' | 'rectangle' | 'diamond';
type Color = 'green' | 'blue' | 'orange' | 'amber';

interface FlowChartBlockProps {
    shape?: Shape;
    text: string;
    color?: Color;
    className?: string; // Permitir estilos desde el padre (ej. posicionamiento)
}

const COLOR_MAP: Record<Color, { bg: string; border: string; text: string }> = {
    green: { bg: 'bg-green-900/40', border: 'border-green-500', text: 'text-green-100' },
    blue: { bg: 'bg-blue-900/40', border: 'border-blue-500', text: 'text-blue-100' },
    orange: { bg: 'bg-orange-900/40', border: 'border-orange-500', text: 'text-orange-100' },
    amber: { bg: 'bg-amber-900/40', border: 'border-amber-500', text: 'text-amber-100' },
};

const FlowChartBlock: React.FC<FlowChartBlockProps> = ({
    shape = 'rectangle',
    text,
    color = 'blue',
    className = '',
}) => {
    const styles = COLOR_MAP[color];

    // Base común
    const baseClasses = `
    border-2 
    flex items-center justify-center text-center font-bold shadow-lg backdrop-blur-sm
    ${styles.bg} ${styles.border} ${styles.text} 
    transition-transform hover:scale-105 duration-300
    ${className}
  `;

    // ÓVALO (Inicio/Fin)
    if (shape === 'oval') {
        return (
            <div className={`${baseClasses} rounded-[99px] px-8 py-4 min-w-[150px]`}>
                {text}
            </div>
        );
    }

    // ROMBO (Decisión)
    if (shape === 'diamond') {
        return (
            <div className={`aspect-square flex items-center justify-center p-2`}>
                {/* Contenedor rotado */}
                <div className={`${baseClasses} w-32 h-32 rotate-45 rounded-lg flex items-center justify-center`}>
                    {/* Texto contra-rotado para que se lea recto */}
                    <div className="-rotate-45 transform w-[140%] text-center text-sm leading-tight">
                        {text}
                    </div>
                </div>
            </div>
        );
    }

    // RECTÁNGULO (Proceso) - Default
    return (
        <div className={`${baseClasses} rounded-xl px-6 py-4 min-w-[180px]`}>
            {text}
        </div>
    );
};

export default FlowChartBlock;
