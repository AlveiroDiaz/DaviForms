// src/surveys/dto/create-survey.dto.ts
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SurveyOptionDto {
  @IsString()
  id: string;

  @IsString()
  value: string;
}

class SurveyQuestionDto {
  @IsString()
  id: string;

  @IsString()
  type: 'short-text' | 'long-text' | 'multiple-choice' | 'single-choice' | 'rating' | 'date';

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyOptionDto)
  options?: SurveyOptionDto[];

  @IsOptional()
  ratingMax?: number;

  @IsOptional()
  required?: boolean;
}

export class CreateSurveyDto {
    @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurveyQuestionDto)
  questions: SurveyQuestionDto[];
}
