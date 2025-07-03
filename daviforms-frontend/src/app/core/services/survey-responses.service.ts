import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SurveyResponse } from '../interfaces/survey.interface';
import { SurveyRequest } from '../interfaces/survey-response.interface';
import { Observable } from 'rxjs';
import { AggregatedQuestionResult, SurveyAnalysisResult } from '../interfaces/survey-analysis.interface';

@Injectable({
  providedIn: 'root'
})
export class SurveyResponsesService {

private apiUrl = 'http://localhost:3000/survey-responses/';
  constructor(private http: HttpClient) { }

  createResponse(response: SurveyRequest): Observable<SurveyResponse> {
    return this.http.post<SurveyResponse>(`${this.apiUrl}`, response);
  }

  getResponsesBySurvey(surveyId: string): Observable<SurveyAnalysisResult> {
    return this.http.get<SurveyAnalysisResult>(`${this.apiUrl}${surveyId}`);
  }

}
