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
  difficulty: "Fácil" | "Medio" | "Difícil";
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
