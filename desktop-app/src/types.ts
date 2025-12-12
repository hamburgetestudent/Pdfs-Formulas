export interface Formula {
  concepto: string;
  formula: string;
}

export interface Question {
  question: string;
  options: string[];
  correct_option: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
}

export interface Topic {
  formulas: Formula[];
  questions: Question[];
}

export interface Category {
  [topicName: string]: Topic;
}

export interface Subject {
  [categoryName: string]: Category;
}

export interface QuizDB {
  [subjectName: string]: Subject;
}
