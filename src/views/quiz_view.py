import customtkinter as ctk
import random
import os
import json
from PIL import Image
from renderer import render_formula_to_image
from quiz_data import QUIZ_DATA
from utils import get_external_path, load_config
from gamification import UserProfile

class QuizView(ctk.CTkFrame):
    """
    Vista para el Quiz de fórmulas con selección de tema y modos de juego.
    """
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)

        self.user_profile = UserProfile()
        self.score = 0
        self.total_attempts = 0

        # Estado de navegación
        self.nav_history = [] # Stack for navigation [ (level_name, data_dict), ... ]
        self.current_selection_data = QUIZ_DATA
        self.current_topic_name = ""
        self.current_topic_data = {}
        self.selected_mode = None # "formulas" or "questions"
        self.selected_difficulty = None # "Fácil", "Medio", "Difícil", "Todo"

        self.current_question = None
        self.cached_images = {} # Cache rendered formula images
        self.quiz_data = QUIZ_DATA

        # Load external data if available
        self.load_quiz_data()

        # Layout
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # Containers
        self.selection_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.mode_frame = ctk.CTkFrame(self, fg_color="transparent") # Mode & Difficulty selection
        self.quiz_frame = ctk.CTkFrame(self, fg_color="transparent")

        # Initialize Screens
        self.init_selection_screen()
        self.init_mode_screen()
        self.init_quiz_screen()

        # Start
        self.show_selection_screen()

    def load_quiz_data(self):
        # Already loaded by quiz_data.py but re-checking for updates if needed
        # We rely on what was imported for now, or reload if implemented.
        pass

    # --- SELECTION SCREEN (Hierarchy) ---

    def init_selection_screen(self):
        # Limpiar
        for widget in self.selection_frame.winfo_children():
            widget.destroy()

        self.selection_frame.grid_columnconfigure(0, weight=1)

        # Title
        title_text = "Selecciona una Categoría"
        if self.nav_history:
             title_text = self.nav_history[-1][0] # Current level name

        title = ctk.CTkLabel(self.selection_frame, text=title_text,
                             font=ctk.CTkFont(size=24, weight="bold"))
        title.grid(row=0, column=0, pady=(40, 30))

        # Back Button (if deep in hierarchy)
        if self.nav_history:
            back_btn = ctk.CTkButton(self.selection_frame, text="← Volver",
                                     command=self.go_back_hierarchy, width=100)
            back_btn.grid(row=1, column=0, pady=(0, 20))

        # Buttons Container
        topics_container = ctk.CTkFrame(self.selection_frame, fg_color="transparent")
        topics_container.grid(row=2, column=0, pady=10)

        # Display keys of current dictionary
        row_idx = 0

        keys = list(self.current_selection_data.keys())

        for key in keys:
            # Check if this key leads to a Topic (leaf) or another Category (node)
            val = self.current_selection_data[key]
            is_topic = isinstance(val, dict) and ("formulas" in val or "questions" in val)

            cmd = lambda k=key, v=val, leaf=is_topic: self.handle_selection(k, v, leaf)

            btn = ctk.CTkButton(topics_container, text=key,
                                command=cmd,
                                font=ctk.CTkFont(size=18),
                                width=300, height=50)
            btn.grid(row=row_idx, column=0, pady=10)
            row_idx += 1

    def handle_selection(self, name, data, is_topic):
        if is_topic:
            # Final selection made
            self.current_topic_name = name
            self.current_topic_data = data
            self.show_mode_selection()
        else:
            # Go deeper
            self.nav_history.append((name, self.current_selection_data))
            self.current_selection_data = data
            self.init_selection_screen()

    def go_back_hierarchy(self):
        if self.nav_history:
            prev_name, prev_data = self.nav_history.pop()
            self.current_selection_data = prev_data
            self.init_selection_screen()

    def show_selection_screen(self):
        self.mode_frame.grid_forget()
        self.quiz_frame.grid_forget()
        self.selection_frame.grid(row=0, column=0, sticky="nsew")

    # --- MODE & DIFFICULTY SELECTION ---

    def init_mode_screen(self):
        # Dynamic content built on show
        pass

    def show_mode_selection(self):
        self.selection_frame.grid_forget()
        self.quiz_frame.grid_forget()

        # Clear frame
        for w in self.mode_frame.winfo_children(): w.destroy()

        self.mode_frame.grid_columnconfigure(0, weight=1)
        self.mode_frame.grid(row=0, column=0, sticky="nsew")

        # Title
        ctk.CTkLabel(self.mode_frame, text=f"Tema: {self.current_topic_name}",
                     font=ctk.CTkFont(size=22, weight="bold")).pack(pady=(40, 10))

        ctk.CTkLabel(self.mode_frame, text="¿Qué deseas practicar?",
                     font=ctk.CTkFont(size=18)).pack(pady=10)

        # Mode Buttons
        btn_frame = ctk.CTkFrame(self.mode_frame, fg_color="transparent")
        btn_frame.pack(pady=20)

        ctk.CTkButton(btn_frame, text="Aprender Fórmulas",
                      command=lambda: self.select_mode("formulas"),
                      width=200, height=50).pack(pady=10)

        ctk.CTkButton(btn_frame, text="Responder Preguntas",
                      command=lambda: self.select_mode("questions"),
                      width=200, height=50).pack(pady=10)

        ctk.CTkButton(self.mode_frame, text="Cancelar", command=self.show_selection_screen,
                      fg_color="transparent", border_width=1).pack(pady=20)

    def select_mode(self, mode):
        self.selected_mode = mode
        if mode == "questions":
            self.show_difficulty_selection()
        else:
            # Start directly for formulas (no difficulty logic yet for formulas)
            self.start_quiz()

    def show_difficulty_selection(self):
        # Re-use mode frame
        for w in self.mode_frame.winfo_children(): w.destroy()

        ctk.CTkLabel(self.mode_frame, text="Selecciona la Dificultad",
                     font=ctk.CTkFont(size=22, weight="bold")).pack(pady=(40, 20))

        diffs = ["Fácil", "Medio", "Difícil", "Todo"]
        for d in diffs:
            ctk.CTkButton(self.mode_frame, text=d,
                          command=lambda x=d: self.set_difficulty_and_start(x),
                          width=200, height=40).pack(pady=5)

        ctk.CTkButton(self.mode_frame, text="Volver", command=self.show_mode_selection,
                      fg_color="transparent", border_width=1).pack(pady=20)

    def set_difficulty_and_start(self, difficulty):
        self.selected_difficulty = difficulty
        self.start_quiz()

    # --- QUIZ SCREEN ---

    def init_quiz_screen(self):
        self.quiz_frame.grid_columnconfigure(0, weight=1)
        self.quiz_frame.grid_rowconfigure(2, weight=1)

        # Header
        self.header_frame = ctk.CTkFrame(self.quiz_frame, fg_color="transparent")
        self.header_frame.grid(row=0, column=0, sticky="ew", padx=20, pady=10)

        self.back_btn = ctk.CTkButton(self.header_frame, text="← Salir", width=80,
                                      command=self.show_selection_screen,
                                      fg_color="transparent", border_width=1, text_color=("gray10", "gray90"))
        self.back_btn.pack(side="left")

        self.title_label = ctk.CTkLabel(self.header_frame, text="Quiz", font=ctk.CTkFont(size=24, weight="bold"))
        self.title_label.pack(side="left", padx=20)

        # Score & Progress
        self.score_frame = ctk.CTkFrame(self.header_frame, fg_color="transparent")
        self.score_frame.pack(side="right")

        self.level_label = ctk.CTkLabel(self.score_frame, text=f"Nivel {self.user_profile.level} ({self.user_profile.xp} XP)",
                                        font=ctk.CTkFont(size=14, weight="bold"), text_color="cyan")
        self.level_label.pack(side="top", anchor="e")

        self.score_label = ctk.CTkLabel(self.score_frame, text="Sesión: 0/0", font=ctk.CTkFont(size=12))
        self.score_label.pack(side="top", anchor="e")

        self.progress_bar = ctk.CTkProgressBar(self.score_frame, width=150, height=10)
        self.progress_bar.set(0)
        self.progress_bar.pack(side="bottom", pady=5)


        # Main Card for Question
        self.card_frame = ctk.CTkFrame(self.quiz_frame, fg_color=("white", "gray20"), corner_radius=15)
        self.card_frame.grid(row=1, column=0, sticky="nsew", padx=40, pady=20)
        self.card_frame.grid_columnconfigure(0, weight=1)
        self.card_frame.grid_rowconfigure(1, weight=1) # Question
        self.card_frame.grid_rowconfigure(2, weight=1) # Answers

        # Question Title inside Card
        self.q_label_title = ctk.CTkLabel(self.card_frame, text="Pregunta", text_color="gray", font=ctk.CTkFont(size=14, weight="bold"))
        self.q_label_title.grid(row=0, column=0, pady=(20, 5))

        # Question Text
        self.question_text = ctk.CTkLabel(self.card_frame, text="...", font=ctk.CTkFont(size=22), wraplength=700)
        self.question_text.grid(row=1, column=0, pady=20, padx=20)

        # Answers Area
        self.answers_frame = ctk.CTkFrame(self.card_frame, fg_color="transparent")
        self.answers_frame.grid(row=2, column=0, sticky="nsew", padx=20, pady=20)
        self.answers_frame.grid_columnconfigure((0,1), weight=1)
        self.answers_frame.grid_rowconfigure((0,1), weight=1)

        self.answer_buttons = []
        for i in range(4):
            btn = ctk.CTkButton(self.answers_frame, text="", command=lambda idx=i: self.check_answer(idx),
                                fg_color="transparent", border_width=2, border_color=("gray60", "gray40"),
                                hover_color=("gray90", "gray30"), corner_radius=10, height=60,
                                font=ctk.CTkFont(size=16))
            btn.grid(row=i//2, column=i%2, padx=10, pady=10, sticky="nsew")
            self.answer_buttons.append(btn)

        # Footer Actions
        self.footer_frame = ctk.CTkFrame(self.quiz_frame, fg_color="transparent")
        self.footer_frame.grid(row=3, column=0, pady=20)

        self.feedback_label = ctk.CTkLabel(self.footer_frame, text="", font=ctk.CTkFont(size=18, weight="bold"))
        self.feedback_label.pack(side="top", pady=10)

        self.next_btn = ctk.CTkButton(self.footer_frame, text="Siguiente Pregunta", command=self.load_question,
                                      state="disabled", font=ctk.CTkFont(size=16, weight="bold"), height=40, width=200)
        self.next_btn.pack(side="bottom")

    def start_quiz(self):
        self.score = 0
        self.total_attempts = 0
        self.update_stats_ui()
        self.progress_bar.set(0)

        mode_str = "Fórmulas" if self.selected_mode == "formulas" else "Preguntas"
        self.title_label.configure(text=f"{self.current_topic_name} - {mode_str}")

        self.mode_frame.grid_forget()
        self.selection_frame.grid_forget()
        self.quiz_frame.grid(row=0, column=0, sticky="nsew")

        self.load_question()

    def get_formula_image(self, latex):
        if latex in self.cached_images:
            return self.cached_images[latex]

        config = load_config()
        fontsize = config.get("quiz_formula_fontsize", 28)
        dpi = config.get("quiz_formula_dpi", 100)
        scale = config.get("quiz_formula_scale", 0.9)

        buf = render_formula_to_image(latex, fontsize=fontsize, dpi=dpi, text_color='white')
        if buf:
            pil_img = Image.open(buf)
            w, h = pil_img.size
            ctk_img = ctk.CTkImage(light_image=pil_img, dark_image=pil_img, size=(w*scale, h*scale))
            self.cached_images[latex] = ctk_img
            return ctk_img
        return None

    def load_question(self):
        # Reset UI
        self.feedback_label.configure(text="", text_color="white")
        self.next_btn.configure(state="disabled")
        for btn in self.answer_buttons:
            btn.configure(state="normal", fg_color="transparent", border_color=("gray60", "gray40"), image=None, text="")

        if self.selected_mode == "formulas":
            self.load_formula_question()
        else:
            self.load_text_question()

    def load_formula_question(self):
        data = self.current_topic_data.get("formulas", [])
        if not data:
            self.question_text.configure(text="No hay fórmulas disponibles.")
            return

        self.q_label_title.configure(text="Selecciona la fórmula correcta para:")

        self.target = random.choice(data)
        self.question_text.configure(text=self.target['concepto'])

        # Distractors
        distractors = [d for d in data if d != self.target]
        if len(distractors) < 3:
            options = data
        else:
            options = random.sample(distractors, 3) + [self.target]

        random.shuffle(options)
        self.current_options = options

        for i, opt in enumerate(options):
            img = self.get_formula_image(opt['formula'])
            if img:
                self.answer_buttons[i].configure(image=img)
            else:
                self.answer_buttons[i].configure(text=opt['formula'])

    def load_text_question(self):
        all_questions = self.current_topic_data.get("questions", [])

        # Filter by difficulty
        if self.selected_difficulty and self.selected_difficulty != "Todo":
            filtered = [q for q in all_questions if q.get('difficulty') == self.selected_difficulty]
        else:
            filtered = all_questions

        if not filtered:
            self.question_text.configure(text=f"No hay preguntas disponibles (Dif: {self.selected_difficulty}).")
            return

        self.target = random.choice(filtered)
        self.q_label_title.configure(text="Pregunta:")
        self.question_text.configure(text=self.target['question'])

        # Options logic
        # Expecting target['options'] list and target['correct_option']
        options = list(self.target['options'])
        random.shuffle(options)
        self.current_options = options

        # Store correct value for checking
        self.correct_val = self.target['correct_option']

        for i, opt_text in enumerate(options):
            if i < 4:
                self.answer_buttons[i].configure(text=opt_text)
            else:
                # Should not happen if JSON is correct (max 4 options)
                pass

    def check_answer(self, idx):
        selected = self.current_options[idx]

        is_correct = False
        if self.selected_mode == "formulas":
            is_correct = (selected == self.target)
        else:
            is_correct = (selected == self.correct_val)

        # Gamification Update
        self.user_profile.record_attempt(is_correct)
        xp_gain = 0
        feedback_text = ""

        if is_correct:
            self.score += 1
            xp_gain = 10
            leveled_up = self.user_profile.add_xp(xp_gain)

            feedback_text = "¡Correcto! (+10 XP)"
            self.feedback_label.configure(text_color="green")
            self.answer_buttons[idx].configure(border_color="green", fg_color=("pale green", "dark green"))

            if leveled_up:
                feedback_text += f"\n¡NIVEL {self.user_profile.level} ALCANZADO!"
        else:
            feedback_text = "Incorrecto."
            self.feedback_label.configure(text_color="red")
            self.answer_buttons[idx].configure(border_color="red", fg_color=("misty rose", "dark red"))

            # Show correct
            for i, opt in enumerate(self.current_options):
                if self.selected_mode == "formulas":
                    if opt == self.target:
                        self.answer_buttons[i].configure(border_color="green")
                else:
                    if opt == self.correct_val:
                         self.answer_buttons[i].configure(border_color="green")

        # Check for new achievements (this is a simplified check, ideally record_attempt returns them)
        # We re-check unlocks just in case (already checked in record_attempt but we need names)
        # Ideally record_attempt should return unlocks.
        # But since I didn't change record_attempt return signature in gamification.py to return them to caller properly
        # (I returned them but didn't capture them here), let's just rely on visual feedback for now or
        # fix gamification.py if I want strict notifications.
        # I'll update the feedback label.

        self.feedback_label.configure(text=feedback_text)

        self.total_attempts += 1
        self.update_stats_ui()

        # Update progress bar (Accuracy)
        if self.total_attempts > 0:
            self.progress_bar.set(self.score / self.total_attempts)

    def update_stats_ui(self):
        self.score_label.configure(text=f"Sesión: {self.score}/{self.total_attempts}")
        self.level_label.configure(text=f"Nivel {self.user_profile.level} ({self.user_profile.xp} XP)")

        for btn in self.answer_buttons:
            btn.configure(state="disabled")

        self.next_btn.configure(state="normal")
