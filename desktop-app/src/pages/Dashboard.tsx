import { useMemo } from 'react';
import { BookOpen, Lock, CheckCircle, Play } from 'lucide-react';
import { QUIZ_DATA } from '../lib/quiz-data';
import { useNavigate } from 'react-router-dom';

type LessonType = {
    id: string;
    title: string;
    topic: string;
    locked: boolean;
    completed: boolean;
    position: 'left' | 'center' | 'right';
};

interface UnitSection {
    title: string;
    description: string;
    color: string;
    lessons: LessonType[];
}

export default function Dashboard() {
    const navigate = useNavigate();

    const units = useMemo(() => {
        const processedUnits: UnitSection[] = [];
        let globalLessonIndex = 0;

        Object.entries(QUIZ_DATA).forEach(([subject, categories]) => {
            Object.entries(categories).forEach(([categoryName, topics]) => {
                const lessons: LessonType[] = [];

                Object.keys(topics).forEach((topicName) => {
                    const positions: ('left' | 'center' | 'right')[] = ['center', 'left', 'center', 'right'];

                    // Add study lesson
                    lessons.push({
                        id: `${categoryName}-${topicName}-study`,
                        title: `Estudiar: ${topicName}`,
                        topic: topicName,
                        locked: false, // Default unlocked for now
                        completed: true, // Mock completed
                        position: positions[globalLessonIndex % 4],
                    });
                    globalLessonIndex++;

                    // Add quiz lesson
                    lessons.push({
                        id: `${categoryName}-${topicName}-quiz`,
                        title: `Práctica: ${topicName}`,
                        topic: topicName,
                        locked: false, // Default unlocked for now
                        completed: false,
                        position: positions[globalLessonIndex % 4],
                    });
                    globalLessonIndex++;
                });

                processedUnits.push({
                    title: categoryName,
                    description: `Temas de ${subject}`,
                    color: "from-blue-500 to-cyan-400", // Default color
                    lessons,
                });
            });
        });

        return processedUnits;
    }, []);

    return (
        <div className="flex flex-col items-center pb-20 pt-8 w-full">
            {units.map((unit, unitIdx) => (
                <div key={unitIdx} className="w-full max-w-lg mb-12">
                    <div className={`bg-gradient-to-r ${unit.color} p-6 rounded-2xl mb-8 shadow-lg shadow-purple-900/20 text-white flex justify-between items-center`}>
                        <div>
                            <h2 className="text-xl font-bold">{unit.title}</h2>
                            <p className="text-blue-100 text-sm opacity-90">{unit.description}</p>
                        </div>
                        <BookOpen size={24} className="opacity-80" />
                    </div>

                    <div className="flex flex-col items-center space-y-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-0 bottom-0 w-2 bg-gray-800 rounded-full -z-10" />

                        {unit.lessons.map((lesson) => {
                            const isActive = !lesson.locked && !lesson.completed;
                            const isCompleted = lesson.completed;

                            // Visual offset
                            const offsetClass =
                                lesson.position === 'left' ? '-translate-x-12' :
                                    lesson.position === 'right' ? 'translate-x-12' : '';

                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => !lesson.locked && navigate('/lessons')}
                                    disabled={lesson.locked}
                                    className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-b-4 transition-all transform active:scale-95 ${offsetClass}
                    ${isCompleted
                                            ? 'bg-yellow-400 border-yellow-600 text-yellow-900'
                                            : isActive
                                                ? 'bg-cyan-400 border-cyan-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-pulse'
                                                : 'bg-gray-700 border-gray-600 text-gray-500'
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle size={32} /> :
                                        lesson.locked ? <Lock size={28} /> :
                                            <Play size={32} fill="currentColor" />}

                                    {isActive && (
                                        <div className="absolute -top-10 bg-white text-gray-900 text-xs font-bold py-1 px-3 rounded-lg animate-bounce z-10 w-max">
                                            EMPEZAR
                                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
