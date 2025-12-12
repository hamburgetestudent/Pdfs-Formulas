export interface UserStats {
    total_correct: number;
    total_attempts: number;
    current_streak: number;
    best_streak: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlockedAt?: string;
}

const STORAGE_KEY = 'physicode_user_profile';

export class UserProfile {
    xp: number = 0;
    gems: number = 0;
    level: number = 1;
    stats: UserStats = {
        total_correct: 0,
        total_attempts: 0,
        current_streak: 0,
        best_streak: 0,
    };
    achievements: string[] = [];

    constructor() {
        this.load();
    }

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

    addXp(amount: number): boolean {
        const oldLevel = this.level;
        this.xp += amount;
        this.calculateLevel();
        this.save();
        return this.level > oldLevel;
    }

    addGems(amount: number) {
        this.gems += amount;
        this.save();
    }

    calculateLevel() {
        // Linear progression: 100 XP per level
        this.level = 1 + Math.floor(this.xp / 100);
    }

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

    getNextLevelProgress() {
        const currentLevelXp = this.xp % 100;
        return { current: currentLevelXp, max: 100 };
    }
}

export const userProfile = new UserProfile();
