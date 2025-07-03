
export interface QuestionSummary {
  [key: string]: number;
}

export interface AggregatedQuestionResult {
  questionId: string;
  questionLabel: string;
  type: 'short-text' | 'long-text' | 'multiple-choice' | 'single-choice' | 'rating' | 'date';
  summary?: QuestionSummary; // Opcional para preguntas de opción/rating
  responses?: string[];      // Opcional para preguntas de texto/fecha
}


export interface SurveyAnalysisResult {
  surveyId: string;
  surveyTitle: string;
  results: AggregatedQuestionResult[]; // Un array con los resultados de cada pregunta
  totalResponsesCount: number;         // El número total de respuestas a la encuesta
}