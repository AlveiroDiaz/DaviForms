import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from './schemas/survey.schema';
import { SurveyResponsesModule } from './survey-responses/survey-responses.module';

@Module({
 imports: [
    MongooseModule.forFeature([{ name: Survey.name, schema: SurveySchema }]),
    SurveyResponsesModule, 
  ],  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService],
})
export class SurveysModule {}
