
import main
import tkinter as tk
from pdf_builder import generate_pdf
import os

def create_pdf():
    # Input provided by user
    input_text = r"""Aqui tienes las fórmulas de la materia **Física Mecánica (Física I)**, organizadas por unidades temáticas según las fuentes proporcionadas.

### I. Cinemática (Movimiento en 2D y Circular)

Esta unidad cubre la descripción del movimiento sin atender a sus causas, incluyendo proyectiles y rotación uniforme o acelerada.

| Nombre | Símbolo | Unidad (SI) | Fórmula Simbólica | Fórmula en Texto | Dato Relevante / Uso |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Posición Angular** | $\theta$ | rad | $\theta = \frac{s}{r}$ | Ángulo = Arco / Radio | Describe la posición en una trayectoria circular. |
| **Velocidad Angular Media** | $\omega$ | rad/s | $\omega = \frac{\Delta \theta}{\Delta t}$ | Vel. Angular = Desplazamiento Angular / Tiempo | Rapidez de cambio de ángulo. |
| **Velocidad Tangencial** | $v$ | m/s | $v = \omega r$ | Vel. Lineal = Vel. Angular $\times$ Radio | Relación entre movimiento lineal y rotacional. |
| **Aceleración Centrípeta** | $a_c$ | $m/s^2$ | $a_c = \frac{v^2}{r} = \omega^2 r$ | Acel. Centrípeta = Vel. Lineal$^2$ / Radio | Apunta al centro; cambia la dirección de la velocidad. |
| **Periodo** | $T$ | s | $T = \frac{2\pi}{\omega} = \frac{1}{f}$ | Periodo = $2\pi$ / Vel. Angular | Tiempo en dar una vuelta completa. |
| **Frecuencia** | $f$ | Hz | $f = \frac{1}{T}$ | Frecuencia = 1 / Periodo | Número de vueltas por segundo. |
| **Posición (MCUA)** | $\theta$ | rad | $\theta_f = \theta_0 + \omega_0 t + \frac{1}{2}\alpha t^2$ | Posición = Pos. Inicial + Vel. Inicial$\times$t + $\frac{1}{2}$Acel.$\times t^2$ | Para movimiento circular con aceleración angular constante. |
| **Velocidad Angular (MCUA)** | $\omega_f$ | rad/s | $\omega_f = \omega_0 + \alpha t$ | Vel. Final = Vel. Inicial + Acel. Angular $\times$ Tiempo | Calcula la velocidad angular tras un tiempo $t$. |
| **Relación de Transmisión** | - | - | $f_A d_A = f_B d_B$ | Frecuencia A $\times$ Dientes A = Frecuencia B $\times$ Dientes B | Usada en engranajes. |
| **Altura Máxima (Proyectil)** | $h_{max}$ | m | $h = \frac{v_{0y}^2}{2g}$ | Altura = (Vel. Vertical Inicial)$^2$ / (2 $\times$ Gravedad) | Punto más alto en lanzamiento parabólico. |
| **Alcance Horizontal** | $R$ | m | $R = \frac{v_0^2 \sin(2\theta)}{g}$ | Alcance = (Vel. Inicial$^2$ $\times$ Seno del ángulo doble) / Gravedad | Distancia máxima horizontal al volver a la misma altura. |

---

### II. Dinámica (Leyes de Newton y Gravitación)

Estudia las fuerzas como causa del movimiento, incluyendo fricción, resortes y gravedad.

| Nombre | Símbolo | Unidad (SI) | Fórmula Simbólica | Fórmula en Texto | Dato Relevante / Uso |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **2da Ley de Newton** | $\vec{F}$ | N | $\sum \vec{F} = m\vec{a}$ | Fuerza Neta = Masa $\times$ Aceleración | Relación fundamental entre fuerza y movimiento. |
| **Peso** | $P$ o $w$ | N | $P = mg$ | Peso = Masa $\times$ Gravedad | Fuerza gravitacional sobre un objeto cerca de la superficie. |
| **Fuerza de Roce** | $f_r$ | N | $f_r = \mu N$ | Roce = Coeficiente ($\mu$) $\times$ Normal | Se opone al movimiento (estático o cinético). |
| **Ley de Hooke (Muelle)** | $F_e$ | N | $F = -k \Delta x$ | Fuerza = -Constante $k$ $\times$ Deformación | Fuerza restauradora en resortes. |
| **Constante Muelle Serie** | $k_{eq}$ | N/m | $\frac{1}{k_{eq}} = \frac{1}{k_1} + \frac{1}{k_2}$ | Inverso $k$ eq = Suma de inversos de $k$ | Suma de resortes conectados uno tras otro. |
| **Fuerza Centrípeta** | $F_c$ | N | $F_c = m \frac{v^2}{R}$ | Fuerza = Masa $\times$ (Velocidad$^2$ / Radio) | Fuerza neta necesaria para curvar una trayectoria. |
| **Velocidad Máxima Curva** | $v$ | m/s | $v = \sqrt{\mu g R}$ | Velocidad = Raíz(Coef. Roce $\times$ Gravedad $\times$ Radio) | Velocidad límite para no derrapar en curva plana. |
| **Velocidad Péndulo Cónico** | $v$ | m/s | $v = \sqrt{Lg \sin\alpha \tan\alpha}$ | Vel = Raíz(Largo $\times$ g $\times$ sen$\alpha$ $\times$ tan$\alpha$) | Para masa girando suspendida de una cuerda. |
| **Ley Gravitación Universal** | $F_g$ | N | $F = G \frac{m_1 m_2}{r^2}$ | Fuerza = $G$ $\times$ (Producto masas / Distancia$^2$) | Atracción entre dos cuerpos cualesquiera. |
| **Aceleración Gravedad** | $g$ | $m/s^2$ | $g = G \frac{M_T}{(R_T+h)^2}$ | Gravedad = $G$ $\times$ Masa Tierra / (Radio + altura)$^2$ | Gravedad a una altura $h$ de la superficie. |

---

### III. Trabajo, Energía y Potencia

Analiza el movimiento desde una perspectiva escalar de transferencia y conservación de energía.

| Nombre | Símbolo | Unidad (SI) | Fórmula Simbólica | Fórmula en Texto | Dato Relevante / Uso |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Trabajo Mecánico** | $W$ | J | $W = F d \cos\theta$ | Trabajo = Fuerza $\times$ Distancia $\times$ Coseno ángulo | Solo la componente paralela al desplazamiento hace trabajo. |
| **Teorema Trabajo-Energía** | $W_{net}$ | J | $W_{neto} = \Delta K$ | Trabajo Neto = Energía Cinética Final - Inicial | El trabajo total modifica la velocidad. |
| **Energía Cinética** | $K$ o $E_c$ | J | $K = \frac{1}{2}mv^2$ | E. Cinética = $\frac{1}{2}$ $\times$ Masa $\times$ Velocidad$^2$ | Energía asociada al movimiento. |
| **E. Potencial Gravitatoria** | $U_g$ | J | $U_g = mgh$ | E. Potencial = Masa $\times$ Gravedad $\times$ Altura | Energía por posición vertical. |
| **E. Potencial Elástica** | $U_e$ | J | $U_e = \frac{1}{2}kx^2$ | E. Elástica = $\frac{1}{2}$ $\times$ Constante $k$ $\times$ Deformación$^2$ | Energía almacenada en un resorte. |
| **Conservación Energía** | $E$ | J | $E_i + W_{nc} = E_f$ | E. Inicial + Trabajo No Conservativo = E. Final | Si no hay fricción ($W_{nc}=0$), la energía mecánica se conserva. |
| **Potencia Media** | $P$ | W | $P = \frac{W}{\Delta t}$ | Potencia = Trabajo / Tiempo | Rapidez con la que se efectúa trabajo. |
| **Potencia Instantánea** | $P$ | W | $P = F v$ | Potencia = Fuerza $\times$ Velocidad | Potencia en un instante específico. |
| **Equivalencia HP** | hp | - | $1 \text{ hp} = 746 \text{ W}$ | 1 Horsepower = 746 Watts | Conversión de unidades de potencia. |

---

### IV. Sistema de Partículas y Momentum Lineal

Extiende la dinámica a sistemas de cuerpos y colisiones.

| Nombre | Símbolo | Unidad (SI) | Fórmula Simbólica | Fórmula en Texto | Dato Relevante / Uso |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Centro de Masa (Discreto)** | $r_{cm}$ | m | $r_{cm} = \frac{\sum m_i r_i}{M}$ | Posición CM = Suma (Masa$_i$ $\times$ Posición$_i$) / Masa Total | Punto promedio ponderado de masa. |
| **Centro de Masa (Continuo)** | $r_{cm}$ | m | $r_{cm} = \frac{1}{M} \int r dm$ | Posición CM = (1/Masa Total) $\times$ Integral de posición respecto a masa | Para objetos sólidos; usa integrales. |
| **Momentum Lineal** | $\vec{p}$ | kg·m/s | $\vec{p} = m\vec{v}$ | Momentum = Masa $\times$ Velocidad | Cantidad de movimiento o inercia en movimiento. |
| **Relación K - p** | $K$ | J | $K = \frac{p^2}{2m}$ | E. Cinética = Momentum$^2$ / (2 $\times$ Masa) | Relación entre energía y momentum. |
| **Impulso** | $\vec{I}$ | N·s | $\vec{I} = \vec{F} \Delta t$ | Impulso = Fuerza $\times$ Intervalo de tiempo | Cambio en el momentum producido por una fuerza. |
| **Teorema Impulso** | $\vec{I}$ | N·s | $\vec{I} = \Delta \vec{p} = p_f - p_i$ | Impulso = Momentum Final - Momentum Inicial | Relaciona fuerza externa con cambio de movimiento. |
| **Conservación Momentum** | $\vec{P}$ | kg·m/s | $\vec{p}_i = \vec{p}_f$ | Momentum Total Inicial = Momentum Total Final | Se cumple si la fuerza externa neta es cero (ej. choques). |
| **Coeficiente Restitución** | $e$ | - | $e = - \frac{v_{2f}-v_{1f}}{v_{2i}-v_{1i}}$ | $e$ = - (Vel. Relativa Final / Vel. Relativa Inicial) | $e=1$ (Elástico), $0<e<1$ (Inelástico), $e=0$ (Plástico). |
| **Péndulo Balístico** | $v$ | m/s | $v_{bala} = \frac{m+M}{m} \sqrt{2gh}$ | Vel. Bala = (Relación Masas) $\times$ Raíz(2gh) | Calcula velocidad inicial tras choque inelástico. |

---

### V. Dinámica Rotacional y Torque

Aplica la dinámica a cuerpos rígidos que giran.

| Nombre | Símbolo | Unidad (SI) | Fórmula Simbólica | Fórmula en Texto | Dato Relevante / Uso |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Torque** | $\tau$ | N·m | $\tau = r F \sin\theta$ | Torque = Brazo $\times$ Fuerza $\times$ Seno ángulo | Capacidad de una fuerza para producir rotación. |
| **Equilibrio Rotacional** | $\sum \tau$ | N·m | $\sum \tau = 0$ | Suma de Torques = 0 | Condición para que no haya aceleración angular. |
| **Momento de Inercia** | $I$ | $kg \cdot m^2$ | $I = \sum m r^2$ | Inercia = Suma (Masa $\times$ Distancia al eje$^2$) | Resistencia a rotar. Varía según forma (tabla). |
| **Inercia (Aro)** | $I$ | $kg \cdot m^2$ | $I = MR^2$ | Inercia = Masa $\times$ Radio$^2$ | Para un aro delgado girando en su centro. |
| **Inercia (Disco/Cilindro)** | $I$ | $kg \cdot m^2$ | $I = \frac{1}{2}MR^2$ | Inercia = $\frac{1}{2}$ $\times$ Masa $\times$ Radio$^2$ | Para disco sólido o cilindro macizo. |
| **Inercia (Esfera Sólida)** | $I$ | $kg \cdot m^2$ | $I = \frac{2}{5}MR^2$ | Inercia = $\frac{2}{5}$ $\times$ Masa $\times$ Radio$^2$ | Para esfera sólida uniforme. |
| **2da Ley Newton Rotación** | $\tau_{net}$ | N·m | $\sum \tau = I \alpha$ | Torque Neto = Inercia $\times$ Aceleración Angular | Análogo rotacional de $F=ma$. |
| **Momentum Angular** | $L$ | $kg \cdot m^2/s$ | $L = I \omega$ | Momento Angular = Inercia $\times$ Vel. Angular | Cantidad de movimiento de rotación. |
| **Conservación Mom. Angular** | $L$ | $kg \cdot m^2/s$ | $I_i \omega_i = I_f \omega_f$ | Inercia Inicial $\times$ $\omega$ Inicial = Inercia Final $\times$ $\omega$ Final | Se conserva si el torque externo neto es cero. |
| **Energía Cinética Rotacional** | $K_{rot}$ | J | $K_{rot} = \frac{1}{2} I \omega^2$ | E. Rotacional = $\frac{1}{2}$ $\times$ Inercia $\times$ Vel. Angular$^2$ | Energía debida al giro del cuerpo. |
| **Trabajo Rotacional** | $W$ | J | $W = \int \tau d\theta$ | Trabajo = Integral del Torque respecto al Ángulo | Trabajo realizado por un torque al girar un cuerpo. |
"""

    # Borrow the parser from main.py by instantiating the app class (hacky but effective reuse)
    # Be careful not to start the GUI mainloop
    app = main.FormulaApp(tk.Tk()) 
    parsed_data = app.parse_input(input_text)
    
    if parsed_data:
        output_file = "fisica_formulas_completo.pdf"
        generate_pdf(parsed_data, output_file)
        print(f"File created: {os.path.abspath(output_file)}")
    else:
        print("Parsing failed.")

if __name__ == "__main__":
    create_pdf()
