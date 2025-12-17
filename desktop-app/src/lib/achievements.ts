
import { Zap, Brain, Code, Rocket, BookOpen } from 'lucide-react';

/**
 * Interfaz que define la estructura de un logro en el sistema de gamificación.
 */
export interface Achievement {
    /** Identificador único del logro. */
    id: string;
    /** Título visible del logro. */
    title: string;
    /** Descripción de cómo obtener el logro. */
    description: string;
    /** Componente de icono (Lucide icon). */
    icon: any;
    /** Clase de color de Tailwind CSS para el icono. */
    color: string;
    /** Recompensa de experiencia opcional al desbloquear el logro. */
    xpReward?: number;
}

/**
 * Lista constante de logros disponibles en la aplicación.
 */
export const ACHIEVEMENTS_DATA: Achievement[] = [
    {
        id: 'algo_1',
        title: 'Pensamiento Algorítmico I',
        description: 'Completaste tu primera lección de algoritmos.',
        icon: Brain,
        color: 'text-purple-400',
        xpReward: 50
    },
    {
        id: 'first_steps',
        title: 'Primeros Pasos',
        description: 'Completaste cualquier lección.',
        icon: BookOpen,
        color: 'text-blue-400',
        xpReward: 20
    },
    {
        id: 'rocket_science',
        title: 'Ciencia de Cohetes',
        description: 'Lanzaste el cohete en la simulación.',
        icon: Rocket,
        color: 'text-orange-400',
        xpReward: 100
    },
    {
        id: 'clean_code',
        title: 'Código Limpio',
        description: 'Resolviste un ejercicio sin errores.',
        icon: Code,
        color: 'text-green-400',
        xpReward: 80
    },
    {
        id: 'fast_learner',
        title: 'Aprendiz Veloz',
        description: 'Completaste una lección en menos de 1 minuto.',
        icon: Zap,
        color: 'text-yellow-400',
        xpReward: 50
    }
];
