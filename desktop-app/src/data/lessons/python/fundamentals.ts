import type { LessonContent } from '../../../types';

export const PYTHON_FUNDAMENTALS_DATA: Record<string, LessonContent> = {
    // PYTHON
    'Python-Fundamentos-Algoritmos-study': {
        id: 'Python-Fundamentos-Algoritmos-study',
        title: '¿Qué es un algoritmo?',
        type: 'theory',
        instructions: 'Entendiendo la base de la programación.',
        theoryBlocks: [
            {
                type: 'text',
                content:
                    'Un algoritmo es una serie de pasos ordenados y claros que sirven para resolver un problema o realizar una tarea.',
            },
            {
                type: 'header',
                content: 'Ejemplo: Lavarse los dientes',
            },
            {
                type: 'list',
                content: ['Tomar el cepillo', 'Poner pasta', 'Cepillar', 'Enjuagar'],
            },
            {
                type: 'alert',
                style: 'warning',
                content:
                    'Un algoritmo NO es código. El código es solo una forma de escribir un algoritmo para la computadora.',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Algoritmos-quiz',
    },
    'Python-Fundamentos-Algoritmos-quiz': {
        id: 'Python-Fundamentos-Algoritmos-quiz',
        title: 'Mini-check',
        type: 'quiz',
        instructions: 'Demuestra que has entendido el concepto.',
        quizConfig: {
            question: '¿Cuál de estos es un algoritmo?',
            options: [
                { id: 'A', text: '“Cepillarse bien y rápido”', correct: false },
                { id: 'B', text: '1. Tomar cepillo\n2. Poner pasta\n3. Cepillar', correct: true },
                { id: 'C', text: '“Algo para limpiar dientes”', correct: false },
            ],
            successMessage: '¡Exacto! Un algoritmo es una serie de pasos precisos.',
            errorMessage:
                'No exactamente. Un algoritmo debe ser una serie de pasos ordenados, no una descripción vaga.',
        },
        nextLessonId: 'Python-Fundamentos-Algoritmos-tea',
    },
    'Python-Fundamentos-Algoritmos-tea': {
        id: 'Python-Fundamentos-Algoritmos-tea',
        title: 'El Robot del Té',
        type: 'drag_drop',
        instructions: 'Ayuda al robot a preparar té. Ordena los pasos lógicamente.',
        dragDropConfig: {
            items: [
                { id: '1', text: 'Hervir agua' },
                { id: '2', text: 'Poner bolsita de té en taza' },
                { id: '3', text: 'Servir agua en la taza' },
                { id: '4', text: 'Esperar 3 min y servir té' },
                { id: 'trap', text: 'Beber el té (sin té)' },
            ],
            correctSequence: ['1', '2', '3', '4'],
            trapId: 'trap',
            trapMessage:
                '¡Te has bebido el agua antes de hacer el té! Un algoritmo debe tener ORDEN lógico.',
            successMessage:
                '¡Perfecto! El algoritmo tiene una secuencia lógica: Calentar -> Preparar -> Servir -> Esperar.',
            errorMessage: 'El orden no es correcto. Piensa: ¿Qué necesitas antes de servir el agua?',
        },
        nextLessonId: 'Python-Fundamentos-Algoritmos-concepts',
    },
    'Python-Fundamentos-Algoritmos-concepts': {
        id: 'Python-Fundamentos-Algoritmos-concepts',
        title: 'Conceptos Clave',
        type: 'theory',
        instructions: 'Asegura tu conocimiento con estos conceptos fundamentales.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'Propiedades de un Algoritmo',
            },
            {
                type: 'checklist', // Nuevo tipo para propiedades verificadas
                content: [
                    'Finito (termina)',
                    'Claro (sin ambigüedad)',
                    'Ordenado',
                    'Repetible (si lo repites, obtienes el mismo resultado)',
                ],
            },
            {
                type: 'header',
                content: 'Micro-Quiz',
            },
            {
                type: 'true_false',
                content: 'Un algoritmo puede ser una receta.',
                answer: true,
            },
            {
                type: 'true_false',
                content: 'Un algoritmo es siempre código.',
                answer: false,
            },
        ],
        nextLessonId: 'Python-Fundamentos-Algoritmos-home',
    },
    'Python-Fundamentos-Algoritmos-home': {
        id: 'Python-Fundamentos-Algoritmos-home',
        title: 'Algoritmo: Salir de casa',
        type: 'drag_drop',
        instructions:
            'Ordena los pasos para salir de casa correctamente. Reglas: No puedes salir sin abrir, ni cerrar antes de salir.',
        dragDropConfig: {
            items: [
                { id: '1', text: 'Ponerse zapatos' },
                { id: '2', text: 'Tomar llaves' },
                { id: '3', text: 'Abrir la puerta' },
                { id: '4', text: 'Salir de la casa' },
                { id: '5', text: 'Cerrar la puerta' },
                { id: '6', text: 'Guardar llaves' },
                { id: 'trap', text: 'Dormirse en el sillón' },
            ],
            correctSequence: ['1', '2', '3', '4', '5', '6'],
            trapId: 'trap',
            trapMessage: '¡Te quedaste dormido! El objetivo era salir, no descansar.',
            successMessage: '¡Excelente! "Cada acción correcta empieza con un buen algoritmo."',
            errorMessage:
                'El orden no es correcto. Recuerda: Zapatos -> Llaves -> Abrir -> Salir -> Cerrar.',
        },
        nextLessonId: 'Python-Fundamentos-PensarEnPasos-study',
    },

    // LECCIÓN 2: PENSAR EN PASOS
    'Python-Fundamentos-PensarEnPasos-study': {
        id: 'Python-Fundamentos-PensarEnPasos-study',
        title: 'Materia (OBLIGATORIO)',
        type: 'theory',
        instructions: 'Pantalla tranquila, sin animaciones todavía.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'Pensar en pasos',
            },
            {
                type: 'text',
                content:
                    'Pensar como programador significa dividir una acción grande en pasos pequeños, claros y ejecutables.\n\nUna computadora no entiende "acciones completas". Solo entiende pasos simples, uno por uno.',
            },
            {
                type: 'header',
                content: 'Ejemplo comparativo',
            },
            {
                type: 'alert',
                style: 'warning',
                content: '❌ Acción grande: "Preparar desayuno"',
            },
            {
                type: 'checklist',
                content: ['Tomar un plato', 'Poner comida en el plato', 'Sentarse', 'Comer'],
            },
            {
                type: 'alert',
                style: 'info',
                content: 'Programar es desarmar la realidad en pasos simples.',
            },
        ],
        nextLessonId: 'Python-Fundamentos-PensarEnPasos-check',
    },
    'Python-Fundamentos-PensarEnPasos-check': {
        id: 'Python-Fundamentos-PensarEnPasos-check',
        title: 'Micro-chequeo',
        type: 'quiz',
        instructions: 'Micro-chequeo de comprensión',
        quizConfig: {
            question: '¿Cuál opción está mejor pensada en pasos?',
            options: [
                { id: 'A', text: 'Ordenar la pieza', correct: false },
                {
                    id: 'B',
                    text: '1. Juntar ropa\n2. Guardar ropa\n3. Barrer el piso\n4. Hacer la cama',
                    correct: true,
                },
            ],
            successMessage: 'Correcto. Los pasos pequeños se pueden ejecutar.',
            errorMessage: 'La opción A es una "acción grande", no pasos ejecutables.',
        },
        nextLessonId: 'Python-Fundamentos-PensarEnPasos-guided',
    },
    'Python-Fundamentos-PensarEnPasos-guided': {
        id: 'Python-Fundamentos-PensarEnPasos-guided',
        title: 'Ejercicio guiado',
        type: 'drag_drop',
        instructions: 'Convierte esta acción en pasos: "Enviar un mensaje"',
        dragDropConfig: {
            items: [
                { id: '1', text: 'Abrir el celular' },
                { id: '2', text: 'Abrir la app de mensajes' },
                { id: '3', text: 'Elegir contacto' },
                { id: '4', text: 'Escribir el mensaje' },
                { id: '5', text: 'Enviar' },
            ],
            correctSequence: ['1', '2', '3', '4', '5'],
            successMessage: '¡Bien! Has desglosado la acción correctamente.',
            errorMessage: 'Revisa el orden lógico. No puedes escribir antes de abrir la app.',
        },
        nextLessonId: 'Python-Fundamentos-PensarEnPasos-diff',
    },

    'Python-Fundamentos-PensarEnPasos-diff': {
        id: 'Python-Fundamentos-PensarEnPasos-diff',
        title: 'Dificultad real',
        type: 'quiz',
        instructions: 'Dificultad real (pensamiento)',
        quizConfig: {
            question: '¿Cuál paso es demasiado grande?',
            options: [
                { id: 'A', text: 'Abrir el celular', correct: false },
                { id: 'B', text: 'Comunicarse', correct: true },
            ],
            successMessage:
                '¡Exacto! "Comunicarse" es muy abstracto. "Abrir el celular" es una acción concreta.',
            errorMessage: 'Piensa: ¿cuál de los dos requiere más subdivisiones?',
        },
        nextLessonId: 'Python-Fundamentos-PensarEnPasos-bridge',
    },
    'Python-Fundamentos-PensarEnPasos-bridge': {
        id: 'Python-Fundamentos-PensarEnPasos-bridge',
        title: 'Puente sutil hacia código',
        type: 'theory',
        instructions: 'Sin enseñar Python todavía',
        theoryBlocks: [
            {
                type: 'text',
                content: 'En programación, cada paso termina siendo una Instrucción.',
            },
            {
                type: 'header',
                content: 'Ejemplo visual',
            },
            {
                type: 'list',
                content: ['Pasos: "Mostrar un mensaje"', '🔒 (Icono de código bloqueado)'],
            },
            {
                type: 'text',
                content: 'Pronto aprenderás a escribir estos pasos en Python.',
            },
        ],
        nextLessonId: 'Python-Fundamentos-PensarEnPasos-quiz',
    },
    'Python-Fundamentos-PensarEnPasos-quiz': {
        id: 'Python-Fundamentos-PensarEnPasos-quiz',
        title: 'Mini-Boss: Preparar la mochila',
        type: 'drag_drop',
        instructions:
            'Arma pasos correctos. Regla: No puedes guardar sin abrir. El algoritmo debe terminar.',
        dragDropConfig: {
            items: [
                { id: '1', text: 'Abrir la mochila' },
                { id: '2', text: 'Buscar cuadernos' },
                { id: '3', text: 'Guardar cuadernos' },
                { id: '4', text: 'Guardar lápiz' },
                { id: '5', text: 'Cerrar la mochila' },
                { id: 'trap', text: 'Ir al colegio (sin mochila)' },
            ],
            correctSequence: ['1', '2', '3', '4', '5'],
            trapId: 'trap',
            trapMessage: '¡Te fuiste sin la mochila! 🚫',
            successMessage: '¡Excelente! Has dominado el Pensamiento Algorítmico II. 🏆',
            errorMessage: 'Recuerda: Abrir -> Buscar/Guardar -> Cerrar.',
        },
        nextLessonId: 'Python-Fundamentos-Salud mental-study',
    },

    // para uso futuro
    /*
    'Python-Fundamentos-Decisiones en la vida real-study': {
        id: 'Python-Fundamentos-Decisiones en la vida real-study',
        title: "La Lección Previa: 'La Pregunta de Sí o No'",
        type: 'simulation',
        instructions: 'Las computadoras no dudan. Descubre cómo toman decisiones.',
        simulationConfig: {
            type: 'boolean_playground',
            initialCode: '',
            verifyFunction: () => true, // La validación es interna en el componente
            successMessage: '¡Nivel Completado! Has dominado los Booleanos.',
            errorMessage: '',
            options: [],
        },
    },
    */
    'Python-Fundamentos-Salud mental-study': {
        id: 'Python-Fundamentos-Salud mental-study',
        title: 'Pausa para la Salud Mental',
        type: 'theory',
        instructions: 'Un momento para respirar y reflexionar.',
        theoryBlocks: [
            {
                type: 'header',
                content: '¡Cuidarte es parte del proceso!',
            },
            {
                type: 'text',
                content:
                    'Programar y estudiar física requiere mucha energía mental. Recuerda que descansar no es perder el tiempo, es recargar combustible.',
            },
            {
                type: 'alert',
                style: 'info',
                content: '¿Sabías que caminar 10 minutos puede mejorar tu lógica de programación?',
            },
            {
                type: 'checklist',
                content: [
                    'Toma agua regularmente',
                    'Estira la espalda cada 45 min',
                    'No olvides parpadear',
                    'Duerme al menos 7-8 horas',
                ],
            },
            {
                type: 'header',
                content: 'Micro-compromiso',
            },
            {
                type: 'true_false',
                content: '¿Te comprometes a tomar un vaso de agua ahora mismo?',
                answer: true,
                trueLabel: 'Si, lo voy a hacer',
                falseLabel: 'No, no voy a hacerte caso 😈😈',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Salud mental-expectativa',
    },
    'Python-Fundamentos-Salud mental-expectativa': {
        id: 'Python-Fundamentos-Salud mental-expectativa',
        title: 'Expectativa vs Realidad',
        type: 'theory',
        instructions: 'A veces, lo que imaginamos no es lo que sucede. ¡Y está bien!',
        theoryBlocks: [
            {
                type: 'header',
                content: 'Cuando empiezas a programar...',
            },
            {
                type: 'image',
                content: '/images/expectation_vs_reality.png',
                caption: 'Todo es parte del aprendizaje.',
            },
            {
                type: 'text',
                content: 'No te frustres si tu código no funciona a la primera. ¡A nadie le funciona a la primera!',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Salud mental-gps',
    },
    'Python-Fundamentos-Salud mental-gps': {
        id: 'Python-Fundamentos-Salud mental-gps',
        title: 'Recalculando Ruta',
        type: 'theory',
        instructions: 'Cambia tu perspectiva sobre los errores.',
        theoryBlocks: [
            {
                type: 'image',
                content: '/images/mental_health_gps.png',
                caption: 'Recalculando...',
            },
            {
                type: 'text',
                content:
                    'Imagina que vas conduciendo y te equivocas de calle.\n\nEl GPS no te grita "¡Eres un mal conductor!". Solo dice: "Recalculando ruta".\n\nEn programación, un mensaje de error es exactamente eso: el computador diciéndote que no entendió tu instrucción y necesita que recalcules.',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Salud mental-error',
    },
    'Python-Fundamentos-Salud mental-error': {
        id: 'Python-Fundamentos-Salud mental-error',
        title: 'El Texto Rojo es tu Amigo',
        type: 'theory',
        instructions: 'Aprende a leer las pistas que te da el computador.',
        theoryBlocks: [
            {
                type: 'image',
                content: '/images/mental_health_error.png',
                caption: 'No entres en pánico.',
            },
            {
                type: 'text',
                content:
                    'Cuando ves texto rojo, no entres en pánico. Es una pista.\n\nGeneralmente el error te dice DÓNDE buscar.\n\n"Error en línea 5" = "Oye, revisa la línea 5, se te olvidó algo".\n\nEl computador es muy literal, si le falta una coma, se confunde. No es tu culpa, es que él es muy exigente.',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Salud mental-AlgorithmRepair',
    },

    'Python-Fundamentos-Salud mental-AlgorithmRepair': {
        id: 'Python-Fundamentos-Salud mental-AlgorithmRepair',
        title: 'Laboratorio: Reparación de Algoritmo',
        type: 'simulation',
        instructions: 'Debuggeo: Encuentra y elimina los pasos incorrectos.',
        simulationConfig: {
            type: 'algorithm_repair',
            initialCode: '',
            verifyFunction: () => true, // Handled internally
            successMessage: '¡Bien hecho! Has depurado el algoritmo.',
            errorMessage: '',
            options: [],
        },
        nextLessonId: 'Python-Fundamentos-Diagramas-intro',
    },

    // LECCIÓN: DIAGRAMAS DE FLUJO (NUEVA)
    'Python-Fundamentos-Diagramas-intro': {
        id: 'Python-Fundamentos-Diagramas-intro',
        title: 'El Mapa del Tesoro',
        type: 'theory',
        instructions: 'Antes de escribir código, visualizamos el camino.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'Un Algoritmo es un Mapa',
            },
            {
                type: 'text',
                content:
                    'Imagina que quieres encontrar un tesoro. No empiezas a correr a ciegas. Primero miras el mapa.\n\nEn programación, ese mapa se llama **Diagrama de Flujo**.',
            },
            {
                type: 'flowchart',
                shape: 'oval',
                color: 'green',
                content: 'Inicio',
            },
            {
                type: 'flowchart',
                shape: 'rectangle',
                color: 'blue',
                content: 'Caminar 10 pasos',
            },
            {
                type: 'flowchart',
                shape: 'rectangle',
                color: 'blue',
                content: 'Girar a la derecha',
            },
            {
                type: 'flowchart',
                shape: 'oval',
                color: 'green',
                content: 'Llegar al tesoro',
            },
            {
                type: 'text',
                content: '¿Ves cómo aparecen paso a paso? Así piensa el computador.',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Diagramas-shapes',
    },
    'Python-Fundamentos-Diagramas-shapes': {
        id: 'Python-Fundamentos-Diagramas-shapes',
        title: 'Las Formas del Mapa',
        type: 'theory',
        instructions: 'En los diagramas, cada forma tiene un significado sagrado.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'Diccionario Visual',
            },
            {
                type: 'flowchart',
                shape: 'oval',
                color: 'green',
                content: 'INICIO / FIN',
                caption: 'El Óvalo Verde: Indica dónde empieza y termina todo.',
            },
            {
                type: 'flowchart',
                shape: 'rectangle',
                color: 'blue',
                content: 'ACCIÓN',
                caption: 'El Rectángulo Azul: Algo que haces (Correr, Calcular, Mostrar).',
            },
            {
                type: 'flowchart',
                shape: 'diamond',
                color: 'amber',
                content: 'DECISIÓN',
                caption: 'El Rombo Naranja: Una pregunta de SÍ o NO.',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Diagramas-arrows',
    },
    'Python-Fundamentos-Diagramas-arrows': {
        id: 'Python-Fundamentos-Diagramas-arrows',
        title: 'El Flujo (Flow)',
        type: 'theory',
        instructions: 'La magia está en las flechas que conectan todo.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'Sigue la Flecha',
            },
            {
                type: 'text',
                content: 'El computador sigue las flechas. Nunca salta pasos. Mira este flujo simple:',
            },
            {
                type: 'flowchart',
                shape: 'oval',
                color: 'green',
                content: 'Inicio',
            },
            {
                type: 'flowchart',
                shape: 'rectangle',
                color: 'blue',
                content: 'Saludar',
            },
            {
                type: 'flowchart',
                shape: 'oval',
                color: 'green',
                content: 'Fin',
            },
            {
                type: 'alert',
                style: 'info',
                content: 'Si cortas una flecha, el programa se detiene (o explota 💥).',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Diagramas-build',
    },
    'Python-Fundamentos-Diagramas-build': {
        id: 'Python-Fundamentos-Diagramas-build',
        title: 'Tu Primer Diagrama',
        type: 'drag_drop',
        instructions: 'Construye el diagrama para "Plantar un Árbol".',
        dragDropConfig: {
            items: [
                { id: '1', text: 'INICIO', shape: 'oval', color: 'green' },
                { id: '2', text: 'Cavar hoyo', shape: 'rectangle', color: 'blue' },
                { id: '3', text: 'Poner semilla', shape: 'rectangle', color: 'blue' },
                { id: '4', text: 'Tapar con tierra', shape: 'rectangle', color: 'blue' },
                { id: '5', text: 'FIN', shape: 'oval', color: 'green' },
                { id: 'trap', text: 'Comer la semilla', shape: 'rectangle', color: 'orange' },
            ],
            correctSequence: ['1', '2', '3', '4', '5'],
            trapId: 'trap',
            trapMessage: '¡Te comiste la semilla! Ahora no crecerá nada. 🌳🚫',
            successMessage: '¡Excelente! Has creado tu primer algoritmo visual. 🎨✨',
            errorMessage: 'Recuerda: Todo empieza en INICIO y termina en FIN.',
        },
        nextLessonId: 'Python-Fundamentos-Introducción al Pseudocódigo-intro',
    },

    // LECCIÓN: INTRODUCCIÓN AL PSEUDOCÓDIGO
    'Python-Fundamentos-Introducción al Pseudocódigo-intro': {
        id: 'Python-Fundamentos-Introducción al Pseudocódigo-intro',
        title: 'El Código no es Magia',
        type: 'theory',
        instructions: 'Descubre el secreto de los programadores.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'El Traductor Alienígena 👽',
            },
            {
                type: 'text',
                content:
                    'Mucha gente cree que programar es hacer magia, pero no. Es simplemente aprender un idioma nuevo.\n\nImagina que tu computadora es un alienígena muy obediente, pero que no habla español. Necesitas un "Traductor" para darle instrucciones.',
            },
            {
                type: 'alert',
                style: 'info',
                content: 'Ese traductor es el Lenguaje de Programación (como Python).',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Introducción al Pseudocódigo-game',
    },

    'Python-Fundamentos-Introducción al Pseudocódigo-game': {
        id: 'Python-Fundamentos-Introducción al Pseudocódigo-game',
        title: 'Minijuego: Lógica Alienígena',
        type: 'quiz',
        instructions: 'Analiza la instrucción y predice el futuro.',
        quizConfig: {
            question: 'Si le das esta orden al alien: "Si (llueve) -> abrir_paraguas()"',
            options: [
                { id: 'A', text: 'El alien hace que empiece a llover (Magia)', correct: false },
                { id: 'B', text: 'El alien abre el paraguas, pero SOLO si está lloviendo', correct: true },
                { id: 'C', text: 'El alien cierra el paraguas inmediatamente', correct: false },
            ],
            successMessage: '¡Exacto! No es magia. Es una condición simple: Solo actúas si la condición se cumple.',
            errorMessage: 'Recuerda: El código no controla el clima, solo reacciona a él.',
        },
        nextLessonId: 'Python-Fundamentos-Introducción al Pseudocódigo-grammar',
    },

    'Python-Fundamentos-Introducción al Pseudocódigo-grammar': {
        id: 'Python-Fundamentos-Introducción al Pseudocódigo-grammar',
        title: 'Actividad: Gramática de Colores',
        type: 'theory',
        instructions: 'Aprende a ver los colores del código.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'Acciones y Cosas',
            },
            {
                type: 'text',
                content:
                    'Para leer código, imagina que usas lentes especiales que colorean las palabras:\n\n🔵 **ACCIONES (Verbos)**: Lo que se hace (correr, abrir, comer).\n🔴 **COSAS (Objetos)**: A quién se le hace (puerta, pizza, paraguas).',
            },
            {
                type: 'code',
                language: 'python',
                content: '# Imagina: abrir es AZUL, puerta es ROJO\n\nabrir( puerta )',
            },
            {
                type: 'alert',
                style: 'info',
                content: 'Reto Mental: En la frase "encender(luz)", ¿De qué color pintarías "encender"?',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Introducción al Pseudocódigo-study',
    },

    // LECCIÓN: INTRODUCCIÓN AL PSEUDOCÓDIGO
    'Python-Fundamentos-Introducción al Pseudocódigo-study': {
        id: 'Python-Fundamentos-Introducción al Pseudocódigo-study',

        title: 'El Idioma Puente',
        type: 'theory',
        instructions: 'Antes del código, aprendemos a hablar como robots.',
        theoryBlocks: [
            {
                type: 'header',
                content: '¿Qué es el Pseudocódigo?',
            },
            {
                type: 'text',
                content:
                    'Antes de escribir código real (que puede ser difícil), los programadores escribimos "Pseudocódigo".\n\nEs como un borrador en tu propio idioma, sin reglas estrictas, para ordenar tus ideas.',
            },
            {
                type: 'code',
                language: 'python',
                content: '# --- INTENCION HUMANA ---\n"Quiero un café"\n\n# --- PSEUDOCODIGO ---\n1. Calentar agua\n2. Poner café en la taza\n3. Servir agua',
            },
            {
                type: 'alert',
                style: 'info',
                content: 'Es la mejor forma de planear antes de construir.',
            },
        ],
        nextLessonId: 'Python-Fundamentos-Introducción al Pseudocódigo-1',
    },
    'Python-Fundamentos-Introducción al Pseudocódigo-1': {
        id: 'Python-Fundamentos-Introducción al Pseudocódigo-1',

        title: 'Concepto: SI (Condicional)',
        type: 'theory',
        instructions: 'Primera palabra clave: SI.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'El Guardia del Club',
            },
            {
                type: 'text',
                content:
                    'En programación, "SI" no es una afirmación, es una pregunta. Funciona como un filtro de seguridad.\n\nSolo te deja pasar si la condición es VERDADERA.',
            },
            {
                type: 'code',
                language: 'python',
                content: '# EL GUARDIA DEL CLUB\n\nSI ( entrada_en_mano == VERDADERO ):\n    # CONDICION CUMPLIDA\n    ENTONCES( "¡Pasar al Club!" )',
            },

        ],
        nextLessonId: 'Python-Fundamentos-Introducción al Pseudocódigo-2',
    },
    'Python-Fundamentos-Introducción al Pseudocódigo-2': {
        id: 'Python-Fundamentos-Introducción al Pseudocódigo-2',

        title: 'Concepto: ENTONCES (Consecuencia)',
        type: 'theory',
        instructions: 'Segunda palabra clave: ENTONCES.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'Luz Verde',
            },
            {
                type: 'text',
                content:
                    'Es el conector mágico. Une la pregunta del guardia con la acción inmediata.\n\nEs lo que sucede automáticamente si el "SI" resultó ser verdad.',
            },
            {
                type: 'code',
                language: 'python',
                content: '# EL SEMAFORO\n\nSI ( luz == VERDE ):\n    # CONSECUENCIA DIRECTA\n    ENTONCES( "Acelerar el auto 🚗" )',
            },

        ],
        nextLessonId: 'Python-Fundamentos-Introducción al Pseudocódigo-3',
    },
    'Python-Fundamentos-Introducción al Pseudocódigo-3': {
        id: 'Python-Fundamentos-Introducción al Pseudocódigo-3',

        title: 'Concepto: SINO (Alternativa)',
        type: 'theory',
        instructions: 'Tercera palabra clave: SINO.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'El Plan B',
            },
            {
                type: 'text',
                content:
                    '"SINO" significa "De lo contrario". Es el camino alternativo que tomas solo cuando el "SI" te dice que no.',
            },
            {
                type: 'code',
                language: 'python',
                content: '# EL CAMINO\n\nSI ( camino_libre == VERDADERO ):\n   ENTONCES( "Seguir derecho" )\n\nSINO:\n   # ALTERNATIVA OBLIGATORIA\n   ENTONCES( "Tomar el desvío 🚧" )',
            },

        ],
        nextLessonId: 'Python-Fundamentos-Introducción al Pseudocódigo-4',
    },
    'Python-Fundamentos-Introducción al Pseudocódigo-4': {
        id: 'Python-Fundamentos-Introducción al Pseudocódigo-4',

        title: 'Estructura Completa',
        type: 'theory',
        instructions: 'Cómo trabajan juntos.',
        theoryBlocks: [
            {
                type: 'header',
                content: 'El Equipo Completo',
            },
            {
                type: 'text',
                content:
                    'Así se ordenan estas 3 palabras para tomar decisiones inteligentes.',
            },

            {
                type: 'mermaid',
                content: 'graph TD\nA[SI: ¿Pregunta?] -->|Verdad| B[ENTONCES: Acción A]\nA -->|Falso| C[SINO: Acción B]',
            },
            {
                type: 'code',
                language: 'python',
                content: 'SI (Pregunta)\n    ENTONCES (Acción A)\nSINO\n    (Acción B)',
            },
        ],
        // nextLessonId: 'Python-Fundamentos-Decisiones en la vida real-study',
    },
};
