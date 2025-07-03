import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Survey, SurveyDocument } from './schemas/survey.schema';
import { CreateSurveyDto } from './dtos/create-survey.dto';
import { UpdateSurveyDto } from './dtos/update-survey.dto';
import { SurveyResponsesService } from './survey-responses/survey-responses.service';


@Injectable()
export class SurveysService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<SurveyDocument>,
    private responsesService: SurveyResponsesService
  ) {}
  async create(data: CreateSurveyDto & { userId: string }) {
    const created = new this.surveyModel(data);
    return created.save();
  }

  async findAll(): Promise<Survey[]> {
    return this.surveyModel.find();
  }

  async findAllByUserWithResponseCount(userId: string) {
    const surveys = await this.surveyModel.find({ userId }).exec();

    return Promise.all(
      surveys.map(async (s) => {
        // forzamos a Types.ObjectId para poder llamar toString()
        const surveyId = (s._id as Types.ObjectId).toString();
        const count = await this.responsesService.countBySurvey(surveyId);
        // toObject() elimina métodos de Mongoose y deja solo propiedades
        return {
          ...s.toObject(),
          responseCount: count,
        };
      })
    );
  }

  async findOne(id: string): Promise<Survey> {
    const survey = await this.surveyModel.findById(id);
    if (!survey) {
      throw new NotFoundException('Encuesta no encontrada');
    }
    return survey;
  }

  async update(id: string, updateSurveyDto: UpdateSurveyDto): Promise<Survey> {
    const updatedSurvey = await this.surveyModel.findByIdAndUpdate(id, updateSurveyDto, { new: true });
    if (!updatedSurvey) {
      throw new NotFoundException('Encuesta no encontrada');
    }
    return updatedSurvey;
  }

  async remove(id: string): Promise<void> {
    await this.surveyModel.findByIdAndDelete(id);
  }
}
