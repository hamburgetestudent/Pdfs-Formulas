import { useState, useEffect, useMemo } from 'react';
import { Rocket, CheckCircle, RotateCcw, ArrowLeft, AlertCircle, Bot, MoveRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDevMode } from '../context/DevModeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { LESSONS_DATA } from '../lib/lessons';

// Ayudante para efectos de confeti
const Confetti = () => <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
    <div className="absolute top-0 left-1/4 animate-bounce text-4xl">🎉</div>
    <div className="absolute top-10 right-1/4 animate-bounce delay-100 text-4xl">✨</div>
    <div className="absolute bottom-1/4 left-1/3 animate-bounce delay-200 text-4xl">⭐</div>
</div>;

/**
 * Componente principal para visualizar una lección.
 * Soporta múltiples tipos de lecciones: simulación, quiz, arrastrar y soltar (drag_drop), y teoría.
 * Gestiona el estado interactivo, la validación de respuestas y la navegación entre lecciones.
 *
 * @returns {JSX.Element} La interfaz de usuario de la lección activa.
 */
export default function Lesson() {
    const navigate = useNavigate();
    const { lessonId } = useParams();
    const { isDevMode } = useDevMode();
    const lesson = lessonId ? LESSONS_DATA[lessonId] : null;

    // Estados para la interacción del usuario
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
    const [userSequence, setUserSequence] = useState<string[]>([]); // Para drag_drop
    const [inlineAnswers, setInlineAnswers] = useState<Record<number, boolean | null>>({}); // Para bloques true_false
    const [showFeedback, setShowFeedback] = useState<'success' | 'error' | 'trap' | null>(null);
    const [rocketPos, setRocketPos] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showSummary, setShowSummary] = useState(false); // Nuevo: Mostrar pantalla de resumen

    // Seguimiento de estadísticas
    const startTimeRef = useState(Date.now())[0]; // Constante para este montaje
    const [mistakes, setMistakes] = useState(0);


    // Reiniciar estado cuando cambia la lección
    useEffect(() => {
        setSelectedAnswer(null);
        setUserSequence([]);
        setInlineAnswers({});
        setShowFeedback(null);
        setRocketPos(0);
        setIsAnimating(false);
    }, [lessonId]);

    // Simulación de animación del cohete
    useEffect(() => {
        if (isAnimating && lesson?.type === 'simulation') {
            const interval = setInterval(() => {
                setRocketPos((prev) => {
                    if (prev >= 100) {
                        setIsAnimating(false);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isAnimating, lesson]);

<<<<<<< HEAD

    const { totalLessons, currentIndex, chain } = useMemo(() => {
        if (!lessonId) return { totalLessons: 1, currentIndex: 0, chain: [] };

        // 1. Identify Group Prefix
=======
    // Calcular progreso global en la secuencia de lecciones
    const { totalLessons, currentIndex } = useMemo(() => {
        if (!lessonId) return { totalLessons: 1, currentIndex: 0 };

        // 1. Identificar prefijo del grupo (ej: 'Python-Fundamentos-Algoritmos')
>>>>>>> 5b7c915c9e23a1beb4349bb8e56c8cae6b835d92
        const prefix = lessonId.split('-').slice(0, -1).join('-');

        // 2. Obtener todas las lecciones de este grupo
        const groupLessons = Object.values(LESSONS_DATA).filter(l => l.id.startsWith(prefix));

<<<<<<< HEAD
        // 3. Reconstruct Chain
=======
        // 3. Reconstruir la cadena
        // Encontrar el nodo inicial (ninguna otra lección apunta a él)
>>>>>>> 5b7c915c9e23a1beb4349bb8e56c8cae6b835d92
        const referencedIds = new Set(groupLessons.map(l => l.nextLessonId).filter(Boolean));
        const startLesson = groupLessons.find(l => !referencedIds.has(l.id));

        if (!startLesson) return { totalLessons: groupLessons.length, currentIndex: 0, chain: [] };

        const chain: string[] = [];
        let current: string | undefined = startLesson.id;

        while (current) {
            chain.push(current);
<<<<<<< HEAD
            const currLesson = LESSONS_DATA[current];
            if (currLesson?.nextLessonId?.startsWith(prefix)) {
=======
            const currLesson = LESSONS_DATA[current] as any;
            // Solo seguir si la siguiente está en el mismo grupo (prevenir saltos de tema)
            if (currLesson && currLesson.nextLessonId && currLesson.nextLessonId.startsWith(prefix)) {
>>>>>>> 5b7c915c9e23a1beb4349bb8e56c8cae6b835d92
                current = currLesson.nextLessonId;
            } else {
                current = undefined;
            }
        }

        const index = chain.indexOf(lessonId);
        return {
            totalLessons: chain.length,
            currentIndex: index !== -1 ? index : 0,
            chain
        };
    }, [lessonId]);

    /**
     * Valida la respuesta del usuario según el tipo de lección.
     */
    const handleCheck = () => {
        if (!lesson) return;

        // Validación de Teoría
        if (lesson.type === 'theory') {
            // Si tiene bloques interactivos (true_false), validarlos
            const interactiveBlocks = lesson.theoryBlocks?.filter(b => b.type === 'true_false') || [];
            if (interactiveBlocks.length > 0) {
                // Verificar si todas las respuestas inline son correctas
                let allCorrect = true;
                lesson.theoryBlocks?.forEach((block, idx) => {
                    if (block.type === 'true_false') {
                        if (inlineAnswers[idx] !== block.answer) {
                            allCorrect = false;
                        }
                    }
                });

                if (allCorrect) {
                    setShowFeedback('success');
                } else {
                    // Podríamos establecer un mensaje de error personalizado para teoría
                    setShowFeedback('error');
                }
                return;
            }

            // Teoría normal (solo lectura) siempre es éxito
            setShowFeedback('success');
            return;
        }

        let isCorrect = false;
        let isTrap = false;

        if (lesson.type === 'simulation' && lesson.simulationConfig) {
            isCorrect = lesson.simulationConfig.verifyFunction(selectedAnswer);
        } else if (lesson.type === 'quiz' && lesson.quizConfig) {
            const option = lesson.quizConfig.options.find(o => o.id === selectedAnswer);
            isCorrect = option?.correct || false;
        } else if (lesson.type === 'drag_drop' && lesson.dragDropConfig) {
            // Comprobar trampa primero (si la trampa está en el índice 0)
            if (lesson.dragDropConfig.trapId && userSequence[0] === lesson.dragDropConfig.trapId) {
                isTrap = true;
            } else {
                // Comprobar coincidencia exacta de secuencia
                const target = lesson.dragDropConfig.correctSequence;
                if (userSequence.length !== target.length) {
                    isCorrect = false;
                } else {
                    const match = userSequence.every((id, index) => id === target[index]);
                    if (match) {
                        isCorrect = true;
                    }
                }
            }
        }

        if (isTrap) {
            setShowFeedback('trap');
            setMistakes(prev => prev + 1);
        } else if (isCorrect) {
            setShowFeedback('success');
            if (lesson.type === 'simulation' && lesson.simulationConfig?.type === 'rocket_launch') {
                setIsAnimating(true);
            }
        } else {
            setShowFeedback('error');
            setMistakes(prev => prev + 1);
        }
    };

    /**
     * Maneja la navegación a la siguiente lección o muestra el resumen.
     */
    const handleContinue = () => {
        if (showFeedback === 'success') {
            const timeSpent = Date.now() - startTimeRef;

            // Guardar/Actualizar estadísticas en localStorage
            if (lessonId) {
                const prefix = lessonId.split('-').slice(0, -1).join('-');
                const storageKey = `stats_${prefix}`;
                let currentStats;
                try {
                    currentStats = JSON.parse(localStorage.getItem(storageKey) || '{"totalTime": 0, "mistakes": 0, "completed": 0}');
                } catch {
                    currentStats = { totalTime: 0, mistakes: 0, completed: 0 };
                }

                const newStats = {
                    totalTime: currentStats.totalTime + timeSpent,
                    mistakes: currentStats.mistakes + mistakes,
                    completed: currentStats.completed + 1
                };
                localStorage.setItem(storageKey, JSON.stringify(newStats));
            }

            if (lesson?.nextLessonId) {
                navigate(`/lessons/${lesson.nextLessonId}`);
            } else {
                // Fin del módulo - Verificar Logros
                let currentAchievements: string[] = [];
                try {
                    currentAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
                } catch {
                    currentAchievements = [];
                }

                const newAchievements = [...currentAchievements];
                let achievementUnlocked = false;

                // 1. "Primeros Pasos" Genérico
                if (!newAchievements.includes('first_steps')) {
                    newAchievements.push('first_steps');
                    achievementUnlocked = true;
                }

                // 2. "Pensamiento Algorítmico I" Específico
                const prefix = lessonId?.split('-').slice(0, -1).join('-');
                if (prefix === 'Python-Fundamentos-Algoritmos' && !newAchievements.includes('algo_1')) {
                    newAchievements.push('algo_1');
                    achievementUnlocked = true;
                }

                if (achievementUnlocked) {
                    localStorage.setItem('achievements', JSON.stringify(newAchievements));
                }

                setShowSummary(true);
            }
        } else {
            setShowFeedback(null);
        }
    };

    /**
     * Añade un elemento a la secuencia del usuario en ejercicios drag_drop.
     */
    const addToSequence = (id: string) => {
        if (!userSequence.includes(id)) {
            setUserSequence([...userSequence, id]);
            setShowFeedback(null);
        }
    };

    /**
     * Elimina un elemento de la secuencia del usuario.
     */
    const removeFromSequence = (id: string) => {
        setUserSequence(userSequence.filter(item => item !== id));
        setShowFeedback(null);
    };

    // Calcular progreso visual basado en el tipo de lección
    const progress = (() => {
        if (!lesson) return 0;

        let internalProgress = 0; // 0 a 1

        if (lesson.type === 'theory') {
            const interactiveBlocks = lesson.theoryBlocks?.filter(b => b.type === 'true_false') || [];
            if (interactiveBlocks.length === 0) {
                internalProgress = showFeedback === 'success' ? 1 : 0;
            } else {
                const answeredCount = Object.keys(inlineAnswers).length;
                internalProgress = answeredCount / interactiveBlocks.length;
            }
        } else if (lesson.type === 'drag_drop' && lesson.dragDropConfig) {
            const targetLength = lesson.dragDropConfig.correctSequence.length;
            const currentLength = userSequence.length;
            internalProgress = Math.min(1, currentLength / targetLength);
            if (showFeedback === 'success') internalProgress = 1;
        } else if (lesson.type === 'quiz' || lesson.type === 'simulation') {
            if (showFeedback === 'success') internalProgress = 1;
            // Parcial por seleccionar respuesta
            else if (selectedAnswer !== null) internalProgress = 0.5;
            else internalProgress = 0;
        }

        // Fórmula global
        return Math.min(100, ((currentIndex + internalProgress) / totalLessons) * 100);
    })();

    if (showSummary) {
        const prefix = lessonId?.split('-').slice(0, -1).join('-') || 'default';
        const storageKey = `stats_${prefix}`;
        let stats;
        try {
            stats = JSON.parse(localStorage.getItem(storageKey) || '{"totalTime": 0, "mistakes": 0, "completed": 0}');
        } catch {
            stats = { totalTime: 0, mistakes: 0, completed: 0 };
        }

        const seconds = Math.floor(stats.totalTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Precisión simple: Comienza en 100%, reduce 10% por error, min 0%
        const accuracy = Math.max(0, 100 - (stats.mistakes * 10));

        return (
            <div className="flex flex-col items-center justify-center h-full text-white animate-in zoom-in-50 duration-500">
                <Confetti />
                <div className="bg-gray-800/80 p-12 rounded-3xl border border-cyan-500/30 text-center max-w-lg w-full shadow-2xl backdrop-blur-xl">
                    <div className="bg-cyan-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                        <CheckCircle size={48} className="text-cyan-400" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent mb-2">¡Misión Cumplida!</h1>
                    <p className="text-gray-400 mb-8">Has dominado este módulo.</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700">
                            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Tiempo</p>
                            <p className="text-2xl font-mono font-bold text-white">{minutes}m {remainingSeconds}s</p>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700">
                            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Precisión</p>
                            <p className={`text-2xl font-mono font-bold ${accuracy > 80 ? 'text-green-400' : accuracy > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{accuracy}%</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-400 mb-8 relative">
                        <div className="flex justify-between border-b border-gray-700/50 pb-2">
                            <span>Respuestas Correctas</span>
                            <span className="text-white">{stats.completed}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span>Errores/Reintentos</span>
                            <span className="text-red-300">{stats.mistakes}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem(storageKey); // Limpiar estadísticas
                            navigate('/');
                        }}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-white text-black hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white">
                <AlertCircle size={48} className="mb-4 text-red-400" />
                <h2 className="text-2xl font-bold">Lección no encontrada</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-cyan-400 hover:underline">Volver al inicio</button>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-100px)] overflow-y-auto flex flex-col pb-40 relative" id="lesson-container">
            {showFeedback === 'success' && <Confetti />}

            {/* Cabecera de navegación */}
            <div className="max-w-3xl mx-auto w-full px-4 pt-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={20} />
                    <span>Salir</span>
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{lesson.title}</h1>
                        <p className="text-gray-400 mb-6">{lesson.instructions}</p>
                    </div>
                    {/* Avatar de Robot para Drag Drop */}
                    {lesson.type === 'drag_drop' && (
                        <div className={`transition-transform duration-500 ${showFeedback === 'trap' || showFeedback === 'error' ? 'shake-animation' : ''}`}>
                            <div className={`p-4 rounded-full border-4 ${showFeedback === 'success' ? 'bg-green-500 border-green-300' :
                                showFeedback === 'trap' ? 'bg-amber-500 border-amber-300' :
                                    showFeedback === 'error' ? 'bg-red-500 border-red-300' :
                                        'bg-gray-700 border-gray-500'
                                }`}>
                                <Bot size={40} className="text-white" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col px-4">
                {/* Barra de Progreso Dinámica */}
                <div className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    {/* Área de Contenido Dinámico */}

                    {/* SIMULACIÓN */}
                    {lesson.type === 'simulation' && lesson.simulationConfig && (
                        <>
                            <div className="bg-gray-800 rounded-xl p-8 h-64 flex items-end justify-center relative overflow-hidden border border-gray-700 shadow-inner">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                                {lesson.simulationConfig.type === 'rocket_launch' && (
                                    <>
                                        <div
                                            className="transition-all duration-1000 ease-out absolute z-10"
                                            style={{ bottom: `${rocketPos}%`, transform: 'translateY(50%)' }}
                                        >
                                            <Rocket size={64} className="text-orange-500 transform -rotate-45 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                                            {isAnimating && <div className="absolute top-12 left-4 w-8 h-16 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent opacity-80 blur-md rounded-full animate-pulse"></div>}
                                        </div>
                                        <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-purple-900 to-purple-800/50 border-t border-purple-500/30"></div>
                                    </>
                                )}
                            </div>
                            <div className="bg-[#1E1E1E] rounded-xl p-6 font-mono text-sm md:text-base border-l-4 border-cyan-500 shadow-2xl relative">
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <pre className="whitespace-pre-wrap font-inherit">
                                    {lesson.simulationConfig.initialCode.split('???')[0]}
                                    <span className="inline-block relative group">
                                        <span className={`inline-block min-w-16 h-6 border-b-2 text-center align-middle transition-colors font-bold ${selectedAnswer !== null ? 'text-cyan-300 border-cyan-500' : 'text-gray-500 border-gray-600 border-dashed'
                                            }`}>
                                            {selectedAnswer !== null
                                                ? lesson.simulationConfig.options.find(o => o.value === selectedAnswer)?.code
                                                : '?'}
                                        </span>
                                        {!selectedAnswer && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Selecciona un valor</span>}
                                    </span>
                                    {lesson.simulationConfig.initialCode.split('???')[1]}
                                </pre>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-32">
                                {lesson.simulationConfig.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setSelectedAnswer(opt.value); setShowFeedback(null); setRocketPos(0); setIsAnimating(false); }}
                                        className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${selectedAnswer === opt.value
                                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                            : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-500 text-gray-300'
                                            }`}
                                    >
                                        <div className={`absolute inset-0 bg-cyan-400/5 transition-transform duration-300 origin-left ${selectedAnswer === opt.value ? 'scale-x-100' : 'scale-x-0'}`}></div>
                                        <code className="bg-black/30 px-2 py-1 rounded text-sm block mb-2 font-bold group-hover:text-white transition-colors">{opt.code}</code>
                                        <span className="text-xs text-gray-400 group-hover:text-gray-300">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* QUIZ */}
                    {lesson.type === 'quiz' && lesson.quizConfig && (
                        <div className="flex flex-col gap-8 items-center justify-center flex-1">
                            <h2 className="text-3xl font-bold text-center mb-8">{lesson.quizConfig.question}</h2>
                            <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
                                {lesson.quizConfig.options.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => { setSelectedAnswer(option.id); setShowFeedback(null); }}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all text-xl font-medium ${selectedAnswer === option.id
                                            ? 'border-cyan-400 bg-cyan-900/30 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                            : 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${selectedAnswer === option.id ? 'border-cyan-400 text-cyan-400' : 'border-gray-600 text-gray-600'
                                                }`}>
                                                {option.id}
                                            </div>
                                            <span className="whitespace-pre-line">{option.text}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ARRASTRAR Y SOLTAR (DRAG AND DROP) */}
                    {lesson.type === 'drag_drop' && lesson.dragDropConfig && (
                        <div className="flex flex-col md:flex-row gap-8 flex-1">
                            {/* Reserva (Pool) */}
                            <div className="flex-1 md:border-r border-gray-800 md:pr-4">
                                <h3 className="text-cyan-400 font-bold mb-4 uppercase text-xs tracking-wider">Pasos Disponibles</h3>
                                <div className="space-y-3">
                                    {lesson.dragDropConfig.items.filter(i => !userSequence.includes(i.id)).map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => addToSequence(item.id)}
                                            className="w-full p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-left transition-all active:scale-95 flex justify-between items-center group"
                                        >
                                            <span className="font-medium text-gray-200">{item.text}</span>
                                            <MoveRight size={16} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                                        </button>
                                    ))}
                                    {lesson.dragDropConfig.items.filter(i => !userSequence.includes(i.id)).length === 0 && (
                                        <div className="text-gray-600 italic text-center py-4 text-sm">Todo asignado</div>
                                    )}
                                </div>
                            </div>

                            {/* Secuencia */}
                            <div className="flex-1 bg-gray-900/50 rounded-2xl p-6 border-2 border-dashed border-gray-700 min-h-[300px] shadow-inner">
                                <h3 className="text-purple-400 font-bold mb-4 uppercase text-xs tracking-wider flex items-center gap-2">
                                    Tu Algoritmo <span className="text-gray-600 text-[10px]">(Orden de ejecución)</span>
                                </h3>
                                <div className="space-y-3">
                                    {userSequence.map((seqId, idx) => {
                                        const item = lesson.dragDropConfig?.items.find(i => i.id === seqId);
                                        return (
                                            <div key={seqId} className="w-full p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl flex justify-between items-center animate-in slide-in-from-left-2 fade-in duration-300">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-purple-900 text-purple-200 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                                    <span className="font-medium text-purple-100">{item?.text}</span>
                                                </div>
                                                <button onClick={() => removeFromSequence(seqId)} className="text-gray-400 hover:text-red-400 p-1 hover:bg-red-500/10 rounded-lg transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {userSequence.length === 0 && (
                                        <div className="text-gray-500 py-10 text-center flex flex-col items-center">
                                            <div className="w-12 h-12 border-2 border-dashed border-gray-700 rounded-full mb-3 flex items-center justify-center text-gray-700">
                                                <MoveRight size={20} />
                                            </div>
                                            <p className="text-sm">Toca los pasos disponibles<br />para añadirlos aquí</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TEORÍA */}
                    {lesson.type === 'theory' && (
                        <div className="flex flex-col gap-6">
                            {lesson.theoryBlocks ? (
                                lesson.theoryBlocks.map((block, idx) => {
                                    switch (block.type) {
                                        case 'text':
                                            return <p key={idx} className="text-xl text-gray-200 leading-relaxed font-medium">{block.content as string}</p>;
                                        case 'header':
                                            return <h3 key={idx} className="text-2xl font-bold text-cyan-400 mt-4">{block.content as string}</h3>;
                                        case 'list':
                                            return (
                                                <div key={idx} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                                                    <ul className="space-y-4">
                                                        {(block.content as string[]).map((item, itemIdx) => (
                                                            <li key={itemIdx} className="flex items-center gap-4 text-lg text-gray-300">
                                                                <span className="bg-cyan-900 text-cyan-400 w-8 h-8 flex items-center justify-center rounded-full font-bold flex-shrink-0">{itemIdx + 1}</span>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        case 'checklist':
                                            return (
                                                <div key={idx} className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50">
                                                    <ul className="space-y-4">
                                                        {(block.content as string[]).map((item, itemIdx) => (
                                                            <li key={itemIdx} className="flex items-center gap-4 text-lg text-gray-200">
                                                                <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                                                                <span className="font-medium">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        case 'true_false':
                                            const userAnswer = inlineAnswers[idx];
                                            const isCorrect = userAnswer === block.answer;
                                            const hasAnswered = userAnswer !== undefined && userAnswer !== null;

                                            return (
                                                <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 my-4 shadow-lg">
                                                    <p className="text-lg font-bold text-white mb-6">{block.content as string}</p>

                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => setInlineAnswers({ ...inlineAnswers, [idx]: true })}
                                                            disabled={hasAnswered}
                                                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${hasAnswered && block.answer === true ? 'bg-green-500/20 text-green-400 border-2 border-green-500' :
                                                                hasAnswered && userAnswer === true && !isCorrect ? 'bg-red-500/20 text-red-400 border-2 border-red-500' :
                                                                    'bg-gray-700 hover:bg-gray-600 text-gray-300 border-2 border-transparent'
                                                                }`}
                                                        >
                                                            Verdadero
                                                        </button>
                                                        <button
                                                            onClick={() => setInlineAnswers({ ...inlineAnswers, [idx]: false })}
                                                            disabled={hasAnswered}
                                                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${hasAnswered && block.answer === false ? 'bg-green-500/20 text-green-400 border-2 border-green-500' :
                                                                hasAnswered && userAnswer === false && !isCorrect ? 'bg-red-500/20 text-red-400 border-2 border-red-500' :
                                                                    'bg-gray-700 hover:bg-gray-600 text-gray-300 border-2 border-transparent'
                                                                }`}
                                                        >
                                                            Falso
                                                        </button>
                                                    </div>

                                                    {hasAnswered && (
                                                        <div className={`mt-4 p-3 rounded-lg text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${isCorrect ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}`}>
                                                            {isCorrect ? <CheckCircle size={16} /> : <X size={16} />}
                                                            {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        case 'alert':
                                            return (
                                                <div key={idx} className={`p-6 rounded-2xl border-l-8 flex gap-4 ${block.style === 'warning' ? 'bg-amber-900/20 border-amber-500 text-amber-100' : 'bg-blue-900/20 border-blue-500 text-blue-100'
                                                    }`}>
                                                    <AlertCircle size={32} className="flex-shrink-0" />
                                                    <p className="font-bold text-lg">{block.content as string}</p>
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })
                            ) : (
                                <div className="p-8 bg-gray-800 rounded-xl">
                                    <h3 className="text-xl font-bold mb-4">Teoría</h3>
                                    <p className="text-gray-300 leading-relaxed">{lesson.theoryContent}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Pie de acción fijo (Sticky) */}
            <div className={`fixed bottom-0 left-0 md:left-64 right-0 p-6 border-t backdrop-blur-md transition-colors duration-300 z-40 ${showFeedback === 'success' ? 'bg-green-900/90 border-green-500/50' :
                showFeedback === 'trap' ? 'bg-amber-900/90 border-amber-500/50' :
                    showFeedback === 'error' ? 'bg-red-900/90 border-red-500/50' :
                        'bg-[#1e1e1e]/90 border-gray-800'
                }`}>
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    {showFeedback === 'success' && (
                        <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-green-500/20 p-2 rounded-full">
                                <CheckCircle size={32} className="text-green-400" />
                            </div>
                            <div>
                                <p className="font-bold text-green-100 text-lg">¡Correcto!</p>
                                <p className="text-sm font-normal text-green-300/80">
                                    {lesson.type === 'simulation' ? lesson.simulationConfig?.successMessage :
                                        lesson.type === 'quiz' ? lesson.quizConfig?.successMessage :
                                            lesson.type === 'drag_drop' ? lesson.dragDropConfig?.successMessage :
                                                "Lección completada. ¡Continúa aprendiendo!"}
                                </p>
                            </div>
                        </div>
                    )}
                    {showFeedback === 'trap' && (
                        <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-amber-500/20 p-2 rounded-full">
                                <Bot size={32} className="text-amber-400" />
                            </div>
                            <div>
                                <p className="font-bold text-amber-100 text-lg">¡Espera!</p>
                                <p className="text-sm font-normal text-amber-200">{lesson.dragDropConfig?.trapMessage}</p>
                            </div>
                        </div>
                    )}
                    {showFeedback === 'error' && (
                        <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-red-500/20 p-2 rounded-full">
                                <RotateCcw size={32} className="text-red-400" />
                            </div>
                            <div>
                                <p className="font-bold text-red-100 text-lg">Inténtalo de nuevo</p>
                                <p className="text-sm font-normal text-red-300/80">
                                    {lesson.type === 'simulation' ? lesson.simulationConfig?.errorMessage :
                                        lesson.type === 'quiz' ? lesson.quizConfig?.errorMessage :
                                            lesson.type === 'drag_drop' ? lesson.dragDropConfig?.errorMessage :
                                                "Responde correctamente todas las preguntas para continuar."}
                                </p>
                            </div>
                        </div>
                    )}
                    {!showFeedback && <div className="text-gray-500 italic hidden sm:block">Completa el ejercicio para continuar...</div>}

                    {/* Dev Mode Navigation */}
                    {isDevMode && (
                        <div className="flex gap-2 mr-2">
                            <button
                                onClick={() => currentIndex > 0 && navigate(`/lessons/${chain[currentIndex - 1]}`)}
                                disabled={currentIndex === 0}
                                className="p-4 rounded-xl bg-gray-800 text-purple-400 border border-purple-500/50 hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Previous Question (Dev Mode)"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => currentIndex < chain.length - 1 ? navigate(`/lessons/${chain[currentIndex + 1]}`) : setShowSummary(true)}
                                className="p-4 rounded-xl bg-gray-800 text-purple-400 border border-purple-500/50 hover:bg-purple-900/20"
                                title="Next Question (Dev Mode)"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={showFeedback ? handleContinue : handleCheck}
                        disabled={(lesson.type !== 'theory' && selectedAnswer === null && userSequence.length === 0)}
                        className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg flex-1 md:flex-none ${showFeedback === 'success' ? 'bg-green-500 hover:bg-green-400 text-white shadow-green-900/20' :
                            showFeedback === 'trap' ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-900/20' :
                                showFeedback === 'error' ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-900/20' :
                                    (lesson.type !== 'theory' && selectedAnswer === null && userSequence.length === 0) ? 'bg-gray-800 text-gray-600 cursor-not-allowed shadow-none' :
                                        'bg-gradient-to-b from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-cyan-950 shadow-cyan-900/30'
                            }`}
                    >
                        {showFeedback ? 'CONTINUAR' : (lesson.type === 'theory' ? 'CONTINUAR' : 'COMPROBAR')}
                    </button>
                </div>
            </div>
        </div>
    );
}
