import json
import os
from utils import get_external_path

class UserProfile:
    def __init__(self):
        self.xp = 0
        self.level = 1
        self.stats = {
            "total_correct": 0,
            "total_attempts": 0,
            "current_streak": 0,
            "best_streak": 0
        }
        self.achievements = []
        self.filepath = get_external_path(os.path.join("data", "user_progress.json"))
        self.load()

    def load(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.xp = data.get("xp", 0)
                    self.level = data.get("level", 1)
                    self.stats = data.get("stats", self.stats)
                    self.achievements = data.get("achievements", [])
            except Exception as e:
                print(f"Error loading user profile: {e}")

    def save(self):
        data = {
            "xp": self.xp,
            "level": self.level,
            "stats": self.stats,
            "achievements": self.achievements
        }
        try:
            # Ensure directory exists
            os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            print(f"Error saving user profile: {e}")

    def add_xp(self, amount):
        old_level = self.level
        self.xp += amount
        self.calculate_level()
        return self.level > old_level

    def calculate_level(self):
        # Formula: Level = 1 + (XP // 100)
        # Linear progression: 100 XP per level
        self.level = 1 + (self.xp // 100)

    def record_attempt(self, correct: bool):
        self.stats["total_attempts"] += 1
        if correct:
            self.stats["total_correct"] += 1
            self.stats["current_streak"] += 1
            if self.stats["current_streak"] > self.stats["best_streak"]:
                self.stats["best_streak"] = self.stats["current_streak"]
        else:
            self.stats["current_streak"] = 0

        self.check_achievements()
        self.save()

    def check_achievements(self):
        new_unlocks = []

        # Define Achievements conditions
        # (ID, Name, Description, Condition Lambda)
        definitions = [
            ("first_step", "Primer Paso", "Responde correctamente tu primera pregunta",
             lambda s: s["total_correct"] >= 1),
            ("scholar", "Estudioso", "Responde 10 preguntas correctamente",
             lambda s: s["total_correct"] >= 10),
            ("master", "Maestro", "Responde 50 preguntas correctamente",
             lambda s: s["total_correct"] >= 50),
            ("on_fire", "En Llamas", "Consigue una racha de 5 aciertos seguidos",
             lambda s: s["current_streak"] >= 5),
            ("unstoppable", "Imparable", "Consigue una racha de 10 aciertos seguidos",
             lambda s: s["current_streak"] >= 10)
        ]

        for aid, name, desc, condition in definitions:
            if aid not in self.achievements:
                if condition(self.stats):
                    self.achievements.append(aid)
                    new_unlocks.append((name, desc))

        return new_unlocks

    def get_progress_to_next_level(self):
        # Returns (current_level_xp, xp_needed_for_next_level)
        # Since level is every 100 XP
        # XP = 150. Level = 2. XP into level = 50.
        # XP needed = 100.
        current_level_xp = self.xp % 100
        return current_level_xp, 100
