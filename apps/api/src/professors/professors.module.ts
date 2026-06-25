import { Module } from '@nestjs/common';
import { ProfessorsController } from './professors.controller';
import { ProfessorsService } from './professors.service';
import { SupabaseService } from '../config/supabase.config';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [ProfessorsController],
  providers: [ProfessorsService, SupabaseService],
  exports: [ProfessorsService],
})
export class ProfessorsModule {}
