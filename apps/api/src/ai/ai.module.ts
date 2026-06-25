import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import { AI_PROVIDER } from './interfaces/ai-provider.interface';
import { OpenAiProvider } from './providers/openai.provider';
import { MockAiProvider } from './providers/mock-ai.provider';
import { SupabaseService } from '../config/supabase.config';

@Module({
  imports: [ConfigModule],
  providers: [
    AiService,
    SupabaseService,
    {
      provide: AI_PROVIDER,
      useFactory: (config: ConfigService) => {
        const apiKey = config.get<string>('openai.apiKey');
        return apiKey ? new OpenAiProvider(config) : new MockAiProvider();
      },
      inject: [ConfigService],
    },
  ],
  exports: [AiService],
})
export class AiModule {}
