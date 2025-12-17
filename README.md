# Herramienta de Estudio de Física (Generador & Quiz)

Bienvenido a la herramienta definitiva para estudiantes y profesores de física. Esta aplicación de escritorio combina un potente sistema de **aprendizaje interactivo** con cuestionarios gamificados y un **generador de documentos PDF** para material de estudio.

Diseñada con una interfaz moderna y oscura (`CustomTkinter`), es ideal para practicar fórmulas, ponerse a prueba y crear hojas de fórmulas para exámenes.

## Características Principales

### 1. 🎓 Modo Estudio y Cuestionarios (Quiz)
La función principal de la aplicación es ayudarte a dominar la física.
*   **Aprendizaje de Fórmulas:** Relaciona conceptos físicos con su fórmula matemática correcta (renderizada en LaTeX).
*   **Banco de Preguntas:** Practica con preguntas de selección múltiple sobre teoría y aplicación.
*   **Niveles de Dificultad:** Elige entre Fácil, Medio y Difícil para adaptar el reto a tu nivel.
*   **Feedback Inmediato:** Aprende de tus errores con correcciones visuales instantáneas.

### 2. 🏆 Sistema de Gamificación
¡Haz que estudiar sea divertido! La aplicación rastrea tu progreso localmente.
*   **Experiencia (XP):** Gana **10 XP** por cada respuesta correcta.
*   **Niveles:** Sube de nivel cada **100 XP** acumulados.
*   **Rachas:** Mantén una racha de aciertos para demostrar tu dominio.
*   **Logros:** Desbloquea medallas como *"Primer Paso"*, *"Estudioso"*, *"Maestro"* y *"En Llamas"*.

### 3. 📄 Generador de PDF
Crea documentos profesionales con tablas de fórmulas listas para imprimir.
*   **Entrada Flexible:** Copia y pega desde Excel/CSV o escribe en Markdown.
*   **Renderizado LaTeX:** Las fórmulas se convierten automáticamente en imágenes nítidas de alta calidad.
*   **Portabilidad:** Genera un archivo PDF estructurado en segundos.

---

## Instalación

1.  **Requisitos:** Python 3.8 o superior.
2.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Ejecutar:**
    ```bash
    python main.py
    ```

---

## Guía de Uso

### Modo Cuestionario (Quiz)
1.  En el menú lateral, selecciona **"Quiz / Cuestionario"**.
2.  Navega por las categorías (ej: *Física Clásica* -> *Cinemática*).
3.  Elige tu modo de práctica:
    *   **Aprender Fórmulas:** Identifica la ecuación visual.
    *   **Responder Preguntas:** Resuelve problemas teóricos.
4.  (Opcional) Selecciona la dificultad.
5.  ¡Responde y sube de nivel! Tu progreso se guarda automáticamente.

### Generador de PDF
1.  En el menú lateral, selecciona **"Generador PDF"**.
2.  Ingresa tus datos en el área de texto. Se recomienda el formato Markdown:
    ```markdown
    ### Dinámica
    | Concepto | Fórmula | Notas |
    |---|---|---|
    | Fuerza | F = m * a | Segunda Ley de Newton |
    ```
3.  Haz clic en **"Generar PDF"** y guarda tu archivo.

---

## Estructura del Proyecto

*   `src/views/`: Contiene las interfaces gráficas (Home, Quiz, PDF).
*   `src/gamification.py`: Lógica del sistema de progreso y logros.
*   `data/`: Almacena la base de datos de preguntas (`quiz_db.json`) y tu progreso (`user_progress.json`).
*   `pdf_builder.py` & `renderer.py`: Motores de generación de documentos e imágenes matemáticas.

## Contribución
Si deseas contribuir, por favor revisa el archivo `ROADMAP.md` para ver las tareas pendientes y prioridades.

## Licencia
Todos los derechos reservados.
