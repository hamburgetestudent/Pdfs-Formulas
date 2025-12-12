import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io

def render_formula_to_image(latex_string, fontsize=12, dpi=300, text_color='black'):
    """
    Renderiza una cadena LaTeX en una imagen PNG en memoria.

    Esta función utiliza matplotlib para convertir una fórmula matemática descrita en LaTeX
    en una imagen PNG con fondo transparente. La imagen se guarda en un buffer en memoria.

    Args:
        latex_string (str): La cadena que contiene la fórmula en formato LaTeX.
        fontsize (int, opcional): El tamaño de fuente para la fórmula. Por defecto es 12.
        dpi (int, opcional): Los puntos por pulgada (resolución) de la imagen generada. Por defecto es 300.
        text_color (str, opcional): Color del texto. Por defecto 'black'.

    Returns:
        io.BytesIO: Un buffer de bytes que contiene la imagen PNG generada, o None si ocurre un error durante el renderizado.
    """
    try:
        # Create a figure and axis
        fig = plt.figure(figsize=(0.1, 0.1)) # Tiny figure, will be resized
        
        # Add text - we use matchfont to ensure it looks like math
        # We wrap it in $...$ if it's not already
        print(f"Rendering: {latex_string}")
        text_content = f"${latex_string}$" if not latex_string.startswith("$") else latex_string
        
        # Place text at (0,0) - we'll just extract the bbox later or let savefig handle it
        # Actually simplest way is to turn off axis and save the text
        fig.text(0.5, 0.5, text_content, fontsize=fontsize, ha='center', va='center', color=text_color)
        
        # Hide axis
        plt.axis('off')
        
        # Save to buffer
        buf = io.BytesIO()
        
        # Use bbox_inches='tight' and pad_inches=0 to crop closely to the text
        plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1, dpi=dpi, transparent=True)
        plt.close(fig)
        
        buf.seek(0)
        return buf
    except Exception as e:
        print(f"Error rendering formula '{latex_string}': {e}")
        return None
