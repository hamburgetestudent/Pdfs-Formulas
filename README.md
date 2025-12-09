# Generador de Fórmulas de Física en PDF

Este proyecto es una herramienta de escritorio desarrollada en Python que permite a los usuarios generar documentos PDF con tablas de fórmulas físicas a partir de datos ingresados en formato CSV o Markdown.

La aplicación cuenta con una interfaz gráfica moderna (CustomTkinter) y renderiza fórmulas matemáticas LaTeX utilizando Matplotlib y ReportLab.

## Características

*   **Interfaz Gráfica Moderna**: Utiliza `customtkinter` para una experiencia de usuario agradable con tema oscuro.
*   **Soporte de Entrada Flexible**: Acepta datos copiados y pegados en formato CSV (separado por punto y coma) o tablas Markdown con secciones.
*   **Renderizado LaTeX**: Convierte cadenas LaTeX en imágenes de alta calidad dentro del PDF.
*   **Generación de PDF**: Crea documentos PDF estructurados y listos para imprimir.
*   **Portabilidad**: Puede ser empaquetado como un ejecutable único.

## Estructura del Proyecto

El código fuente está organizado de la siguiente manera:

*   `main.py`: Punto de entrada de la aplicación. Contiene la lógica de la interfaz gráfica (`FormulaApp`) y el manejo de eventos.
*   `pdf_builder.py`: Módulo encargado de la generación del documento PDF utilizando ReportLab. Procesa los datos y construye las tablas.
*   `renderer.py`: Módulo utilitario que utiliza Matplotlib para renderizar fórmulas LaTeX en imágenes PNG en memoria.
*   `reproduce_crash.py`: Script de prueba para verificar la lógica de generación de PDF y renderizado sin la interfaz gráfica.

## Instalación y Configuración

### Requisitos Previos

*   Python 3.8 o superior.
*   Dependencias listadas en `requirements.txt`.

### Pasos

1.  Clona el repositorio o descarga el código fuente.
2.  Instala las dependencias necesarias:

    ```bash
    pip install -r requirements.txt
    ```

    *Nota: Si no existe `requirements.txt`, las dependencias principales son `customtkinter`, `reportlab`, `matplotlib`.*

## Uso

1.  Ejecuta la aplicación:

    ```bash
    python main.py
    ```

2.  En la ventana de la aplicación, ingresa tus datos en el área de texto.

    **Formato Markdown (Recomendado):**
    ```markdown
    ### Cinemática
    | Concepto | Fórmula Simbólica | Fórmula en Texto | Dato Relevante / Uso | Unidad (SI) |
    |---|---|---|---|---|
    | Velocidad | v = d/t | Velocidad es distancia sobre tiempo | Movimiento uniforme | m/s |
    ```

    **Formato CSV (Legacy):**
    ```csv
    Concepto;Fórmula;Variables;Unidades (SI)
    Velocidad;v = d/t;d: distancia, t: tiempo;m/s
    ```

3.  Haz clic en el botón **"Generar PDF"**.
4.  Selecciona la ubicación donde deseas guardar el archivo PDF.

## Desarrollo

### Generar Ejecutable

Para crear un ejecutable (Windows/Linux/Mac) utilizando PyInstaller, utiliza el archivo de especificación incluido:

```bash
pyinstaller GeneradorFormulas.spec
```

El ejecutable se generará en la carpeta `dist`.

## Licencia

Este proyecto es de código abierto.
