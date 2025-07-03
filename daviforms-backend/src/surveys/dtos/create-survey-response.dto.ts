import {
  IsArray,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsString()
  questionId: string;

  @IsOptional()
  answer: string; // o usa validaciones más complejas según tipo
}

export class CreateSurveyResponseDto {
  @IsString()
  surveyId: string;        // si tu surveyId no es ObjectId

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
