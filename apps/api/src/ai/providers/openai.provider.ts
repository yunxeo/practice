import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProviderInterface, ProfessorSummaryInput } from '../interfaces/ai-provider.interface';

@Injectable()
export class OpenAiProvider implements AiProviderInterface {
  private readonly logger = new Logger(OpenAiProvider.name);

  constructor(private config: ConfigService) {}

  async generateProfessorSummary(input: ProfessorSummaryInput): Promise<string> {
    const apiKey = this.config.get<string>('openai.apiKey');
    const model = this.config.get<string>('openai.model') ?? 'gpt-4o-mini';

    if (!apiKey) {
      this.logger.warn('OpenAI API key not set, returning placeholder.');
      return `${input.professorName} 교수 AI 요약을 생성할 수 없습니다.`;
    }

    const reviewsText = input.reviews
      .slice(0, 10)
      .map((r, i) => `${i + 1}. [${r.ratingOverall}/5] ${r.content.slice(0, 200)}`)
      .join('\n');

    const prompt = `당신은 대학 강의 후기를 분석하는 AI 도우미입니다.
다음 교수 정보와 후기를 바탕으로 한국어 3-4문장의 객관적이고 유익한 요약을 작성하세요.

교수 정보:
- 이름: ${input.professorName}
- 소속: ${input.university} ${input.department}
- 평균 평점: ${input.avgRating.toFixed(1)}/5.0
- 총 후기 수: ${input.reviewCount}개

최근 후기:
${reviewsText}

요약은 학생들이 수강 신청 결정에 도움이 될 수 있도록 교수의 강의 스타일, 강점, 주의사항을 포함하세요.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      const json = await response.json() as {
        choices: Array<{ message: { content: string } }>;
      };
      return json.choices[0]?.message?.content?.trim() ?? '요약 생성에 실패했습니다.';
    } catch (err) {
      this.logger.error('OpenAI API call failed', err);
      return '현재 AI 요약 서비스를 이용할 수 없습니다.';
    }
  }
}
