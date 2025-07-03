// src/survey-responses/schemas/survey-response.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SurveyResponseDocument = SurveyResponse & Document;

@Schema({ timestamps: { createdAt: 'submittedAt' } })
export class SurveyResponse {
  @Prop({ type: Types.ObjectId, ref: 'Survey', required: true })
  surveyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ required: true, type: Array })
  answers: {
    questionId: string;
    answer: string | string[] | number;
  }[];
}

export const SurveyResponseSchema = SchemaFactory.createForClass(SurveyResponse);
