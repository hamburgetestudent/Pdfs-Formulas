import { useState, useEffect } from 'react';
import { Rocket, CheckCircle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Lesson() {
    const navigate = useNavigate();
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState<'success' | 'error' | null>(null);
    const [rocketPos, setRocketPos] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Rocket animation simulation
    useEffect(() => {
        if (isAnimating) {
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
    }, [isAnimating]);

    const handleCheck = () => {
        if (selectedAnswer === 1) { // 1 is the simulated correct answer
            setShowFeedback('success');
            setIsAnimating(true);
        } else {
            setShowFeedback('error');
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full h-[calc(100vh-100px)] flex flex-col">
            {/* Header Lesson */}
            <div className="w-full h-4 bg-gray-800 rounded-full mb-8 mt-4 overflow-hidden">
                <div className="h-full bg-green-400 w-1/3 transition-all duration-500"></div>
            </div>

            <div className="flex-1 flex flex-col gap-6">
                {/* Simulation Area */}
                <div className="bg-gray-800 rounded-xl p-8 h-48 flex items-end justify-center relative overflow-hidden border border-gray-700">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Rocket */}
                    <div
                        className="transition-all duration-1000 ease-out absolute"
                        style={{ bottom: `${rocketPos}%`, transform: 'translateY(50%)' }}
                    >
                        <Rocket size={48} className="text-orange-500 transform -rotate-45" />
                        {isAnimating && <div className="absolute top-10 left-3 w-6 h-12 bg-orange-400 blur-md rounded-full animate-pulse"></div>}
                    </div>

                    {/* Ground */}
                    <div className="absolute bottom-0 w-full h-2 bg-purple-500"></div>
                </div>

                {/* Simplified Code Editor */}
                <div className="bg-gray-950 rounded-xl p-6 font-mono text-sm md:text-base border-l-4 border-cyan-400 shadow-2xl">
                    <div className="text-gray-500 mb-2">// Archivo: physics_engine.js</div>
                    <div className="text-purple-400">const <span className="text-yellow-300">rocket</span> = <span className="text-blue-300">new</span> Rocket();</div>
                    <div className="text-gray-400 mt-1">
                        <span className="text-purple-400">let</span> velocityY = <span className="inline-block w-24 h-6 border-b-2 border-dashed border-gray-600 align-middle text-center text-white">
                            {selectedAnswer !== null ? (selectedAnswer === 1 ? '50' : selectedAnswer === 0 ? '"rápido"' : 'null') : '?'}
                        </span>;
                    </div>
                    <div className="text-purple-400 mt-1">rocket.launch(velocityY);</div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto mb-8">
                    {[
                        { code: '"rápido"', label: "String (Texto)" },
                        { code: '50', label: "Number (Entero)" },
                        { code: 'null', label: "Null (Vacío)" }
                    ].map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setSelectedAnswer(idx); setShowFeedback(null); setRocketPos(0); setIsAnimating(false); }}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${selectedAnswer === idx
                                    ? 'border-cyan-400 bg-cyan-900/20 text-cyan-300'
                                    : 'border-gray-700 hover:bg-gray-800 text-gray-300'
                                }`}
                        >
                            <code className="bg-gray-900 px-2 py-1 rounded text-sm block mb-1">{opt.code}</code>
                            <span className="text-xs text-gray-500">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Footer */}
            <div className={`fixed bottom-0 left-0 md:left-64 right-0 p-6 border-t ${showFeedback === 'success' ? 'bg-green-900/90 border-green-600' :
                    showFeedback === 'error' ? 'bg-red-900/90 border-red-600' :
                        'bg-gray-900 border-gray-800'
                }`}>
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    {showFeedback === 'success' && (
                        <div className="flex items-center gap-3 text-green-400 font-bold text-xl">
                            <CheckCircle size={32} />
                            <div>
                                <p>¡Correcto!</p>
                                <p className="text-sm font-normal text-green-200">La velocidad es una magnitud escalar numérica.</p>
                            </div>
                        </div>
                    )}
                    {showFeedback === 'error' && (
                        <div className="flex items-center gap-3 text-red-400 font-bold text-xl">
                            <RotateCcw size={32} />
                            <div>
                                <p>Inténtalo de nuevo</p>
                                <p className="text-sm font-normal text-red-200">Una cadena de texto no sirve para matemáticas.</p>
                            </div>
                        </div>
                    )}
                    {!showFeedback && <div />}

                    <button
                        onClick={showFeedback ? () => { if (showFeedback === 'success') navigate('/'); setShowFeedback(null); setSelectedAnswer(null); setRocketPos(0); setIsAnimating(false); } : handleCheck}
                        disabled={selectedAnswer === null}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${showFeedback === 'success' ? 'bg-green-500 hover:bg-green-400 text-white' :
                                showFeedback === 'error' ? 'bg-red-500 hover:bg-red-400 text-white' :
                                    selectedAnswer === null ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                                        'bg-cyan-500 hover:bg-cyan-400 text-gray-900 shadow-[0_4px_0_rgb(8,145,178)] active:shadow-none active:translate-y-1'
                            }`}
                    >
                        {showFeedback ? 'CONTINUAR' : 'COMPROBAR'}
                    </button>
                </div>
            </div>
        </div>
    );
}
