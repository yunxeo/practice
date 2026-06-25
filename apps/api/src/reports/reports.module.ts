import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { SupabaseService } from '../config/supabase.config';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, SupabaseService],
})
export class ReportsModule {}
