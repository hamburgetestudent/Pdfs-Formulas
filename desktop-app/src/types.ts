/**
 * Representa una fórmula física con su concepto asociado.
 */
export interface Formula {
  /** El nombre o descripción del concepto físico (ej. "Fuerza"). */
  concepto: string;
  /** La expresión matemática de la fórmula en LaTeX o texto plano. */
  formula: string;
}

/**
 * Representa una pregunta de cuestionario.
 */
export interface Question {
  /** El texto de la pregunta. */
  question: string;
  /** Lista de opciones de respuesta posibles. */
  options: string[];
  /** La opción correcta (debe coincidir exactamente con una de las opciones). */
  correct_option: string;
  /** El nivel de dificultad de la pregunta. */
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
}

/**
 * Representa un tema específico dentro de una categoría, conteniendo fórmulas y preguntas.
 */
export interface Topic {
  /** Lista de fórmulas asociadas al tema. */
  formulas: Formula[];
  /** Lista de preguntas asociadas al tema. */
  questions: Question[];
}

/**
 * Representa una categoría de temas (ej. "Cinemática").
 * Mapea nombres de temas a objetos Topic.
 */
export interface Category {
  [topicName: string]: Topic;
}

/**
 * Representa una materia o área principal (ej. "Física Clásica").
 * Mapea nombres de categorías a objetos Category.
 */
export interface Subject {
  [categoryName: string]: Category;
}

/**
 * Estructura completa de la base de datos de cuestionarios.
 * Mapea nombres de materias a objetos Subject.
 */
export interface QuizDB {
  [subjectName: string]: Subject;
}

/**
 * Tipo de lección disponible en la aplicación.
 * - 'simulation': Simulación interactiva.
 * - 'quiz': Cuestionario simple.
 * - 'theory': Contenido teórico rico.
 * - 'drag_drop': Ejercicio de ordenar arrastrando y soltando.
 */
export type LessonType = 'simulation' | 'quiz' | 'theory' | 'drag_drop';

/**
 * Interfaz principal que define el contenido de una lección.
 */
export interface LessonContent {
  /** Identificador único de la lección. */
  id: string;
  /** Título de la lección. */
  title: string;
  /** Tipo de lección. */
  type: LessonType;
  /** Instrucciones para el usuario. */
  instructions: string;

  // Configuración para el tipo 'simulation'
  /** Configuración específica para simulaciones. */
  simulationConfig?: {
    type: 'rocket_launch' | 'projectile_motion' | 'free_fall' | 'message_send' | 'boolean_playground' | 'algorithm_repair';
    initialCode: string;
    verifyFunction: (userValue: any) => boolean;
    successMessage: string;
    errorMessage: string;
    options: { label: string; value: any; code: string }[];
  };

  // Configuración para el tipo 'quiz'
  /** Configuración específica para cuestionarios simples. */
  quizConfig?: {
    question: string;
    options: { id: string; text: string; correct: boolean }[];
    successMessage: string;
    errorMessage: string;
  };

  // Configuración para el tipo 'drag_drop' (Sequence Builder)
  /** Configuración específica para ejercicios de arrastrar y soltar. */
  dragDropConfig?: {
    items: {
      id: string;
      text: string;
      shape?: 'oval' | 'rectangle' | 'diamond';
      color?: 'green' | 'blue' | 'orange' | 'amber';
    }[]; // Pool of items
    correctSequence: string[]; // IDs in correct order
    trapId?: string; // ID of the trap card
    trapMessage?: string; // Message if trap is used/placed first
    successMessage: string;
    errorMessage: string;
  };

  // Configuración para el tipo 'theory'
  /** Bloques de contenido para lecciones teóricas. */
  theoryBlocks?: {
    type: 'text' | 'list' | 'alert' | 'header' | 'checklist' | 'true_false' | 'image' | 'code' | 'mermaid' | 'flowchart';
    content: string | string[]; // For true_false, content is the statement
    style?: 'warning' | 'info';
    answer?: boolean; // For true_false
    trueLabel?: string; // Custom label for 'True' option
    falseLabel?: string; // Custom label for 'False' option
    caption?: string; // For image type
    language?: string; // For code type
    shape?: 'oval' | 'rectangle' | 'diamond'; // For flowchart type
    color?: 'green' | 'blue' | 'orange' | 'amber'; // For flowchart type
  }[];
  /** @deprecated Contenido de teoría legado (cadena simple). */
  theoryContent?: string; // Legacy
  /** ID de la siguiente lección en la secuencia. */
  nextLessonId?: string;
}
