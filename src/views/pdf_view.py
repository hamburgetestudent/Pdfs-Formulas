import customtkinter as ctk
from tkinter import messagebox, filedialog
import os
import io
from pdf_builder import generate_pdf
from utils import get_external_path, resource_path

class PDFGeneratorView(ctk.CTkFrame):
    """
    Vista para la generación de PDFs.
    """
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)

        # Configure layout
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)

        # Title
        self.title_label = ctk.CTkLabel(self, text="Generador de PDF", font=ctk.CTkFont(size=24, weight="bold"))
        self.title_label.grid(row=0, column=0, sticky="w", padx=20, pady=(20, 10))

        # Instructions
        instruction_text = "Pegue aquí sus datos (Formato: Concepto;Fórmula;Variables;Unidades (SI)) o use formato Markdown:"
        self.instr_label = ctk.CTkLabel(self, text=instruction_text, anchor="w", text_color="#D1D5DB", font=ctk.CTkFont(size=14))
        self.instr_label.grid(row=1, column=0, sticky="ew", padx=20, pady=(0, 5))

        # Text Area
        self.text_area = ctk.CTkTextbox(
            self,
            wrap="word",
            font=ctk.CTkFont(size=14),
            corner_radius=10,
            border_width=1,
            fg_color="#1F2937", # gray-800
            text_color="white",
            border_color="#374151" # gray-700
        )
        self.text_area.grid(row=2, column=0, sticky="nsew", padx=20, pady=5)

        # Buttons Frame
        self.btn_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.btn_frame.grid(row=3, column=0, sticky="ew", padx=20, pady=20)

        # Generate Button
        self.generate_btn = ctk.CTkButton(
            self.btn_frame,
            text="Generar PDF",
            command=self.generate_pdf_action,
            font=ctk.CTkFont(size=15, weight="bold"),
            height=45, width=150,
            fg_color="#3B82F6", # blue-500
            hover_color="#2563EB", # blue-600
            text_color="white"
        )
        self.generate_btn.pack(side="right")

        # Clear Button
        self.clear_btn = ctk.CTkButton(
            self.btn_frame,
            text="Limpiar",
            command=self.clear_text,
            font=ctk.CTkFont(size=15),
            fg_color="transparent",
            border_width=1,
            border_color="#374151",
            text_color="#9CA3AF",
            hover_color="#374151",
            height=45, width=120
        )
        self.clear_btn.pack(side="left")

        # Load default data
        self.load_default_data()

    def load_default_data(self):
        # 1. Try external file (next to exe)
        external_path = get_external_path(os.path.join("data", "input_data.csv"))
        file_path = external_path if os.path.exists(external_path) else resource_path(os.path.join("data", "input_data.csv"))

        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    self.text_area.insert("1.0", content)
            except Exception as e:
                print(f"Could not load default data from {file_path}: {e}")

    def clear_text(self):
        self.text_area.delete("1.0", "end")

    def parse_input(self, text):
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
