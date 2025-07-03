import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSurveys } from './manage-surveys';

describe('ManageSurveys', () => {
  let component: ManageSurveys;
  let fixture: ComponentFixture<ManageSurveys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSurveys]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSurveys);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
