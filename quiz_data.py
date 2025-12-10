
# Datos de fórmulas para el Quiz
# Formato: Lista de diccionarios con 'concepto' y 'formula' (LaTeX)

QUIZ_DATA = {
    "Cinemática en 2D": [
        {
            "concepto": "Vector de Posición",
            "formula": r"\vec{r} = x\hat{i} + y\hat{j}"
        },
        {
            "concepto": "Vector Desplazamiento",
            "formula": r"\Delta \vec{r} = \vec{r}_f - \vec{r}_i"
        },
        {
            "concepto": "Velocidad Media",
            "formula": r"\vec{v}_{avg} = \frac{\Delta \vec{r}}{\Delta t}"
        },
        {
            "concepto": "Velocidad Instantánea",
            "formula": r"\vec{v} = \frac{d\vec{r}}{dt}"
        },
        {
            "concepto": "Aceleración Media",
            "formula": r"\vec{a}_{avg} = \frac{\Delta \vec{v}}{\Delta t}"
        },
        {
            "concepto": "Aceleración Instantánea",
            "formula": r"\vec{a} = \frac{d\vec{v}}{dt}"
        },
        {
            "concepto": "Movimiento de Proyectiles: Posición Horizontal",
            "formula": r"x(t) = x_0 + (v_0 \cos \theta_0) t"
        },
        {
            "concepto": "Movimiento de Proyectiles: Posición Vertical",
            "formula": r"y(t) = y_0 + (v_0 \sin \theta_0) t - \frac{1}{2}g t^2"
        },
        {
            "concepto": "Movimiento de Proyectiles: Velocidad Horizontal",
            "formula": r"v_x = v_0 \cos \theta_0"
        },
        {
            "concepto": "Movimiento de Proyectiles: Velocidad Vertical",
            "formula": r"v_y = v_0 \sin \theta_0 - gt"
        },
        {
            "concepto": "Ecuación de Trayectoria (Proyectiles)",
            "formula": r"y = (\tan \theta_0)x - \frac{g}{2(v_0 \cos \theta_0)^2}x^2"
        },
        {
            "concepto": "Alcance Horizontal Máximo (R)",
            "formula": r"R = \frac{v_0^2 \sin 2\theta_0}{g}"
        },
        {
            "concepto": "Altura Máxima (H)",
            "formula": r"H = \frac{(v_0 \sin \theta_0)^2}{2g}"
        },
        {
            "concepto": "Aceleración Centripeta (Circular Uniforme)",
            "formula": r"a_c = \frac{v^2}{r}"
        },
        {
            "concepto": "Periodo (Circular Uniforme)",
            "formula": r"T = \frac{2\pi r}{v}"
        }
    ]
}
