/**
 * Interfaz que define las estadísticas del usuario.
 */
export interface UserStats {
    /** Número total de respuestas correctas. */
    total_correct: number;
    /** Número total de intentos realizados. */
    total_attempts: number;
    /** Racha actual de respuestas correctas consecutivas. */
    current_streak: number;
    /** Mejor racha histórica de respuestas correctas. */
    best_streak: number;
}

/**
 * Interfaz que define un logro desbloqueado.
 */
export interface Achievement {
    /** Identificador único del logro. */
    id: string;
    /** Nombre del logro. */
    name: string;
    /** Descripción del logro. */
    description: string;
    /** Fecha de desbloqueo (opcional). */
    unlockedAt?: string;
}

const STORAGE_KEY = 'physicode_user_profile';

/**
 * Clase que gestiona el perfil del usuario, incluyendo experiencia, nivel, estadísticas y logros.
 * Utiliza localStorage para persistencia de datos.
 */
export class UserProfile {
    /** Puntos de experiencia acumulados. */
    xp: number = 0;
    /** Gemas o moneda virtual acumulada. */
    gems: number = 0;
    /** Nivel actual del usuario. */
    level: number = 1;
    /** Estadísticas de rendimiento del usuario. */
    stats: UserStats = {
        total_correct: 0,
        total_attempts: 0,
        current_streak: 0,
        best_streak: 0,
    };
    /** Lista de IDs de logros desbloqueados. */
    achievements: string[] = [];

    /**
     * Inicializa el perfil de usuario cargando los datos guardados.
     */
    constructor() {
        this.load();
    }

    /**
     * Carga los datos del perfil desde localStorage.
     * @private
     */
    private load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                this.xp = parsed.xp || 0;
                this.gems = parsed.gems || 0;
                this.level = parsed.level || 1;
                this.stats = { ...this.stats, ...parsed.stats };
                this.achievements = parsed.achievements || [];
            }
        } catch (e) {
            console.error("Failed to load user profile", e);
        }
    }

    /**
     * Guarda el estado actual del perfil en localStorage y emite un evento de actualización.
     */
    save() {
        try {
            const data = {
                xp: this.xp,
                gems: this.gems,
                level: this.level,
                stats: this.stats,
                achievements: this.achievements,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            // Dispatch event for UI updates
            window.dispatchEvent(new Event('profile-updated'));
        } catch (e) {
            console.error("Failed to save user profile", e);
        }
    }

    /**
     * Añade experiencia al usuario y calcula si ha subido de nivel.
     * @param amount Cantidad de experiencia a añadir.
     * @returns {boolean} True si el usuario subió de nivel, False en caso contrario.
     */
    addXp(amount: number): boolean {
        const oldLevel = this.level;
        this.xp += amount;
        this.calculateLevel();
        this.save();
        return this.level > oldLevel;
    }

    /**
     * Añade gemas al usuario.
     * @param amount Cantidad de gemas a añadir.
     */
    addGems(amount: number) {
        this.gems += amount;
        this.save();
    }

    /**
     * Calcula el nivel actual basado en la experiencia total.
     * Progresión lineal: 100 XP por nivel.
     */
    calculateLevel() {
        // Linear progression: 100 XP per level
        this.level = 1 + Math.floor(this.xp / 100);
    }

    /**
     * Registra un intento de respuesta (correcta o incorrecta) y actualiza estadísticas.
     * @param correct Indica si la respuesta fue correcta.
     * @returns {{ leveledUp: boolean; newAchievements: Achievement[] }} Objeto indicando si hubo subida de nivel y nuevos logros.
     */
    recordAttempt(correct: boolean): { leveledUp: boolean; newAchievements: Achievement[] } {
        this.stats.total_attempts += 1;
        let leveledUp = false;

        if (correct) {
            this.stats.total_correct += 1;
            this.stats.current_streak += 1;
            if (this.stats.current_streak > this.stats.best_streak) {
                this.stats.best_streak = this.stats.current_streak;
            }
            // Award XP for correct answer
            leveledUp = this.addXp(10);
        } else {
            this.stats.current_streak = 0;
        }

        const newAchievements = this.checkAchievements();
        this.save();

        return { leveledUp, newAchievements };
    }

    /**
     * Verifica si se han cumplido las condiciones para desbloquear nuevos logros.
     * @returns {Achievement[]} Lista de logros recién desbloqueados.
     */
    checkAchievements(): Achievement[] {
        const unlocked: Achievement[] = [];

        const definitions = [
            { id: "first_step", name: "Primer Paso", description: "Responde correctamente tu primera pregunta", condition: (s: UserStats) => s.total_correct >= 1 },
            { id: "scholar", name: "Estudioso", description: "Responde 10 preguntas correctamente", condition: (s: UserStats) => s.total_correct >= 10 },
            { id: "master", name: "Maestro", description: "Responde 50 preguntas correctamente", condition: (s: UserStats) => s.total_correct >= 50 },
            { id: "on_fire", name: "En Llamas", description: "Consigue una racha de 5 aciertos seguidos", condition: (s: UserStats) => s.current_streak >= 5 },
            { id: "unstoppable", name: "Imparable", description: "Consigue una racha de 10 aciertos seguidos", condition: (s: UserStats) => s.current_streak >= 10 },
        ];

        for (const def of definitions) {
            if (!this.achievements.includes(def.id) && def.condition(this.stats)) {
                this.achievements.push(def.id);
                unlocked.push({ id: def.id, name: def.name, description: def.description });
            }
        }

        return unlocked;
    }

    /**
     * Obtiene el progreso hacia el siguiente nivel.
     * @returns {{ current: number; max: number }} Objeto con XP actual en el nivel y XP requerida para el siguiente.
     */
    getNextLevelProgress() {
        const currentLevelXp = this.xp % 100;
        return { current: currentLevelXp, max: 100 };
    }
}

/** Instancia global del perfil de usuario. */
export const userProfile = new UserProfile();
