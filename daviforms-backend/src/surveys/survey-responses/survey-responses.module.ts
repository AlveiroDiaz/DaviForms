// src/survey-responses/survey-responses.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SurveyResponsesService } from './survey-responses.service';
import { SurveyResponsesController } from './survey-responses.controller';
import { SurveyResponse, SurveyResponseSchema } from '../schemas/survey-response.schema';
import { Survey, SurveySchema } from '../schemas/survey.schema';

@Module({
  imports: [
 MongooseModule.forFeature([
      { name: SurveyResponse.name, schema: SurveyResponseSchema },
      { name: Survey.name, schema: SurveySchema },
    ]),  ],
  controllers: [SurveyResponsesController],
  providers: [SurveyResponsesService],
  exports: [SurveyResponsesService],
})
export class SurveyResponsesModule {}
