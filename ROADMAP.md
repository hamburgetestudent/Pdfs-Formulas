# Roadmap del Proyecto
## Estado Actual
El proyecto "Generador de Fórmulas Física PDF" es una herramienta funcional para generar PDFs y estudiar fórmulas. Se ha implementado recientemente un sistema de gamificación local.

## Nuevas Características Implementadas
*   **Gamificación (Sistema de Progreso):**
    *   **Perfiles de Usuario (Local):** Se guarda el progreso en `data/user_progress.json`.
    *   **Niveles:** Los usuarios ganan 10 XP por respuesta correcta y suben de nivel cada 100 XP.
    *   **Estadísticas:** Se rastrean preguntas respondidas, aciertos y rachas.
    *   **Logros:** Sistema básico de logros (Primer Paso, Estudioso, Maestro, En Llamas).

## Recomendaciones y Futuras Mejoras

### 1. Para Estudiantes
*   **Modo Examen Contrarreloj:** Implementar un temporizador para simular condiciones reales de prueba.
*   **Repaso Inteligente (Spaced Repetition):** Priorizar las fórmulas/preguntas en las que el usuario suele fallar.
*   **Visualización de Logros:** Crear una pantalla dedicada ("Sala de Trofeos") donde se vean los logros desbloqueados con iconos.

### 2. Para Profesores
*   **Editor de Preguntas:** Interfaz gráfica para añadir nuevas preguntas al archivo JSON sin editar texto.
*   **Exportar Exámenes:** Capacidad de seleccionar preguntas del banco y generar un PDF de examen con hoja de respuestas separada.
*   **Importar Bancos de Preguntas:** Permitir cargar archivos JSON externos fácilmente para compartir entre docentes.

### 3. Aspectos Técnicos
*   **Soporte Multi-usuario:** Permitir crear múltiples perfiles en la misma instalación (útil para laboratorios de computación).
*   **Sincronización en la Nube (Futuro):** Opcional, para no perder progreso si se cambia de PC.
*   **Mejoras en Renderizado:** Optimizar la generación de imágenes LaTeX para reducir tiempos de carga en equipos lentos.

## Estructura de Datos (Gamificación)
El archivo `user_progress.json` mantiene la siguiente estructura:
```json
{
    "xp": 150,
    "level": 2,
    "stats": {
        "total_correct": 15,
        "total_attempts": 20,
        "current_streak": 2,
        "best_streak": 5
    },
    "achievements": ["first_step", "scholar"]
}
```
