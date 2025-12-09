from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Image as RLImage, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from renderer import render_formula_to_image
import io

def generate_pdf(data_frame, output_filename="formulas.pdf"):
    """
    Generates a PDF from a pandas DataFrame containing formula data.
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

    # Headers
    headers = ["Concepto", "Fórmula", "Variables", "Unidades (SI)"]
    table_data = [headers]

    for index, row in data_frame.iterrows():
        # Render Formula
        formula_latex = row['Fórmula']
        img_buffer = render_formula_to_image(formula_latex, fontsize=14, dpi=200)
        
        formula_cell = ""
        if img_buffer:
            # Create ReportLab Image from buffer
            # We need to determine a reasonable size. 
            # For now, let's just keep aspect ratio but limit height.
            img = RLImage(img_buffer)
            # Resize logic if needed, e.g. strictly constrain height to 50px
            # Calculate aspect ratio
            aspect = img.imageWidth / img.imageHeight
            display_height = 40 
            display_width = display_height * aspect
            img.drawHeight = display_height
            img.drawWidth = display_width
            formula_cell = img
        else:
            formula_cell = str(formula_latex) # Fallback to text

        # Wrap text content in Paragraphs for word wrapping
        def to_paragraph(text):
            return Paragraph(str(text), cell_style)

        row_data = [
            to_paragraph(row['Concepto']),
            formula_cell,
            to_paragraph(row['Variables']),
            to_paragraph(row['Unidades (SI)'])
        ]
        table_data.append(row_data)

    # Define Column Widths
    # Total width of landscape letter is ~11 inch. Margins are usually 1 inch each side?
    # actually SimpleDocTemplate defaults.
    # Let's specify explicitly.
    col_widths = [1.5*inch, 2.5*inch, 4.0*inch, 1.5*inch]

    table = Table(table_data, colWidths=col_widths)
    
    # Add Style
    style = TableStyle([
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
    table.setStyle(style)

    elements.append(table)
    doc.build(elements)
    print(f"PDF generated: {output_filename}")
