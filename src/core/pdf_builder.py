from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Image as RLImage, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from .renderer import render_formula_to_image
import io
import html

def notna(val):
    """
    Verifica si un valor no es nulo, vacío o "nan" (Not a Number).

    Args:
        val (any): El valor a verificar. Puede ser de cualquier tipo, pero se convierte a cadena para la verificación.

    Returns:
        bool: True si el valor es válido (no es None, cadena vacía o "nan"), False en caso contrario.
    """
    return val is not None and str(val).strip() != "" and str(val).lower() != "nan"

def generate_pdf(data_frame_or_sections, output_filename="formulas.pdf"):
    """
    Genera un archivo PDF con tablas de fórmulas físicas a partir de los datos proporcionados.

    Esta función toma una estructura de datos (lista de diccionarios o secciones) y crea un documento PDF
    que contiene tablas formateadas con conceptos, fórmulas (renderizadas como imágenes), variables y unidades.

    Args:
        data_frame_or_sections (list): Una lista de diccionarios que representa las secciones y filas de datos.
            El formato esperado es: [{'title': 'Nombre Sección', 'rows': [dict, ...]}, ...].
            También acepta una lista plana de diccionarios (filas) que se tratarán como una única sección sin título.
        output_filename (str, opcional): La ruta y nombre del archivo PDF de salida. Por defecto es "formulas.pdf".

    Returns:
        None: La función no retorna ningún valor, pero genera un archivo en el sistema de archivos.
    """
    doc = SimpleDocTemplate(output_filename, pagesize=landscape(letter))
    elements = []
    
    styles = getSampleStyleSheet()
    # Create a custom style for wrapping text in cells
    cell_style = ParagraphStyle(
        'CellStyle',
        parent=styles['Normal'],
        fontSize=10,
        leading=12
    )

    h1_style = styles['Heading1']
    h1_style.alignment = 1 # Center

    # Normalize input to list of sections
    if isinstance(data_frame_or_sections, list) and len(data_frame_or_sections) > 0:
        if 'rows' not in data_frame_or_sections[0] and 'title' not in data_frame_or_sections[0]:
             # Legacy support for just a list of rows? Or assume it's the new format
             # If it was a dataframe passed, we can't handle it anymore without pandas.
             # But we assume the caller is main.py which is updated.
             # If it's a list of dicts (flat), wrap it
             if isinstance(data_frame_or_sections[0], dict):
                  sections = [{'title': '', 'rows': data_frame_or_sections}]
             else:
                  sections = data_frame_or_sections
        else:
             sections = data_frame_or_sections
    else:
        # Fallback empty
        sections = []

    headers = ["Concepto", "Fórmula", "Variables", "Unidades (SI)"]
    
    # Define Column Widths
    col_widths = [1.5*inch, 2.5*inch, 4.0*inch, 1.5*inch]

    table_style = TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.grey),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),  # Default alignment
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'), # Vertical alignment
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('BACKGROUND', (0,1), (-1,-1), colors.beige),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ])

    # Common regex patterns for LaTeX replacements
    import re
    def clean_latex(text):
        """
        Limpia y formatea una cadena de texto LaTeX para su visualización en HTML/ReportLab.

        Realiza reemplazos de símbolos comunes y etiquetas LaTeX por sus equivalentes Unicode o HTML.

        Args:
            text (str): El texto a limpiar.

        Returns:
            str: El texto limpio y formateado.
        """
        if not isinstance(text, str): return str(text)
        # Simple replacements for Greek and symbols
        replacements = {
            r'\\pi': 'π',
            r'\\theta': 'θ',
            r'\\omega': 'ω',
            r'\\Delta': 'Δ',
            r'\\alpha': 'α',
            r'\\mu': 'μ',
            r'\\tau': 'τ',
            r'\\times': '×',
            r'\\approx': '≈',
            r'\\circ': '°',
            r'\\infty': '∞',
            r'\\pm': '±',
            r'\\rightarrow': '→',
            r'\\vec': '', # Remove vec command, maybe keep letter
        }
        for latex, char in replacements.items():
            text = re.sub(latex, char, text)
        
        # Handle superscripts x^2 -> x<sup>2</sup>
        text = re.sub(r'\^(\d+)', r'<sup>\1</sup>', text)
        text = re.sub(r'\^\{([^\}]+)\}', r'<sup>\1</sup>', text)
        
        # Handle subscripts x_0 -> x<sub>0</sub>
        text = re.sub(r'_(\d+|[a-z])', r'<sub>\1</sub>', text)
        text = re.sub(r'_\{([^\}]+)\}', r'<sub>\1</sub>', text)

        # Remove remaining $ signs
        text = text.replace('$', '')
        
        # Clean up empty braces {} if any
        text = text.replace('{}', '')
        
        return text

    for i, section in enumerate(sections):
        title = section.get('title', '')
        rows = section.get('rows', []) # Changed from df to rows
        
        if title:
            elements.append(Paragraph(html.escape(title), h1_style))
            elements.append(Spacer(1, 12))

        table_data = [headers]

        for row in rows:
            # Determine formula content first
            formula_latex = row.get('Fórmula Simbólica', row.get('Fórmula', row.get('Formula Simbólica', '')))
            
            # Render Formula
            img_buffer = render_formula_to_image(formula_latex, fontsize=14, dpi=200)
            
            formula_cell = ""
            if img_buffer:
                # Create ReportLab Image from buffer
                img = RLImage(img_buffer)
                # Aspect ratio
                aspect = img.imageWidth / img.imageHeight
                display_height = 40 
                display_width = display_height * aspect
                img.drawHeight = display_height
                img.drawWidth = display_width
                formula_cell = img
            else:
                formula_cell = str(formula_latex) # Fallback

            # Wrap text content
            def to_paragraph(text, pre_escaped=False):
                """
                Convierte texto en un objeto Paragraph de ReportLab.

                Args:
                    text (str): El texto a convertir.
                    pre_escaped (bool): Indica si el texto ya ha sido escapado para HTML.

                Returns:
                    Paragraph: El objeto Paragraph formateado.
                """
                if not text: return Paragraph("", cell_style)
                
                txt_str = str(text)

                if pre_escaped:
                    safe_text = txt_str
                else:
                    safe_text = html.escape(txt_str)
                
                safe_text = clean_latex(safe_text)
                safe_text = safe_text.replace('\n', '<br/>')
                
                return Paragraph(safe_text, cell_style)

            # Handle safe access to columns
            # Concepto
            val_concepto = row.get('Nombre', row.get('Concepto', ''))
            
            # Variables / Description
            val_vars = row.get('Variables', '')
            is_constructed = False
            if not val_vars:
                # Construct from new columns
                parts = []
                
                # Formula en Texto
                txt_formula = row.get('Fórmula en Texto') or row.get('Formula en Texto')
                if notna(txt_formula):
                    # Escape content before adding markup
                    safe_formula = html.escape(str(txt_formula))
                    parts.append(f"<b>Fórmula:</b> {safe_formula}")
                
                # Dato Relevante
                dato = row.get('Dato Relevante / Uso')
                if notna(dato):
                    # Escape content before adding markup
                    safe_dato = html.escape(str(dato))
                    parts.append(f"<b>Uso:</b> {safe_dato}")
                
                val_vars = "\n".join(parts)
                is_constructed = True
            
            # Units
            val_units = row.get('Unidad (SI)', row.get('Unidades (SI)', row.get('Simbolo', '')))

            row_data = [
                to_paragraph(val_concepto),
                formula_cell,
                to_paragraph(val_vars, pre_escaped=is_constructed),
                to_paragraph(val_units)
            ]
            table_data.append(row_data)

        table = Table(table_data, colWidths=col_widths, repeatRows=1)
        table.setStyle(table_style)
        elements.append(table)
        elements.append(Spacer(1, 24)) # Space between sections

    doc.build(elements)
    print(f"PDF generated: {output_filename}")
