import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, RefreshCw, BookOpen } from 'lucide-react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { quizData } from '../lib/quizData';
import type { Topic, Question } from '../types';

/**
 * Componente que gestiona la página de la lección (modo estudio o quiz).
 *
 * @returns {JSX.Element} La página de la lección.
 */
export default function LessonPage() {
    const { category, topic, mode } = useParams<{ category: string; topic: string; mode: string }>();
    const navigate = useNavigate();

    // Estado para el modo Quiz
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    // Recuperar datos del tema
    const topicData: Topic | undefined = useMemo(() => {
        if (!category || !topic) return undefined;
        // Buscar a través de todas las materias para encontrar la categoría
        for (const subjectName in quizData) {
            const subject = quizData[subjectName];
            if (subject[category] && subject[category][topic]) {
                return subject[category][topic];
            }
        }
        return undefined;
    }, [category, topic]);

    if (!topicData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white">
                <h1 className="text-2xl mb-4">Tema no encontrado</h1>
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 rounded">
                    Volver al Inicio
                </button>
            </div>
        );
    }

    /**
     * Maneja la selección de una opción en el quiz.
     * @param option La opción seleccionada.
     */
    const handleOptionSelect = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    /**
     * Comprueba si la respuesta seleccionada es correcta.
     */
    const handleCheckAnswer = () => {
        if (!selectedOption || isAnswered) return;
        setIsAnswered(true);
        if (selectedOption === topicData.questions[currentQuestionIndex].correct_option) {
            setScore(prev => prev + 1);
        }
    };

    /**
     * Avanza a la siguiente pregunta o muestra los resultados si es la última.
     */
    const handleNextQuestion = () => {
        if (currentQuestionIndex < topicData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    /**
     * Reinicia el quiz para intentarlo de nuevo.
     */
    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    // Renderizar Vista de Fórmulas (Modo Estudio)
    if (mode === 'study') {
        return (
            <div className="min-h-screen bg-[#111] text-gray-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Volver al Mapa
                    </button>

                    <header className="mb-8 border-b border-gray-800 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <BookOpen size={24} />
                             </div>
                             <h1 className="text-3xl font-bold text-white">{topic}</h1>
                        </div>
                        <p className="text-gray-400">Revisa las fórmulas clave antes de tomar la prueba.</p>
                    </header>

                    <div className="grid gap-6 md:grid-cols-2">
                        {topicData.formulas.map((item, idx) => (
                            <div key={idx} className="bg-[#1F2937] border border-[#374151] rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                                <h3 className="text-lg font-semibold text-blue-300 mb-4 border-b border-gray-700 pb-2">
                                    {item.concepto}
                                </h3>
                                <div className="text-xl flex justify-center py-4 overflow-x-auto">
                                    <BlockMath math={item.formula} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-end">
                        <button
                            onClick={() => navigate(`/lesson/${encodeURIComponent(category!)}/${encodeURIComponent(topic!)}/quiz`)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg font-bold text-white hover:opacity-90 transition-opacity flex items-center"
                        >
                            Ir a la Práctica <ChevronRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar Vista de Quiz
    const currentQuestion: Question = topicData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / topicData.questions.length) * 100;

    if (showResults) {
        return (
            <div className="min-h-screen bg-[#111] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-[#1F2937] border border-[#374151] rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">¡Lección Completada!</h2>
                    <p className="text-gray-400 mb-8">Has terminado la práctica de <span className="text-blue-400">{topic}</span></p>

                    <div className="bg-[#111] rounded-xl p-6 mb-8 border border-gray-800">
                        <div className="text-sm text-gray-400 mb-1">Puntuación Final</div>
                        <div className="text-4xl font-extrabold text-white">
                            {score} <span className="text-xl text-gray-500">/ {topicData.questions.length}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition-colors"
                        >
                            Volver al Mapa
                        </button>
                        <button
                            onClick={handleRetry}
                            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-gray-300 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} /> Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111] text-gray-100 p-6 flex flex-col">
            {/* Cabecera / Progreso */}
            <div className="max-w-2xl mx-auto w-full mb-8">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white transition-colors">
                        <XCircle size={24} />
                    </button>
                    <div className="text-sm font-medium text-gray-400">
                        Pregunta {currentQuestionIndex + 1} de {topicData.questions.length}
                    </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Tarjeta de Pregunta */}
            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
                <div className="mb-8">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4
                        ${currentQuestion.difficulty === 'Fácil' ? 'bg-green-900/50 text-green-400' :
                          currentQuestion.difficulty === 'Medio' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-red-900/50 text-red-400'}`}>
                        {currentQuestion.difficulty}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Opciones */}
                <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, idx) => {
                        let stateStyles = "border-[#374151] hover:border-blue-500/50 hover:bg-blue-500/10";

                        if (isAnswered) {
                            if (option === currentQuestion.correct_option) {
                                stateStyles = "border-green-500 bg-green-500/20 text-green-100";
                            } else if (option === selectedOption) {
                                stateStyles = "border-red-500 bg-red-500/20 text-red-100";
                            } else {
                                stateStyles = "border-[#374151] opacity-50";
                            }
                        } else if (selectedOption === option) {
                            stateStyles = "border-blue-500 bg-blue-500/20 text-white";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                disabled={isAnswered}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ${stateStyles}`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Acciones de pie de página */}
            <div className="max-w-2xl mx-auto w-full pt-6 border-t border-gray-800">
                {!isAnswered ? (
                    <button
                        onClick={handleCheckAnswer}
                        disabled={!selectedOption}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all
                            ${selectedOption
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        Comprobar Respuesta
                    </button>
                ) : (
                    <div className={`p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300
                        ${selectedOption === currentQuestion.correct_option ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>

                        <div className="flex items-center gap-3">
                            {selectedOption === currentQuestion.correct_option ? (
                                <>
                                    <CheckCircle className="text-green-400" size={24} />
                                    <div>
                                        <p className="font-bold text-green-400">¡Correcto!</p>
                                        <p className="text-sm text-green-200/70">Buen trabajo</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="text-red-400" size={24} />
                                    <div>
                                        <p className="font-bold text-red-400">Incorrecto</p>
                                        <p className="text-sm text-red-200/70">La respuesta correcta era: {currentQuestion.correct_option}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleNextQuestion}
                            className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Continuar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
