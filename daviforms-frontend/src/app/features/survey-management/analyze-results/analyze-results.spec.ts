import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeResults } from './analyze-results';

describe('AnalyzeResults', () => {
  let component: AnalyzeResults;
  let fixture: ComponentFixture<AnalyzeResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyzeResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyzeResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
