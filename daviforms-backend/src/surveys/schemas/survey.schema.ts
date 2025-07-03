import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SurveyDocument = Survey & Document;

@Schema({ timestamps: true })
export class Survey {
    @Prop({ required: true })
  title: string;

  @Prop({ type: Array, required: true })
  questions: any[];

  @Prop({ default: false })
  published: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
