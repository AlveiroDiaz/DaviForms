import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponsesController } from './survey-responses.controller';

describe('SurveyResponsesController', () => {
  let controller: SurveyResponsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyResponsesController],
    }).compile();

    controller = module.get<SurveyResponsesController>(SurveyResponsesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
