// src/survey-responses/survey-responses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SurveyResponse, SurveyResponseDocument } from '../schemas/survey-response.schema';
import { CreateSurveyResponseDto } from '../dtos/create-survey-response.dto';
import { AggregatedQuestionResultDto, AggregatedSurveyResultsDto } from '../dtos/aggregated-results.dto';
import { Survey, SurveyDocument } from '../schemas/survey.schema';
import { log } from 'console';



@Injectable()
export class SurveyResponsesService {
constructor(
    @InjectModel(SurveyResponse.name) private responseModel: Model<SurveyResponseDocument>, // Primer parámetro, primer modelo
    @InjectModel(Survey.name) private surveyModel: Model<SurveyDocument>, // Segundo parámetro, segundo modelo
  ) {}

   async create(dto: CreateSurveyResponseDto): Promise<SurveyResponse> {
    // <<-- ¡LA CORRECCIÓN ESTÁ AQUÍ! -->>
    // Convertimos explícitamente surveyId a Types.ObjectId antes de crear el documento
    const surveyIdAsObjectId = new Types.ObjectId(dto.surveyId);

    const created = new this.responseModel({
      ...dto,
      surveyId: surveyIdAsObjectId,
    });
    return created.save();
  }
  async findAllBySurvey(surveyId: string): Promise<SurveyResponse[]> {
    return this.responseModel.find({ surveyId }).exec();
  }

  async findAllByUser(userId: string): Promise<SurveyResponse[]> {
    return this.responseModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<SurveyResponse> {
    const resp = await this.responseModel.findById(id).exec();
    if (!resp) throw new NotFoundException('Respuesta no encontrada');
    return resp;
  }

  async countBySurvey(surveyId: string): Promise<number> {
    const surveyIdAsObjectId = new Types.ObjectId(surveyId);

  return this.responseModel.countDocuments({ surveyId: surveyIdAsObjectId }).exec();
}

async getSurveyResults(surveyId: string): Promise<AggregatedSurveyResultsDto> {
    const surveyObjectId = new Types.ObjectId(surveyId);
    log(`Obteniendo resultados agregados para la encuesta ID: ${surveyObjectId}`);

    // 1. Obtener la encuesta para conocer sus preguntas y tipos (NECESARIO)
    const survey = await this.surveyModel.findById(surveyObjectId).exec();

    console.log("survey", survey)
    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${surveyId} no encontrada.`);
    }

    // Mapear preguntas por su ID para fácil acceso (optimiza el bucle de respuestas)
    const questionsMap = new Map<string, { label: string; type: string; options?: string[] }>();
    survey.questions.forEach(q => {
        
      questionsMap.set(q.id.toString(), {
        label: q.label,
        type: q.type,
        options: q.options
      });
    });

    // 2. Obtener todas las respuestas para esta encuesta
    console.log(`Obteniendo respuestas para la encuesta ID: ${surveyId}`);
    const responses = await this.responseModel.find({ surveyId: surveyObjectId }).exec(); // <-- ¡USA surveyObjectId AQUÍ!

    console.log("responses", responses);
    
    const totalResponsesCount = responses.length;

    if (totalResponsesCount === 0) {
        return {
            surveyId: surveyId,
            surveyTitle: survey.title,
            results: [],
            totalResponsesCount: 0
        };
    }

    // 3. Procesar y agregar las respuestas (la lógica "larga" pero necesaria)
    const aggregatedResults: Map<string, AggregatedQuestionResultDto> = new Map();

    responses.forEach(response => {
      response.answers.forEach(answer => {
        const questionInfo = questionsMap.get(answer.questionId);

        if (!questionInfo) {
          console.warn(`Pregunta con ID ${answer.questionId} no encontrada en la definición de la encuesta.`);
          return;
        }

        let questionResult = aggregatedResults.get(answer.questionId);
        if (!questionResult) {
          questionResult = {
            questionId: answer.questionId,
            questionLabel: questionInfo.label,
            type: questionInfo.type as any,
            summary: {},
            responses: []
          };
          aggregatedResults.set(answer.questionId, questionResult);
        }

        switch (questionInfo.type) {
          case 'single-choice':
          case 'rating':
            const value = String(answer.answer);
            if (questionResult.summary) {
              questionResult.summary[value] = (questionResult.summary[value] || 0) + 1;
            }
            break;
          case 'multiple-choice':
            if (Array.isArray(answer.answer) && questionResult.summary) {
              answer.answer.forEach(opt => {
                questionResult.summary![String(opt)] = (questionResult.summary![String(opt)] || 0) + 1;
              });
            }
            break;
          case 'short-text':
          case 'long-text':
          case 'date':
            if (typeof answer.answer === 'string' && questionResult.responses) {
              questionResult.responses.push(answer.answer);
            }
            break;
          default:
            console.warn(`Tipo de pregunta no soportado para agregación: ${questionInfo.type}`);
        }
      });
    });

    // 4. Formatear el resultado final y limpiar propiedades no usadas
    const resultsArray: AggregatedQuestionResultDto[] = Array.from(aggregatedResults.values()).map(result => {
        if (result.type === 'short-text' || result.type === 'long-text' || result.type === 'date') {
            delete result.summary; // No tiene sentido el summary para texto/fecha
        } else {
            delete result.responses; // No tiene sentido las respuestas individuales para opciones/ratings
        }
        return result;
    });

    return {
      surveyId: surveyId,
      surveyTitle: survey.title,
      results: resultsArray,
      totalResponsesCount: totalResponsesCount
    };
  }
}
