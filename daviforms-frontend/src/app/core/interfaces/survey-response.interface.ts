// src/app/core/interfaces/survey-response.interface.ts

/** Respuesta a una sola pregunta */
export interface SurveyAnswer {
  questionId: string;
  answer: string | string[] | number;
}

export interface SurveyRequest {
  surveyId: string;
  submittedAt?: string;
  answers: SurveyAnswer[];
}
