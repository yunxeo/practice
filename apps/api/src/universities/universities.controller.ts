import { Controller, Get, Param, Query } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { SearchUniversityDto } from './dto/search-university.dto';

@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Get()
  search(@Query() dto: SearchUniversityDto) {
    return this.universitiesService.search(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.universitiesService.findById(id);
  }

  @Get(':id/departments')
  getDepartments(@Param('id') id: string) {
    return this.universitiesService.getDepartments(id);
  }
}
