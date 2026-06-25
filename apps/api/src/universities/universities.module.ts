import { Module } from '@nestjs/common';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';
import { SupabaseService } from '../config/supabase.config';

@Module({
  controllers: [UniversitiesController],
  providers: [UniversitiesService, SupabaseService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
