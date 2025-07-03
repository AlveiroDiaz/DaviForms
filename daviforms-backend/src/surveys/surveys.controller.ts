import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dtos/create-survey.dto';
import { UpdateSurveyDto } from './dtos/update-survey.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { log } from 'console';


@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateSurveyDto,
    @Req() req: RequestWithUser
  ) {
    // inyectamos el userId desde el JWT, que Passport ha añadido a req.user
    const survey = await this.surveysService.create({
      ...dto,
      userId: req.user.userId
    });
    return survey;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: RequestWithUser) {
    return this.surveysService.findAllByUserWithResponseCount(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveysService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    console.log('Updating survey with ID:', id, 'with data:', updateSurveyDto);
    return this.surveysService.update(id, updateSurveyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.surveysService.remove(id);
  }

  
}