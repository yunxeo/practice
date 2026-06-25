import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { AiService } from '../ai/ai.service';
import { SearchProfessorDto } from './dto/search-professor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@Controller('professors')
export class ProfessorsController {
  constructor(
    private professorsService: ProfessorsService,
    private aiService: AiService,
  ) {}

  @Get()
  search(@Query() dto: SearchProfessorDto) {
    return this.professorsService.search(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.professorsService.findById(id);
  }

  @Get(':id/reviews')
  getReviews(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Request() req?: { user?: JwtPayload },
  ) {
    return this.professorsService.getReviews(
      id,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
      req?.user?.sub,
    );
  }

  @Get(':id/ai-summary')
  @UseGuards(JwtAuthGuard)
  getAiSummary(@Param('id') id: string) {
    return this.aiService.getProfessorSummary(id);
  }
}
