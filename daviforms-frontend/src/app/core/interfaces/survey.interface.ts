
export interface SurveyOption {
  id: string;
  value: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'short-text' | 'long-text' | 'multiple-choice' | 'single-choice' | 'rating' | 'date';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: SurveyOption[];
  ratingMax?: number;
}

export interface Survey {
  id?: string; // opcional si lo genera el backend
  title: string;
  questions: SurveyQuestion[];
}

// src/app/core/interfaces/survey.interface.ts
export interface SurveyResponse {
  _id: string;
  title: string;
  questions: any[];
  published: boolean;
  createdAt: string; // ISO date
  updatedAt: string;
  userId: string;
  status: 'draft' | 'published' | 'archived'; // Estado de la encuesta
  showActionsMenu: boolean;
  responseCount?: number;
  
}
