import { useMemo } from 'react';
import { BookOpen, Star, Lock, CheckCircle, Play } from 'lucide-react';
import { quizData } from '../lib/quizData';
import { useNavigate } from 'react-router-dom';

interface LessonNode {
    id: string;
    title: string;
    type: 'formulas' | 'quiz';
    locked: boolean;
    completed: boolean;
    path: string;
}

interface UnitSection {
    title: string;
    description: string;
    nodes: LessonNode[];
}

export default function Dashboard() {
    const navigate = useNavigate();

    const units = useMemo(() => {
        const processedUnits: UnitSection[] = [];

        Object.entries(quizData).forEach(([subject, categories]) => {
            Object.entries(categories).forEach(([categoryName, topics]) => {
                const nodes: LessonNode[] = [];

                Object.keys(topics).forEach((topicName) => {
                    // Node for Formulas (Study)
                    nodes.push({
                        id: `${categoryName}-${topicName}-study`,
                        title: `Estudiar: ${topicName}`,
                        type: 'formulas',
                        locked: false,
                        completed: false, // TODO: Hook up to user profile
                        path: `/lesson/${encodeURIComponent(categoryName)}/${encodeURIComponent(topicName)}/study`
                    });

                    // Node for Quiz (Practice)
                    nodes.push({
                        id: `${categoryName}-${topicName}-quiz`,
                        title: `Práctica: ${topicName}`,
                        type: 'quiz',
                        locked: false,
                        completed: false,
                        path: `/lesson/${encodeURIComponent(categoryName)}/${encodeURIComponent(topicName)}/quiz`
                    });
                });

                processedUnits.push({
                    title: categoryName,
                    description: `Temas de ${subject}`,
                    nodes,
                });
            });
        });

        return processedUnits;
    }, []);

    return (
        <div className="min-h-screen bg-[#111] p-8 pb-32">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2 text-center">
                    Ruta de Aprendizaje
                </h1>
                <p className="text-gray-400 text-center mb-12">Completa las lecciones para desbloquear nuevos temas</p>

                <div className="space-y-16">
                    {units.map((unit, unitIdx) => (
                        <div key={unitIdx} className="relative">
                            {/* Unit Card */}
                            <div className="bg-[#1F2937]/50 backdrop-blur border border-[#374151] rounded-2xl p-6 mb-8 text-center sticky top-4 z-20 shadow-xl">
                                <h2 className="text-2xl font-bold text-white">{unit.title}</h2>
                                <p className="text-sm text-gray-400">{unit.description}</p>
                            </div>

                            <div className="relative pl-8 md:pl-0">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 transform -translate-x-1/2 hidden md:block" />
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 md:hidden ml-4" />

                                <div className="space-y-12">
                                    {unit.nodes.map((node, nodeIdx) => {
                                        const isLeft = nodeIdx % 2 === 0;

                                        return (
                                            <div key={node.id} className={`relative flex items-center md:justify-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>

                                                {/* Connecting Line to Center (Desktop) */}
                                                <div className="hidden md:block absolute left-1/2 top-1/2 w-1/2 h-[2px] bg-blue-500/30 transform -translate-y-1/2 z-0"
                                                    style={{ [isLeft ? 'left' : 'right']: '50%', width: '40px' }} />

                                                {/* Content Card */}
                                                <div className="group relative z-10 w-full md:w-[45%] ml-12 md:ml-0 cursor-pointer"
                                                    onClick={() => !node.locked && navigate(node.path)}
                                                >
                                                    <div className={`
                            bg-[#1e1e1e] border border-[#333] p-5 rounded-xl transition-all duration-300
                            hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]
                            ${node.locked ? 'opacity-50 grayscale' : ''}
                          `}>
                                                        <div className="flex items-center gap-4">
                                                            <div className={`
                                w-12 h-12 rounded-lg flex items-center justify-center shrink-0
                                ${node.type === 'formulas' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}
                              `}>
                                                                {node.type === 'formulas' ? <BookOpen size={24} /> : <Star size={24} />}
                                                            </div>

                                                            <div className="flex-1">
                                                                <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-300 transition-colors">
                                                                    {node.title}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${node.type === 'formulas' ? 'bg-blue-900/50 text-blue-200' : 'bg-amber-900/50 text-amber-200'}`}>
                                                                        {node.type === 'formulas' ? 'Teoría' : 'Práctica'}
                                                                    </span>
                                                                    {node.completed && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Completado</span>}
                                                                </div>
                                                            </div>

                                                            <div className="text-gray-500">
                                                                {node.locked ? <Lock size={20} /> : <Play size={20} className="group-hover:text-white transition-colors" />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Center Marker */}
                                                <div className="absolute left-4 md:left-1/2 top-1/2 w-4 h-4 rounded-full border-4 border-[#111] bg-blue-500 transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
