import customtkinter as ctk
import random
from PIL import Image
from core.renderer import render_formula_to_image
from core.utils import load_config
from core.gamification import UserProfile

class LessonView(ctk.CTkFrame):
    """
    The interactive lesson interface (Duolingo style).
    Shows Progress Bar, Content Area (Visualization/Question), and Options.
    """
    def __init__(self, master, topic_name, topic_data, mode, on_finish, user_profile, **kwargs):
        super().__init__(master, **kwargs)
        self.topic_name = topic_name
        self.topic_data = topic_data
        self.mode = mode # "formulas" or "questions"
        self.on_finish = on_finish

        self.user_profile = user_profile
        self.config = load_config()

        # State
        self.current_index = 0
        self.items = [] # List of items to go through
        self.current_item = None
        self.selected_option = None # Index of selected option
        self.is_correct = False
        self.feedback_shown = False
        self.cached_images = {}

        # Load content
        self._load_items()

        # Layout
        self.configure(fg_color="#030712") # gray-950 background
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1) # Content expands

        # --- UI Components ---

        # 1. Header (Progress Bar)
        self.header_frame = ctk.CTkFrame(self, fg_color="transparent", height=60)
        self.header_frame.grid(row=0, column=0, sticky="ew", padx=20, pady=10)

        self.close_btn = ctk.CTkButton(
            self.header_frame, text="✕", width=40, height=40,
            fg_color="transparent", hover_color="#374151",
            font=ctk.CTkFont(size=20), text_color="#9CA3AF",
            command=self.on_finish
        )
        self.close_btn.pack(side="left")

        self.progress_bar = ctk.CTkProgressBar(self.header_frame, height=16, corner_radius=8, progress_color="#4ADE80", fg_color="#374151") # green-400
        self.progress_bar.pack(side="left", fill="x", expand=True, padx=20)
        self.progress_bar.set(0)

        # 2. Main Content
        self.content_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.content_frame.grid(row=1, column=0, sticky="nsew", padx=20, pady=10)
        self.content_frame.grid_columnconfigure(0, weight=1)

        # Question / Instruction Text
        self.question_label = ctk.CTkLabel(
            self.content_frame,
            text="...",
            font=ctk.CTkFont(size=24, weight="bold"),
            text_color="white",
            wraplength=800
        )
        self.question_label.pack(pady=(20, 40))

        # Visualization Area (Rocket/Code in example -> Formula/Image here)
        self.viz_frame = ctk.CTkFrame(
            self.content_frame,
            fg_color="#1F2937", # gray-800
            corner_radius=16,
            height=200
        )
        self.viz_frame.pack(fill="x", padx=40, pady=(0, 40))
        self.viz_frame.pack_propagate(False) # Fixed height

        self.viz_label = ctk.CTkLabel(self.viz_frame, text="")
        self.viz_label.place(relx=0.5, rely=0.5, anchor="center")

        # Options Grid
        self.options_frame = ctk.CTkFrame(self.content_frame, fg_color="transparent")
        self.options_frame.pack(fill="both", expand=True, padx=40, pady=20)
        self.options_frame.grid_columnconfigure((0, 1, 2), weight=1) # 3 columns for desktop

        self.option_buttons = []
        for i in range(4): # Max 4 options usually
            btn = ctk.CTkButton(
                self.options_frame,
                text="",
                font=ctk.CTkFont(size=18),
                fg_color="transparent",
                border_width=2,
                border_color="#374151", # gray-700
                hover_color="#374151",
                text_color="#D1D5DB", # gray-300
                corner_radius=12,
                height=80,
                command=lambda idx=i: self.handle_select(idx)
            )
            btn.grid(row=i//2, column=i%2, padx=10, pady=10, sticky="nsew") # 2x2 grid is safer for responsive
            self.option_buttons.append(btn)

        # 3. Footer (Action Button)
        self.footer_frame = ctk.CTkFrame(self, fg_color="#111827", height=100, corner_radius=0) # gray-900 border-t
        self.footer_frame.grid(row=2, column=0, sticky="ew")
        self.footer_frame.grid_columnconfigure(0, weight=1)

        # Feedback area (hidden by default)
        self.feedback_frame = ctk.CTkFrame(self.footer_frame, fg_color="transparent")

        self.feedback_icon = ctk.CTkLabel(self.feedback_frame, text="", font=ctk.CTkFont(size=30))
        self.feedback_icon.pack(side="left", padx=10)

        self.feedback_text = ctk.CTkLabel(self.feedback_frame, text="", font=ctk.CTkFont(size=20, weight="bold"))
        self.feedback_text.pack(side="left")

        self.check_btn = ctk.CTkButton(
            self.footer_frame,
            text="COMPROBAR",
            font=ctk.CTkFont(size=18, weight="bold"),
            fg_color="#374151", # gray-700 disabled look initially
            text_color="#9CA3AF",
            height=50,
            width=200,
            state="disabled",
            command=self.handle_check
        )
        self.check_btn.pack(side="right", padx=40, pady=25)
        self.feedback_frame.pack(side="left", padx=40)

        # Start
        self.load_next_question()

    def _load_items(self):
        if self.mode == "formulas":
            self.items = self.topic_data.get("formulas", [])
        else:
            self.items = self.topic_data.get("questions", [])

        random.shuffle(self.items)
        # Limit number of items per lesson to e.g. 5 for bite-sized learning
        self.items = self.items[:5]

    def load_next_question(self):
        if self.current_index >= len(self.items):
            # Lesson Complete
            self.on_finish() # Or show summary screen
            return

        self.current_item = self.items[self.current_index]
        self.selected_option = None
        self.feedback_shown = False

        # Reset UI
        self.footer_frame.configure(fg_color="#111827", border_color="#1F2937", border_width=1) # Reset footer bg
        self.feedback_frame.pack_forget() # Hide feedback text
        self.check_btn.configure(text="COMPROBAR", state="disabled", fg_color="#374151", text_color="#9CA3AF")

        # Prepare Options
        options = []
        target_val = ""

        if self.mode == "formulas":
            # Item is { "concepto": ..., "formula": ... }
            self.question_label.configure(text=f"¿Cuál es la fórmula para: {self.current_item['concepto']}?")
            target_val = self.current_item

            # Distractors
            all_formulas = self.topic_data.get("formulas", [])
            distractors = [f for f in all_formulas if f != target_val]
            opts = random.sample(distractors, min(3, len(distractors))) + [target_val]
            random.shuffle(opts)
            self.current_options = opts # List of dicts

            # Display
            self.viz_label.configure(text="?", font=ctk.CTkFont(size=60), image=None)

            for i, btn in enumerate(self.option_buttons):
                if i < len(opts):
                    btn.grid()
                    # Render formula for button
                    latex = opts[i]['formula']
                    img = self._get_rendered_image(latex)
                    if img:
                        btn.configure(image=img, text="")
                    else:
                        btn.configure(text=latex, image=None)

                    # Reset style
                    btn.configure(border_color="#374151", fg_color="transparent")
                else:
                    btn.grid_remove()

        else:
            # Questions mode
            # Item is { "question": ..., "options": [], "correct_option": ... }
            self.question_label.configure(text=self.current_item["question"])
            self.viz_label.configure(text="❓", font=ctk.CTkFont(size=60)) # Placeholder icon

            self.current_options = list(self.current_item["options"])
            random.shuffle(self.current_options)

            for i, btn in enumerate(self.option_buttons):
                if i < len(self.current_options):
                    btn.grid()
                    btn.configure(text=self.current_options[i], image=None)
                    btn.configure(border_color="#374151", fg_color="transparent")
                else:
                    btn.grid_remove()

    def handle_select(self, idx):
        if self.feedback_shown: return

        self.selected_option = idx

        # Visual update
        for i, btn in enumerate(self.option_buttons):
            if i == idx:
                btn.configure(border_color="#22D3EE", fg_color="#164E63") # cyan border/bg
            else:
                btn.configure(border_color="#374151", fg_color="transparent")

        # Enable Check button
        self.check_btn.configure(state="normal", fg_color="#22D3EE", text_color="#000000", hover_color="#06B6D4")

    def handle_check(self):
        if self.feedback_shown:
            # Continue to next
            self.current_index += 1
            self.progress_bar.set(self.current_index / len(self.items))
            self.load_next_question()
            return

        # Check logic
        self.feedback_shown = True
        selected_val = self.current_options[self.selected_option]

        correct = False
        correct_idx = -1

        if self.mode == "formulas":
            if selected_val == self.current_item:
                correct = True
            # Find correct idx for highlighting
            for i, opt in enumerate(self.current_options):
                if opt == self.current_item:
                    correct_idx = i
                    break
        else:
            if selected_val == self.current_item["correct_option"]:
                correct = True
            for i, opt in enumerate(self.current_options):
                if opt == self.current_item["correct_option"]:
                    correct_idx = i
                    break

        # Update Gamification
        self.user_profile.record_attempt(correct)
        if correct:
            self.user_profile.add_xp(10)
            self.user_profile.add_gems(5) # 5 gems per correct answer

        # Feedback UI
        self.feedback_frame.pack(side="left", padx=40)
        self.check_btn.configure(text="CONTINUAR")

        if correct:
            self.footer_frame.configure(fg_color="#14532D", border_color="#22C55E") # green-900/green-500
            self.feedback_icon.configure(text="✅", text_color="#4ADE80")
            self.feedback_text.configure(text="¡Correcto!", text_color="#4ADE80")

            self.check_btn.configure(fg_color="#22C55E", hover_color="#16A34A", text_color="white")

            # Highlight selected as green
            self.option_buttons[self.selected_option].configure(border_color="#22C55E", fg_color="#14532D")

        else:
            self.footer_frame.configure(fg_color="#450A0A", border_color="#EF4444") # red-900/red-500
            self.feedback_icon.configure(text="❌", text_color="#F87171")
            self.feedback_text.configure(text=f"Incorrecto", text_color="#F87171")

            self.check_btn.configure(fg_color="#EF4444", hover_color="#DC2626", text_color="white")

            # Highlight selected as red
            self.option_buttons[self.selected_option].configure(border_color="#EF4444", fg_color="#450A0A")
            # Highlight correct as green
            if correct_idx != -1:
                self.option_buttons[correct_idx].configure(border_color="#22C55E", fg_color="#14532D")

    def _get_rendered_image(self, latex):
        if latex in self.cached_images:
            return self.cached_images[latex]

        fontsize = 20
        scale = 0.6 # Smaller for buttons

        buf = render_formula_to_image(latex, fontsize=fontsize, dpi=100, text_color='white')
        if buf:
            pil_img = Image.open(buf)
            w, h = pil_img.size
            ctk_img = ctk.CTkImage(light_image=pil_img, dark_image=pil_img, size=(w*scale, h*scale))
            self.cached_images[latex] = ctk_img
            return ctk_img
        return None
