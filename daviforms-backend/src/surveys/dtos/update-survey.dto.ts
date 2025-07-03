// src/surveys/dto/create-survey.dto.ts
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateSurveyOptionDto {
  @IsString()
  id: string;

  @IsString()
  value: string;
}

class UpdateSurveyQuestionDto {
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
  @Type(() => UpdateSurveyOptionDto)
  options?: UpdateSurveyOptionDto[];

  @IsOptional()
  ratingMax?: number;

  @IsOptional()
  required?: boolean;
}

export class UpdateSurveyDto {
    @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSurveyQuestionDto)
  questions: UpdateSurveyQuestionDto[];
}
