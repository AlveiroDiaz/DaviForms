import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Survey, SurveyResponse } from '../interfaces/survey.interface';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

   ping(): Observable<any> {
      return this.http.get(`${this.apiUrl}`);
    }

    createSurvey(survey: Survey): Observable<any> {
      return this.http.post(`${this.apiUrl}/surveys`, survey);
    }

    getSurveys(): Observable<SurveyResponse[]> {
    return this.http.get<SurveyResponse[]>(`${this.apiUrl}/surveys`);
  }

    getSurveysById(id: string): Observable<SurveyResponse> {
    return this.http.get<SurveyResponse>(`${this.apiUrl}/surveys/${id}`);
  }

  updateSurvey(id: string, survey: Survey): Observable<SurveyResponse> {
    return this.http.put<SurveyResponse>(`${this.apiUrl}/surveys/${id}`, survey);
  }
  
  deleteSurvey(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/surveys/${id}`);
  }
}
