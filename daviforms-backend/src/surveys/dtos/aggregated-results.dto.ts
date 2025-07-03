// src/survey-responses/dto/aggregated-results.dto.ts
// (Estos son los mismos que te di antes, solo para referencia)

export class QuestionSummaryDto {
  [key: string]: number;
}

export class AggregatedQuestionResultDto {
  questionId: string;
  questionLabel: string;
  type: 'short-text' | 'long-text' | 'multiple-choice' | 'single-choice' | 'rating' | 'date';
  summary?: QuestionSummaryDto;
  responses?: string[];
}

export class AggregatedSurveyResultsDto {
  surveyId: string;
  surveyTitle: string;
  results: AggregatedQuestionResultDto[];
  totalResponsesCount: number;
}