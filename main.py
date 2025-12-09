import tkinter as tk
from tkinter import messagebox, filedialog
import customtkinter as ctk

import io
import os
from pdf_builder import generate_pdf

# Set appearance and theme
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class FormulaApp:
    """
    Clase principal para la aplicación GUI de Generador de Fórmulas.

    Esta clase maneja la interfaz gráfica de usuario construida con CustomTkinter,
    permitiendo al usuario ingresar datos de fórmulas, previsualizarlos y generar un PDF.
    """
    def __init__(self, root):
        """
        Inicializa la aplicación y configura la interfaz gráfica.

        Args:
            root (ctk.CTk): La ventana raíz de la aplicación.
        """
        self.root = root
        self.root.title("Generador de Fórmulas Física PDF")
        self.root.geometry("900x700")

        # Configure grid layout for the root window
        self.root.grid_columnconfigure(0, weight=1)
        self.root.grid_rowconfigure(1, weight=1) # Text area expands

        # Instructions
        # Original: "Pegue aquí sus datos (Formato: Concepto;Fórmula;Variables;Unidades (SI)):"
        # Updated text to mention Markdown as well, but kept simple layout.
        instruction_text = "Pegue aquí sus datos (Formato: Concepto;Fórmula;Variables;Unidades (SI)) o use formato Markdown:"
        self.instr_label = ctk.CTkLabel(self.root, text=instruction_text, anchor="w", text_color="gray70")
        self.instr_label.grid(row=0, column=0, sticky="ew", padx=20, pady=(15, 5))

        # Text Area
        self.text_area = ctk.CTkTextbox(self.root, wrap="word", font=ctk.CTkFont(size=14))
        self.text_area.grid(row=1, column=0, sticky="nsew", padx=20, pady=5)

        # Load default data if exists
        self.load_default_data()

        # Buttons Frame
        self.btn_frame = ctk.CTkFrame(self.root, fg_color="transparent")
        self.btn_frame.grid(row=2, column=0, sticky="ew", padx=20, pady=20)

        # Generate Button
        self.generate_btn = ctk.CTkButton(self.btn_frame, text="Generar PDF", command=self.generate_pdf_action,
                                          font=ctk.CTkFont(size=15, weight="bold"), height=40)
        self.generate_btn.pack(side="right")
        
        # Clear Button
        self.clear_btn = ctk.CTkButton(self.btn_frame, text="Limpiar", command=self.clear_text,
                                       fg_color="transparent", border_width=2, text_color=("gray10", "#DCE4EE"), height=40)
        self.clear_btn.pack(side="left")

    def load_default_data(self):
        """
        Carga datos por defecto desde 'input_data.csv' en el área de texto si el archivo existe.

        Returns:
            None
        """
        if os.path.exists("input_data.csv"):
            try:
                with open("input_data.csv", "r", encoding="utf-8") as f:
                    content = f.read()
                    self.text_area.insert("1.0", content)
            except Exception as e:
                print(f"Could not load default data: {e}")

    def clear_text(self):
        """
        Borra todo el contenido del área de texto.

        Returns:
            None
        """
        self.text_area.delete("1.0", "end")

    def parse_input(self, text):
        """
        Analiza el texto de entrada y lo convierte en una lista estructurada de secciones.

        Soporta formato Markdown (con encabezados ### y tablas) y formato CSV heredado.

        Args:
            text (str): El texto crudo ingresado por el usuario.

        Returns:
            list: Una lista de diccionarios, donde cada diccionario representa una sección con el formato:
                  {'title': 'Nombre Sección', 'rows': [dict, dict, ...]}
                  Cada fila es un diccionario que mapea encabezados a valores.
        """
        text = text.strip()
        data = []
        
        # Check for Markdown headers indicating sections
        if "###" in text and "|" in text:
            # New format: Markdown sections + tables
            lines = text.split('\n')
            current_section = {'title': '', 'rows': []}
            headers = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith('###'):
                    # Save previous section if exists
                    if current_section['rows'] and headers:
                        # Convert rows (lists) to dicts
                        rows_as_dicts = [dict(zip(headers, r)) for r in current_section['rows']]
                        data.append({'title': current_section['title'], 'rows': rows_as_dicts})
                    
                    # Start new section
                    title = line.replace('###', '').strip()
                    current_section = {'title': title, 'rows': []}
                    headers = [] # Reset headers for new table
                
                elif line.startswith('|'):
                    # Table row
                    parts = [p.strip() for p in line.split('|')]
                    # Filter out empty strings from start/end if caused by | at edges
                    if len(parts) > 1 and parts[0] == '': parts.pop(0)
                    if len(parts) > 0 and parts[-1] == '': parts.pop(-1)
                    
                    if '---' in parts[0]: 
                        continue # Skip separator line
                    
                    if not headers:
                        headers = parts
                    else:
                        # Normalize row length to header length
                        if len(parts) < len(headers):
                            parts += [''] * (len(headers) - len(parts))
                        elif len(parts) > len(headers):
                            parts = parts[:len(headers)]
                        
                        current_section['rows'].append(parts)
            
            # Append last section
            if current_section['rows'] and headers:
                rows_as_dicts = [dict(zip(headers, r)) for r in current_section['rows']]
                data.append({'title': current_section['title'], 'rows': rows_as_dicts})
                
        else:
            # Legacy CSV format
            # Using ; as separator as established
            # Manually parse CSV
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
        """
        Manejador del evento del botón para generar el PDF.

        Obtiene el texto, lo analiza, solicita al usuario una ubicación de guardado
        y llama a la función de generación de PDF. Muestra cuadros de diálogo de éxito o error.

        Returns:
            None
        """
        content = self.text_area.get("1.0", "end").strip()
        if not content:
            messagebox.showwarning("Advertencia", "El área de texto está vacía.")
            return

        try:
            parsed_data = self.parse_input(content)
            
            if not parsed_data:
                 messagebox.showerror("Error", "No se pudo interpretar el formato de los datos.")
                 return

            # Ask user where to save
            file_path = filedialog.asksaveasfilename(
                defaultextension=".pdf",
                filetypes=[("PDF files", "*.pdf")],
                initialfile="formulas_fisica.pdf",
                title="Guardar PDF como"
            )

            if not file_path:
                return # User cancelled

            generate_pdf(parsed_data, file_path)
            messagebox.showinfo("Éxito", f"PDF generado correctamente en:\n{file_path}")

        except Exception as e:
            messagebox.showerror("Error", f"Ocurrió un error al generar el PDF:\n{str(e)}")

def main():
    """
    Punto de entrada principal para la aplicación.

    Inicializa el bucle principal de CustomTkinter.
    """
    root = ctk.CTk()
    app = FormulaApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
