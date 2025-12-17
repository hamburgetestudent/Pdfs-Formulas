import { useEffect, useState, useRef } from 'react';
import { ACHIEVEMENTS_DATA } from '../lib/achievements';
import { Trophy, Star, PenLine, Check, X as XIcon, Upload, Lock } from 'lucide-react';

// Avatares predefinidos disponibles
const PRESET_AVATARS = [
    { id: 'avatar_1', src: '/avatars/avatar_1.jpg' },
    { id: 'avatar_2', src: '/avatars/avatar_2.jpg' },
    { id: 'avatar_3', src: '/avatars/avatar_3.jpg' },
    { id: 'avatar_4', src: '/avatars/avatar_4.jpg' },
];

/**
 * Componente de página de Perfil de Usuario.
 * Muestra la información del usuario (nombre, avatar, nivel, XP) y los logros desbloqueados.
 * Permite editar el nombre y cambiar el avatar (predefinido o subido).
 *
 * @returns {JSX.Element} La página de perfil.
 */
export default function Profile() {
    const [unlocked, setUnlocked] = useState<string[]>([]);
    const [stats, setStats] = useState({ totalXP: 0, level: 1, completedLessons: 0 });

    // Estado del Perfil
    const [profile, setProfile] = useState({ name: 'Estudiante de Física', avatar: 'avatar_1' });
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cargar datos al montar el componente
    useEffect(() => {
        const safeParse = (key: string, fallback: any) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : fallback;
            } catch (e) {
                console.error(`Error parsing ${key}`, e);
                return fallback;
            }
        };

        // Cargar logros desbloqueados
        const storedAchievements = safeParse('achievements', []);
        setUnlocked(storedAchievements);

        // Cargar Perfil
        const storedProfile = safeParse('userProfile', { name: "Estudiante de Física", avatar: "avatar_1" });
        setProfile(storedProfile);

        // Cargar estadísticas agregando datos de lecciones
        let totalTime = 0;
        let completed = 0;

        // Iterar localStorage para encontrar claves stats_
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('stats_')) {
                const data = safeParse(key, {});
                totalTime += data.totalTime || 0;
                completed += data.completed || 0;
            }
        }

        // Cálculo simple de XP: 100 XP por lección completada + Recompensas de Logros
        let xp = completed * 10; // 10 XP por paso

        storedAchievements.forEach((id: string) => {
            const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
            if (ach?.xpReward) {
                xp += ach.xpReward;
            }
        });

        setStats({
            totalXP: xp,
            level: Math.floor(xp / 500) + 1,
            completedLessons: completed
        });

    }, []);

    /**
     * Guarda el perfil actualizado en localStorage.
     */
    const saveProfile = (newProfile: typeof profile) => {
        setProfile(newProfile);
        localStorage.setItem('userProfile', JSON.stringify(newProfile));
    };

    /**
     * Maneja la subida de una imagen de avatar personalizada.
     */
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                saveProfile({ ...profile, avatar: base64 });
                setShowAvatarMenu(false);
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * Obtiene la fuente de la imagen del avatar según si es predefinido, subido o generado.
     */
    const getAvatarSrc = (avatarId: string) => {
        if (avatarId.startsWith('data:')) return avatarId; // Base64
        if (avatarId.startsWith('avatar_')) return `/avatars/${avatarId}.jpg`; // Local Preset
        // Fallback para semillas antiguas de DiceBear si las hay
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}`;
    };

    const nextLevelXP = stats.level * 500;
    const progressXP = (stats.totalXP % 500) / 5; // Porcentaje (500 es 100%)

    return (
        <div className="max-w-4xl w-full text-white pb-20">
            {/* Cabecera del Perfil */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 mb-8 border border-gray-700 shadow-xl flex flex-col md:flex-row items-center gap-8 relative">
                {/* Decoración de Fondo */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Sección de Avatar */}
                <div className="relative group cursor-pointer" onClick={() => setShowAvatarMenu(!showAvatarMenu)}>
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg relative z-10 transition-transform group-hover:scale-105">
                        <img
                            src={getAvatarSrc(profile.avatar)}
                            alt="Avatar"
                            className="w-full h-full rounded-full bg-gray-800 object-cover"
                        />
                        <div className="absolute bottom-0 right-0 bg-gray-900 border-2 border-cyan-400 rounded-full p-2 group-hover:bg-cyan-500 transition-colors">
                            <PenLine size={16} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Menú de Selección de Avatar (Modal/Popover) */}
                {showAvatarMenu && (
                    <div className="absolute top-full left-0 z-50 mt-2 p-4 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 w-full max-w-sm">
                        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Selecciona tu avatar</h3>

                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {PRESET_AVATARS.map(preset => (
                                <button
                                    key={preset.id}
                                    onClick={() => {
                                        saveProfile({ ...profile, avatar: preset.id });
                                        setShowAvatarMenu(false);
                                    }}
                                    className={`rounded-full p-1 border-2 transition-all hover:scale-110 aspect-square overflow-hidden ${profile.avatar === preset.id ? 'border-cyan-400 ring-2 ring-cyan-400/20' : 'border-transparent hover:border-gray-500'}`}
                                >
                                    <img
                                        src={preset.src}
                                        alt={preset.id}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-gray-700 pt-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm font-bold transition-colors"
                            >
                                <Upload size={16} />
                                Subir Propia
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </div>
                )}

                <div className="flex-1 text-center md:text-left z-10 w-full">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="bg-gray-800 border border-cyan-500 text-white px-3 py-1 rounded-lg text-2xl font-bold focus:outline-none"
                                    autoFocus
                                />
                                <button onClick={() => { saveProfile({ ...profile, name: tempName }); setIsEditingName(false); }} className="p-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"><Check size={20} /></button>
                                <button onClick={() => setIsEditingName(false)} className="p-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><XIcon size={20} /></button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold">{profile.name}</h1>
                                <button
                                    onClick={() => { setTempName(profile.name); setIsEditingName(true); }}
                                    className="text-gray-500 hover:text-cyan-400 transition-colors"
                                >
                                    <PenLine size={20} />
                                </button>
                            </>
                        )}
                    </div>
                    <p className="text-gray-400 mb-6">Explorador del conocimiento</p>

                    <div className="flex items-center gap-4 mb-2">
                        <span className="font-bold text-xl text-yellow-400">Nivel {stats.level}</span>
                        <span className="text-sm text-gray-500">{stats.totalXP} / {nextLevelXP} XP</span>
                    </div>

                    <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden border border-gray-600">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000"
                            style={{ width: `${progressXP}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Sección de Logros */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Trophy className="text-yellow-400" />
                    Logros <span className="text-sm text-gray-500 font-normal">({unlocked.length} / {ACHIEVEMENTS_DATA.length})</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ACHIEVEMENTS_DATA.map((ach) => {
                        const isUnlocked = unlocked.includes(ach.id);
                        const Icon = ach.icon;

                        return (
                            <div
                                key={ach.id}
                                className={`p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${isUnlocked
                                    ? 'bg-gray-800 border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/80 shadow-lg'
                                    : 'bg-gray-900/50 border-gray-800 opacity-60 grayscale'
                                    }`}
                            >
                                {isUnlocked && <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}

                                <div className="flex items-start gap-4 reltive z-10">
                                    <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-gray-700/50' : 'bg-gray-800'}`}>
                                        {isUnlocked ? (
                                            <Icon size={32} className={ach.color} />
                                        ) : (
                                            <Lock size={32} className="text-gray-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{ach.title}</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">{ach.description}</p>
                                        {isUnlocked && (
                                            <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                                                <Star size={12} fill="currentColor" />
                                                +{ach.xpReward} XP
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
