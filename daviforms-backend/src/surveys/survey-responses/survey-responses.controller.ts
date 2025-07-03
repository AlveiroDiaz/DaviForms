// src/survey-responses/survey-responses.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { SurveyResponsesService } from './survey-responses.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateSurveyResponseDto } from '../dtos/create-survey-response.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AggregatedSurveyResultsDto } from '../dtos/aggregated-results.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';


@Controller('survey-responses')
export class SurveyResponsesController {
  constructor(
    private readonly responsesService: SurveyResponsesService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateSurveyResponseDto,
    @Req() req: RequestWithUser,
  ) {
    // Inyecta userId y submittedAt desde el JWT y servidor
    dto.submittedAt = new Date().toISOString();
    return this.responsesService.create(dto);
  }

  @Get('survey/:surveyId')
  @UseGuards(JwtAuthGuard)
  findBySurvey(@Param('surveyId') surveyId: string) {
    return this.responsesService.findAllBySurvey(surveyId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  findByUser(@Req() req: RequestWithUser) {
    return this.responsesService.findAllByUser(req.user.userId);
  }


  @Get(':id') // <<-- CAMBIO AQUÍ: Ruta simplificada a solo '/:id'
  @UseGuards(JwtAuthGuard) // <<-- AÑADIDO: Usa el guard de autenticación JWT
  @ApiOperation({ summary: 'Obtener resultados agregados para una encuesta específica' })
  @ApiParam({
    name: 'id', // <<-- CAMBIO AQUÍ: Nombre del parámetro a 'id'
    description: 'ID de la encuesta a analizar',
    type: 'string',
    examples: { a: { value: '686612bbcc75788ddb8b5933 ', description: 'ID de ejemplo de encuesta' } }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultados de la encuesta agregados exitosamente',
    type: AggregatedSurveyResultsDto
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Encuesta no encontrada' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error del servidor' })
  async getAggregatedSurveyResults( // Mantengo el nombre del método para mayor claridad
    @Param('id', ParseObjectIdPipe) id: string, // <<-- CAMBIO AQUÍ: Nombre del parámetro a 'id'
  ): Promise<AggregatedSurveyResultsDto> {
    // Llama al servicio con el ID de la encuesta
    console.log(`Obteniendo resultados agregados para la encuesta ID: ${id}`);
    return this.responsesService.getSurveyResults(id);
  }

  
}
