import tkinter as tk
from tkinter import scrolledtext, messagebox, filedialog
import pandas as pd
import io
import os
from pdf_builder import generate_pdf

class FormulaApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Generador de Fórmulas Física PDF")
        self.root.geometry("800x600")

        # Instructions
        instruction_text = "Pegue aquí sus datos (Formato: Concepto;Fórmula;Variables;Unidades (SI)):"
        tk.Label(self.root, text=instruction_text, anchor="w").pack(fill="x", padx=10, pady=5)

        # Text Area
        self.text_area = scrolledtext.ScrolledText(self.root, wrap=tk.WORD, height=20)
        self.text_area.pack(fill="both", expand=True, padx=10, pady=5)

        # Load default data if exists
        self.load_default_data()

        # Buttons Frame
        btn_frame = tk.Frame(self.root)
        btn_frame.pack(fill="x", padx=10, pady=10)

        # Generate Button
        self.generate_btn = tk.Button(btn_frame, text="Generar PDF", command=self.generate_pdf_action, bg="#4CAF50", fg="white", font=("Arial", 12, "bold"))
        self.generate_btn.pack(side="right")
        
        # Clear Button
        self.clear_btn = tk.Button(btn_frame, text="Limpiar", command=lambda: self.text_area.delete("1.0", tk.END))
        self.clear_btn.pack(side="left")

    def load_default_data(self):
        if os.path.exists("input_data.csv"):
            try:
                with open("input_data.csv", "r", encoding="utf-8") as f:
                    content = f.read()
                    self.text_area.insert("1.0", content)
            except Exception as e:
                print(f"Could not load default data: {e}")

    def parse_input(self, text):
        """
        Parses text input into either a DataFrame (legacy) or list of sections.
        """
        text = text.strip()
        data = []
        
        # Check for Markdown headers indicating sections
        if "###" in text and "|" in text:
            # New format: Markdown sections + tables
            # Split by lines
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
                        df = pd.DataFrame(current_section['rows'], columns=headers)
                        data.append({'title': current_section['title'], 'df': df})
                    
                    # Start new section
                    title = line.replace('###', '').strip()
                    current_section = {'title': title, 'rows': []}
                    headers = [] # Reset headers for new table
                
                elif line.startswith('|'):
                    # Table row
                    # Split by | and remove first/last empty strings
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
                        if len(parts) == len(headers):
                            current_section['rows'].append(parts)
                        else:
                            # Handle mismatch if reasonable, or ignore/warn
                            # For now try to fit
                             if len(parts) < len(headers):
                                 parts += [''] * (len(headers) - len(parts))
                             elif len(parts) > len(headers):
                                 parts = parts[:len(headers)]
                             current_section['rows'].append(parts)
            
            # Append last section
            if current_section['rows'] and headers:
                df = pd.DataFrame(current_section['rows'], columns=headers)
                data.append({'title': current_section['title'], 'df': df})
                
            if not data:
                # Fallback if parsing failed but looked like markdown
                # Maybe just one table without header?
                pass
                
        else:
            # Legacy CSV format
            # Using ; as separator as established
            try:
                df = pd.read_csv(io.StringIO(text), sep=";")
                data = df # Return simple DF
            except:
                pass

        return data

    def generate_pdf_action(self):
        content = self.text_area.get("1.0", tk.END).strip()
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
    root = tk.Tk()
    app = FormulaApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
