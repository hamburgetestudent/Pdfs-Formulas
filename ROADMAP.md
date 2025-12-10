# Roadmap del Proyecto

Este documento detalla los planes de desarrollo futuro para la aplicación. Las tareas están organizadas por prioridad.

## 🔴 Prioridad Alta (Estudiantes y Experiencia Core)
Estas características son esenciales para mejorar la utilidad de la aplicación como herramienta de estudio diaria.

### 1. Modo Examen (Simulacro)
Implementar un entorno que simule una prueba real.
*   [ ] **Temporizador:** Añadir un contador regresivo visible en la interfaz.
*   [ ] **Límite de Preguntas:** Configurar sesiones fijas (ej. 20 preguntas) en lugar de modo infinito.
*   [ ] **Sin Feedback Inmediato:** Ocultar las respuestas correctas hasta el final de la sesión.
*   [ ] **Pantalla de Resultados:** Mostrar un resumen final con nota, tiempo empleado y desglose de errores.

### 2. Repaso Inteligente (Spaced Repetition)
Optimizar el aprendizaje mostrando con más frecuencia lo que el usuario no sabe.
*   [ ] **Rastreo de Errores:** Registrar en `user_progress.json` qué preguntas específicas se fallaron.
*   [ ] **Algoritmo de Selección:** Modificar la lógica de `load_question` para priorizar preguntas con historial de fallos.
*   [ ] **Sesiones de Repaso:** Crear un botón específico "Repasar mis errores".

### 3. Visualización de Logros
Hacer visible el sistema de gamificación.
*   [ ] **Sala de Trofeos:** Crear una nueva vista o popup que muestre los iconos de los logros desbloqueados.
*   [ ] **Notificaciones:** Mostrar un popup visual (Toast notification) cuando se desbloquea un logro en tiempo real.

---

## 🟡 Prioridad Media (Herramientas para Profesores)
Mejoras enfocadas en la creación y gestión de contenido.

### 1. Editor de Preguntas (GUI)
Facilitar la expansión de la base de datos sin tocar JSON.
*   [ ] **Formulario de Ingreso:** Interfaz con campos para Pregunta, Opciones, Respuesta Correcta y Dificultad.
*   [ ] **Validación:** Asegurar que siempre haya una respuesta correcta marcada.
*   [ ] **Guardado Seguro:** Escribir en `quiz_db.json` validando la estructura JSON para no corromper el archivo.

### 2. Exportación de Exámenes
Permitir sacar las preguntas de la app al papel.
*   [ ] **Selección de Temas:** Checkboxes para elegir qué temas incluir en el examen.
*   [ ] **Generador PDF de Examen:** Usar el motor `pdf_builder.py` existente para crear un layout de prueba (preguntas numeradas).
*   [ ] **Hoja de Respuestas:** Generar una página final separada con las claves de corrección.

---

## 🟢 Prioridad Baja (Técnico y Expansión)
Mejoras a largo plazo o de optimización técnica.

### 1. Soporte Multi-usuario
*   [ ] **Pantalla de Login:** Selector simple de perfil al iniciar la app.
*   [ ] **Gestión de Archivos:** Crear múltiples archivos `user_progress_[nombre].json`.

### 2. Sincronización en la Nube
*   [ ] **Backend Simple:** Investigar integración con Firebase o similar para guardar progreso remoto.

### 3. Optimización de Renderizado
*   [ ] **Cache Persistente:** Guardar las imágenes de fórmulas generadas en disco (carpeta temp) para no regenerarlas en cada inicio.
