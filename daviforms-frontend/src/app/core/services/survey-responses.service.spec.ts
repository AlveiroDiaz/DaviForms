import { TestBed } from '@angular/core/testing';

import { SurveyResponsesService } from './survey-responses.service';

describe('SurveyResponsesService', () => {
  let service: SurveyResponsesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyResponsesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
