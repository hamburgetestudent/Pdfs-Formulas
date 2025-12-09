
from pdf_builder import generate_pdf
import os

# Sample data mimicking what the parser produces
data = [
    {
        'title': 'Test Section',
        'rows': [
            {
                'Concepto': 'Velocity',
                'Fórmula': 'v = d/t',
                'Fórmula Simbólica': r'v = \frac{d}{t}',
                'Variables': '',
                'Unidades (SI)': 'm/s',
                'Fórmula en Texto': 'Velocidad igual a distancia sobre tiempo',
                'Dato Relevante / Uso': 'Uso para calcular velocidad constante'
            }
        ]
    }
]

print("Attempting to generate PDF...")
try:
    generate_pdf(data, "test_output.pdf")
    print("PDF generated successfully.")
except Exception as e:
    print(f"CRASH CAUGHT: {e}")
    import traceback
    traceback.print_exc()

# Also test renderer explicitly
from renderer import render_formula_to_image
print("\nTesting renderer...")
try:
    img = render_formula_to_image(r"E = mc^2")
    if img:
        print("Renderer works.")
    else:
        print("Renderer returned None (failed gracefully).")
except Exception as e:
    print(f"RENDERER CRASH: {e}")
    import traceback
    traceback.print_exc()
