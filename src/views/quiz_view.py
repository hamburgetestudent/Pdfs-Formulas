import customtkinter as ctk
import random
import os
import json
from PIL import Image
from renderer import render_formula_to_image
from quiz_data import QUIZ_DATA
from utils import get_external_path, load_config

class QuizView(ctk.CTkFrame):
    """
    Vista para el Quiz de fórmulas con selección de tema.
    """
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)

        self.score = 0
        self.total_attempts = 0
        self.current_topic = None
        self.current_question = None
        self.cached_images = {} # Cache rendered formula images
        self.quiz_data = QUIZ_DATA # Start with imported data

        # Load external data if available
        self.load_quiz_data()

        # Layout
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1) # Main content area

        # Containers
        self.selection_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.quiz_frame = ctk.CTkFrame(self, fg_color="transparent")

        # Initialize Selection Screen
        self.init_selection_screen()

        # Initialize Quiz Screen (Structure)
        self.init_quiz_screen()

        # Start with selection screen
        self.show_selection_screen()

    def load_quiz_data(self):
        # Check for external JSON file
        external_path = get_external_path(os.path.join("data", "quiz_data.json"))
        if os.path.exists(external_path):
            try:
                with open(external_path, "r", encoding="utf-8") as f:
                    external_data = json.load(f)
                    if external_data:
                        self.quiz_data = external_data
                        print(f"Loaded external quiz data from {external_path}")
            except Exception as e:
                print(f"Failed to load external quiz data: {e}")

    def init_selection_screen(self):
        # Clean previous
        for widget in self.selection_frame.winfo_children():
            widget.destroy()

        self.selection_frame.grid_columnconfigure(0, weight=1)

        # Title
        title = ctk.CTkLabel(self.selection_frame, text="Selecciona un Tema de Estudio",
                             font=ctk.CTkFont(size=24, weight="bold"))
        title.grid(row=0, column=0, pady=(40, 30))

        # Buttons Container
        topics_container = ctk.CTkFrame(self.selection_frame, fg_color="transparent")
        topics_container.grid(row=1, column=0, pady=10)

        row_idx = 0
        for topic in self.quiz_data.keys():
            btn = ctk.CTkButton(topics_container, text=topic,
                                command=lambda t=topic: self.start_quiz(t),
                                font=ctk.CTkFont(size=18),
                                width=300, height=50)
            btn.grid(row=row_idx, column=0, pady=10)
            row_idx += 1

    def init_quiz_screen(self):
        self.quiz_frame.grid_columnconfigure(0, weight=1)
        self.quiz_frame.grid_rowconfigure(2, weight=1) # Buttons area expand

        # Header
        self.header_frame = ctk.CTkFrame(self.quiz_frame, fg_color="transparent")
        self.header_frame.grid(row=0, column=0, sticky="ew", padx=20, pady=10)

        # Back Button in Header
        self.back_btn = ctk.CTkButton(self.header_frame, text="← Temas", width=80,
                                      command=self.show_selection_screen)
        self.back_btn.pack(side="left")

        self.title_label = ctk.CTkLabel(self.header_frame, text="Quiz de Física", font=ctk.CTkFont(size=20, weight="bold"))
        self.title_label.pack(side="left", padx=20)

        self.score_label = ctk.CTkLabel(self.header_frame, text="Puntaje: 0/0", font=ctk.CTkFont(size=16))
        self.score_label.pack(side="right")

        # Question Area
        self.question_frame = ctk.CTkFrame(self.quiz_frame, fg_color=("gray85", "gray17"))
        self.question_frame.grid(row=1, column=0, sticky="ew", padx=20, pady=10)

        self.q_label_title = ctk.CTkLabel(self.question_frame, text="Selecciona la fórmula correcta para:", text_color="gray")
        self.q_label_title.pack(pady=(10,0))

        self.concept_label = ctk.CTkLabel(self.question_frame, text="...", font=ctk.CTkFont(size=22, weight="bold"))
        self.concept_label.pack(pady=10)

        # Answers Area
        self.answers_frame = ctk.CTkFrame(self.quiz_frame, fg_color="transparent")
        self.answers_frame.grid(row=2, column=0, sticky="nsew", padx=20, pady=10)
        self.answers_frame.grid_columnconfigure((0,1), weight=1)
        self.answers_frame.grid_rowconfigure((0,1), weight=1)

        self.answer_buttons = []
        for i in range(4):
            btn = ctk.CTkButton(self.answers_frame, text="", command=lambda idx=i: self.check_answer(idx),
                                fg_color="transparent", border_width=2, border_color=("gray70", "gray30"),
                                hover_color=("gray90", "gray25"))
            btn.grid(row=i//2, column=i%2, padx=10, pady=10, sticky="nsew")
            self.answer_buttons.append(btn)

        # Feedback Area
        self.feedback_label = ctk.CTkLabel(self.quiz_frame, text="", font=ctk.CTkFont(size=16, weight="bold"))
        self.feedback_label.grid(row=3, column=0, pady=10)

        # Next Button
        self.next_btn = ctk.CTkButton(self.quiz_frame, text="Siguiente Pregunta", command=self.load_question, state="disabled")
        self.next_btn.grid(row=4, column=0, pady=20)

    def show_selection_screen(self):
        self.quiz_frame.grid_forget()
        # Refresh topics in case data changed (unlikely but good practice if reload implemented)
        self.init_selection_screen()
        self.selection_frame.grid(row=0, column=0, sticky="nsew")

    def start_quiz(self, topic):
        self.current_topic = topic
        self.title_label.configure(text=f"Quiz: {topic}")
        # Reset score for new session? Or keep cumulative?
        # Typically per session is better.
        self.score = 0
        self.total_attempts = 0
        self.score_label.configure(text="Puntaje: 0/0")

        self.selection_frame.grid_forget()
        self.quiz_frame.grid(row=0, column=0, sticky="nsew")
        self.load_question()

    def get_formula_image(self, latex):
        if latex in self.cached_images:
            return self.cached_images[latex]

        # Render
        config = load_config()
        fontsize = config.get("quiz_formula_fontsize", 28)
        dpi = config.get("quiz_formula_dpi", 100)

        buf = render_formula_to_image(latex, fontsize=fontsize, dpi=dpi, text_color='white')
        if buf:
            pil_img = Image.open(buf)
            # Create CTkImage
            w, h = pil_img.size

            # Load config for scale
            scale = config.get("quiz_formula_scale", 0.9)

            ctk_img = ctk.CTkImage(light_image=pil_img, dark_image=pil_img, size=(w*scale, h*scale))
            self.cached_images[latex] = ctk_img
            return ctk_img
        return None

    def load_question(self):
        # Reset UI
        self.feedback_label.configure(text="", text_color="white")
        self.next_btn.configure(state="disabled")
        for btn in self.answer_buttons:
            btn.configure(state="normal", fg_color="transparent", border_color=("gray70", "gray30"))

        # Get data
        data = self.quiz_data.get(self.current_topic, [])
        if not data:
            self.concept_label.configure(text="No hay datos disponibles para este tema.")
            return

        # Pick correct answer
        self.target = random.choice(data)
        self.concept_label.configure(text=self.target['concepto'])

        # Pick 3 distractors
        distractors = [d for d in data if d != self.target]
        if len(distractors) < 3:
            # Not enough data for unique distractors
            options = data
        else:
            options = random.sample(distractors, 3) + [self.target]

        random.shuffle(options)
        self.current_options = options

        # Set buttons
        for i, opt in enumerate(options):
            img = self.get_formula_image(opt['formula'])
            if img:
                self.answer_buttons[i].configure(image=img, text="")
            else:
                self.answer_buttons[i].configure(image=None, text=opt['formula']) # Fallback

    def check_answer(self, idx):
        selected = self.current_options[idx]
        is_correct = (selected == self.target)

        if is_correct:
            self.score += 1
            self.feedback_label.configure(text="¡Correcto!", text_color="green")
            self.answer_buttons[idx].configure(border_color="green", fg_color=("pale green", "dark green"))
        else:
            self.feedback_label.configure(text="Incorrecto.", text_color="red")
            self.answer_buttons[idx].configure(border_color="red", fg_color=("misty rose", "dark red"))

            # Show which one was correct
            for i, opt in enumerate(self.current_options):
                if opt == self.target:
                    self.answer_buttons[i].configure(border_color="green")

        self.total_attempts += 1
        self.score_label.configure(text=f"Puntaje: {self.score}/{self.total_attempts}")

        # Disable buttons
        for btn in self.answer_buttons:
            btn.configure(state="disabled")

        self.next_btn.configure(state="normal")
