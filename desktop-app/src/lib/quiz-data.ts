/**
 * Representa una pregunta individual dentro de un cuestionario.
 */
export interface Question {
    /** Identificador único de la pregunta. */
    id: string;
    /** Texto de la pregunta. */
    text: string;
    /** Lista de opciones de respuesta. */
    options: string[];
    /** Índice de la opción correcta en la lista (basado en 0). */
    correct: number;
    /** Explicación opcional que aparece tras responder. */
    explanation?: string;
}

/**
 * Contenido educativo de una lección, incluyendo fórmulas y preguntas.
 */
export interface LessonContent {
    /** Lista de fórmulas relacionadas con la lección. */
    formulas: { latex: string; description: string }[];
    /** Lista de preguntas de evaluación. */
    questions: Question[];
}

/**
 * Estructura jerárquica de datos del cuestionario: Materia -> Unidad -> Tema -> Contenido.
 */
export interface QuizData {
    [subject: string]: {
        [unit: string]: {
            [topic: string]: LessonContent
        }
    }
}

/**
 * Base de datos principal de cuestionarios y fórmulas organizada por materias.
 */
export const QUIZ_DATA: QuizData = {
    "Física": {
        "Mecánica": {
            "Cinemática": {
                formulas: [
                    { latex: "v = \\frac{d}{t}", description: "Velocidad constante" },
                    { latex: "x = x_0 + v_0 t + \\frac{1}{2} a t^2", description: "Posición en MRUA" }
                ],
                questions: [
                    {
                        id: "cin_1",
                        text: "¿Qué representa la pendiente en una gráfica posición vs tiempo?",
                        options: ["Aceleración", "Velocidad", "Desplazamiento", "Fuerza"],
                        correct: 1,
                        explanation: "La pendiente de la gráfica x-t es la velocidad."
                    }
                ]
            },
            "Dinámica": {
                formulas: [
                    { latex: "F = ma", description: "Segunda Ley de Newton" }
                ],
                questions: [
                    {
                        id: "din_1",
                        text: "¿Cuál es la unidad de fuerza en el SI?",
                        options: ["Joule", "Watt", "Newton", "Pascal"],
                        correct: 2
                    }
                ]
            }
        },
        "Electromagnetismo": {
            "Electrostática": {
                formulas: [
                    { latex: "F = k \\frac{q_1 q_2}{r^2}", description: "Ley de Coulomb" }
                ],
                questions: []
            }
        }
    },
    "Python": {
        "Fundamentos": {
            "Algoritmos": {
                formulas: [],
                questions: []
            },
            "Bucles": {
                formulas: [],
                questions: []
            }
        },
        "Estructuras": {
            "Listas": {
                formulas: [],
                questions: []
            }
        }
    }
};
