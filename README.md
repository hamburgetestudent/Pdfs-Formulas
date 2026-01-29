# Herramienta de Estudio: Física & Python 🚀 hecha meramente por vibe coding , logica debil

¡Bienvenido a la aplicación definitiva para dominar la Física y la Programación! Tras una migración completa, esta herramienta de escritorio ahora funciona sobre una arquitectura moderna basada en **Electron**, **React 19** y **TypeScript**.

La aplicación combina un sistema de **aprendizaje interactivo** con cuestionarios gamificados, simulaciones en tiempo real y un potente **generador de documentos PDF**.

---

## ✨ Características Principales

### 1. 🎓 Aprendizaje Interactivo
No solo leas, ¡interactúa! Hemos diseñado diferentes tipos de lecciones para asegurar el aprendizaje:
*   **Simulaciones Dinámicas:** Modifica variables físicas y observa resultados instantáneos (ej: lanzamiento de cohetes, caída libre).
*   **Sequence Builder (Arrastrar y Soltar):** Aprende la lógica detrás de los algoritmos y procesos físicos ordenando pasos.
*   **Teoría Enriquecida:** Contenido teórico interactivo con alertas, listas de verificación y micro-quices.

### 2. 🏆 Sistema de Gamificación
Estudiar es más divertido cuando progresas y desbloqueas logros, inspirado en aplicaciones de estudio corto y rapido:
*   **Progreso de Usuario:** Gana XP con cada lección completada y sube de nivel.
*   **Logros y Medallas:** Desbloquea reconocimientos como *"Primer Paso"*, *"Estudioso"*, *"Maestro"* y mucho más.
*   **Dashboard de Usuario:** Visualiza tu nivel, racha de estudio y progreso global por categorías.

### 3. 📄 Generador de PDF
Crea hojas de estudio profesionales y formularios en segundos:
*   **Formato Flexible:** Soporta entrada de texto y tablas en Markdown.
*   **Renderizado LaTeX:** Las fórmulas matemáticas se ven perfectas gracias a la integración con KaTeX.
*   **Exportación Directa:** Genera PDFs listos para imprimir o compartir.

---

## 🛠️ Tecnologías Utilizadas

*   **Core:** React 19, TypeScript, Electron.
*   **Estilos:** Tailwind CSS (moderno, oscuro y refinado).
*   **Iconos:** Lucide React.
*   **Matemáticas:** KaTeX para un renderizado impecable de fórmulas.
*   **Build Tool:** Vite.

---

## 🚀 Instalación y Desarrollo

### Requisitos
*   [Node.js](https://nodejs.org/) (Versión recomendada: 18 o superior).

### Configuración del Proyecto
1. Clona el repositorio.
2. Navega al directorio de la aplicación:
   ```bash
   cd desktop-app
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecución en Desarrollo
Para iniciar la aplicación con Hot Module Replacement (HMR):
```bash
npm run dev
```

### Construcción para Producción
Para empaquetar la aplicación para tu sistema operativo:
```bash
npm run build
```

---

## 📂 Estructura del Proyecto

*   `desktop-app/src/pages/`: Vistas principales (Dashboard, Lecciones, Perfil).
*   `desktop-app/src/components/`: Componentes modulares de la interfaz.
*   `desktop-app/src/lib/`: Lógica de negocio (Gamificación, Lecciones, Datos de Quiz).
*   `desktop-app/electron/`: Configuración principal de la ventana de escritorio.

---

## 🤝 Contribución
Las contribuciones son bienvenidas. Si tienes ideas para nuevas simulaciones o módulos de estudio, por favor abre un *Issue* o envía un *Pull Request*.

## 📜 Licencia
Todos los derechos reservados.

