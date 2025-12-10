import tkinter as tk
from tkinter import messagebox, filedialog
import customtkinter as ctk
from PIL import Image
import io
import os
import random
from pdf_builder import generate_pdf
from renderer import render_formula_to_image
from quiz_data import QUIZ_DATA

# Set appearance and theme
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

import sys

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

class PDFGeneratorView(ctk.CTkFrame):
    """
    Vista para la generación de PDFs. Contiene la lógica original de la aplicación.
    """
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)

        # Configure layout
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)

        # Instructions
        instruction_text = "Pegue aquí sus datos (Formato: Concepto;Fórmula;Variables;Unidades (SI)) o use formato Markdown:"
        self.instr_label = ctk.CTkLabel(self, text=instruction_text, anchor="w", text_color="gray70")
        self.instr_label.grid(row=0, column=0, sticky="ew", padx=20, pady=(15, 5))

        # Text Area
        self.text_area = ctk.CTkTextbox(self, wrap="word", font=ctk.CTkFont(size=14))
        self.text_area.grid(row=1, column=0, sticky="nsew", padx=20, pady=5)

        # Buttons Frame
        self.btn_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.btn_frame.grid(row=2, column=0, sticky="ew", padx=20, pady=20)

        # Generate Button
        self.generate_btn = ctk.CTkButton(self.btn_frame, text="Generar PDF", command=self.generate_pdf_action,
                                          font=ctk.CTkFont(size=15, weight="bold"), height=40)
        self.generate_btn.pack(side="right")
        
        # Clear Button
        self.clear_btn = ctk.CTkButton(self.btn_frame, text="Limpiar", command=self.clear_text,
                                       fg_color="transparent", border_width=2, text_color=("gray10", "#DCE4EE"), height=40)
        self.clear_btn.pack(side="left")

        # Load default data
        self.load_default_data()

    def load_default_data(self):
        file_path = resource_path("input_data.csv")
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    self.text_area.insert("1.0", content)
            except Exception as e:
                print(f"Could not load default data: {e}")

    def clear_text(self):
        self.text_area.delete("1.0", "end")

    def parse_input(self, text):
        # Same logic as before
        text = text.strip()
        data = []
        
        if "###" in text and "|" in text:
            lines = text.split('\n')
            current_section = {'title': '', 'rows': []}
            headers = []
            
            for line in lines:
                line = line.strip()
                if not line: continue
                
                if line.startswith('###'):
                    if current_section['rows'] and headers:
                        rows_as_dicts = [dict(zip(headers, r)) for r in current_section['rows']]
                        data.append({'title': current_section['title'], 'rows': rows_as_dicts})
                    title = line.replace('###', '').strip()
                    current_section = {'title': title, 'rows': []}
                    headers = []
                
                elif line.startswith('|'):
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) > 1 and parts[0] == '': parts.pop(0)
                    if len(parts) > 0 and parts[-1] == '': parts.pop(-1)
                    if '---' in parts[0]: continue
                    
                    if not headers:
                        headers = parts
                    else:
                        if len(parts) < len(headers):
                            parts += [''] * (len(headers) - len(parts))
                        elif len(parts) > len(headers):
                            parts = parts[:len(headers)]
                        current_section['rows'].append(parts)
            
            if current_section['rows'] and headers:
                rows_as_dicts = [dict(zip(headers, r)) for r in current_section['rows']]
                data.append({'title': current_section['title'], 'rows': rows_as_dicts})
                
        else:
            try:
                import csv
                f = io.StringIO(text)
                reader = csv.DictReader(f, delimiter=';')
                rows = list(reader)
                if rows:
                    data = [{'title': '', 'rows': rows}]
            except Exception as e:
                print(f"CSV Parsing error: {e}")
                pass

        return data

    def generate_pdf_action(self):
        content = self.text_area.get("1.0", "end").strip()
        if not content:
            messagebox.showwarning("Advertencia", "El área de texto está vacía.")
            return

        try:
            parsed_data = self.parse_input(content)
            if not parsed_data:
                 messagebox.showerror("Error", "No se pudo interpretar el formato de los datos.")
                 return

            file_path = filedialog.asksaveasfilename(
                defaultextension=".pdf",
                filetypes=[("PDF files", "*.pdf")],
                initialfile="formulas_fisica.pdf",
                title="Guardar PDF como"
            )

            if not file_path:
                return

            generate_pdf(parsed_data, file_path)
            messagebox.showinfo("Éxito", f"PDF generado correctamente en:\n{file_path}")

        except Exception as e:
            messagebox.showerror("Error", f"Ocurrió un error al generar el PDF:\n{str(e)}")


class QuizView(ctk.CTkFrame):
    """
    Vista para el Quiz de fórmulas.
    """
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)

        self.score = 0
        self.total_attempts = 0
        self.current_topic = "Cinemática en 2D" # Default
        self.current_question = None
        self.cached_images = {} # Cache rendered formula images

        # Layout
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(2, weight=1) # Buttons area expand

        # Header
        self.header_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.header_frame.grid(row=0, column=0, sticky="ew", padx=20, pady=10)

        self.title_label = ctk.CTkLabel(self.header_frame, text="Quiz de Física", font=ctk.CTkFont(size=20, weight="bold"))
        self.title_label.pack(side="left")

        self.score_label = ctk.CTkLabel(self.header_frame, text="Puntaje: 0/0", font=ctk.CTkFont(size=16))
        self.score_label.pack(side="right")

        # Question Area
        self.question_frame = ctk.CTkFrame(self, fg_color=("gray85", "gray17"))
        self.question_frame.grid(row=1, column=0, sticky="ew", padx=20, pady=10)

        self.q_label_title = ctk.CTkLabel(self.question_frame, text="Selecciona la fórmula correcta para:", text_color="gray")
        self.q_label_title.pack(pady=(10,0))

        self.concept_label = ctk.CTkLabel(self.question_frame, text="...", font=ctk.CTkFont(size=22, weight="bold"))
        self.concept_label.pack(pady=10)

        # Answers Area
        self.answers_frame = ctk.CTkFrame(self, fg_color="transparent")
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
        self.feedback_label = ctk.CTkLabel(self, text="", font=ctk.CTkFont(size=16, weight="bold"))
        self.feedback_label.grid(row=3, column=0, pady=10)

        # Next Button
        self.next_btn = ctk.CTkButton(self, text="Siguiente Pregunta", command=self.load_question, state="disabled")
        self.next_btn.grid(row=4, column=0, pady=20)

        # Start first question
        self.load_question()

    def get_formula_image(self, latex):
        if latex in self.cached_images:
            return self.cached_images[latex]

        # Render
        # Increased fontsize and scale to make formulas bigger within the button
        buf = render_formula_to_image(latex, fontsize=28, dpi=100, text_color='white')
        if buf:
            pil_img = Image.open(buf)
            # Create CTkImage
            # We scale it slightly for better visibility
            w, h = pil_img.size
            scale = 0.9 # Reduce huge dpi size to UI size
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
        data = QUIZ_DATA.get(self.current_topic, [])
        if not data:
            self.concept_label.configure(text="No hay datos disponibles.")
            return

        # Pick correct answer
        self.target = random.choice(data)
        self.concept_label.configure(text=self.target['concepto'])

        # Pick 3 distractors
        distractors = [d for d in data if d != self.target]
        if len(distractors) < 3:
            # Not enough data for unique distractors, duplicate allows
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


class FormulaApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Generador de Fórmulas Física PDF")
        self.root.geometry("1100x700")

        # Layout: 2 Columns
        # Col 0: Sidebar (Small width), Col 1: Main Content (Expanded)
        self.root.grid_columnconfigure(1, weight=1)
        self.root.grid_rowconfigure(0, weight=1)

        # --- Sidebar ---
        self.sidebar_frame = ctk.CTkFrame(self.root, width=200, corner_radius=0)
        self.sidebar_frame.grid(row=0, column=0, sticky="nsew")
        self.sidebar_frame.grid_rowconfigure(4, weight=1)

        self.logo_label = ctk.CTkLabel(self.sidebar_frame, text="Menú", font=ctk.CTkFont(size=20, weight="bold"))
        self.logo_label.grid(row=0, column=0, padx=20, pady=(20, 10))

        self.btn_gen = ctk.CTkButton(self.sidebar_frame, text="Generador PDF", command=self.show_generator_view)
        self.btn_gen.grid(row=1, column=0, padx=20, pady=10)

        self.btn_quiz = ctk.CTkButton(self.sidebar_frame, text="Quiz / Estudio", command=self.show_quiz_view)
        self.btn_quiz.grid(row=2, column=0, padx=20, pady=10)

        # --- Sidebar Toggle Button (Floating) ---
        # Placed in the main area top-left or sidebar top-right?
        # User asked for "like this page", so sidebar on left, button to toggle it.
        # We can put a small button on top-left of Main Frame to toggle Sidebar visibility.

        # --- Main Content Area ---
        self.main_frame = ctk.CTkFrame(self.root, corner_radius=0, fg_color="transparent")
        self.main_frame.grid(row=0, column=1, sticky="nsew")
        self.main_frame.grid_rowconfigure(0, weight=1) # Header/Toggle
        self.main_frame.grid_rowconfigure(1, weight=10) # Content
        self.main_frame.grid_columnconfigure(0, weight=1)

        # Toggle Button Area
        self.top_bar = ctk.CTkFrame(self.main_frame, height=40, fg_color="transparent")
        self.top_bar.grid(row=0, column=0, sticky="ew", padx=10, pady=5)

        self.toggle_btn = ctk.CTkButton(self.top_bar, text="☰", width=40, command=self.toggle_sidebar)
        self.toggle_btn.pack(side="left")

        # Content Container
        self.content_container = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        self.content_container.grid(row=1, column=0, sticky="nsew")
        self.content_container.grid_columnconfigure(0, weight=1)
        self.content_container.grid_rowconfigure(0, weight=1)

        # Views
        self.views = {}
        self.views["generator"] = PDFGeneratorView(self.content_container)
        self.views["quiz"] = QuizView(self.content_container)

        # Show default
        self.show_generator_view()
        self.sidebar_visible = True

    def show_view(self, name):
        # Hide all
        for view in self.views.values():
            view.grid_forget()

        # Show selected
        self.views[name].grid(row=0, column=0, sticky="nsew")

    def show_generator_view(self):
        self.show_view("generator")

    def show_quiz_view(self):
        self.show_view("quiz")

    def toggle_sidebar(self):
        if self.sidebar_visible:
            self.sidebar_frame.grid_forget()
            self.sidebar_visible = False
        else:
            self.sidebar_frame.grid(row=0, column=0, sticky="nsew")
            self.sidebar_visible = True

def main():
    root = ctk.CTk()
    app = FormulaApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
