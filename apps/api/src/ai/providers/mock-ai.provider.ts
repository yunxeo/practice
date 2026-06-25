import { Injectable } from '@nestjs/common';
import { AiProviderInterface, ProfessorSummaryInput } from '../interfaces/ai-provider.interface';

@Injectable()
export class MockAiProvider implements AiProviderInterface {
  async generateProfessorSummary(input: ProfessorSummaryInput): Promise<string> {
    const ratingDesc =
      input.avgRating >= 4.5 ? '매우 높은 평가를 받고 있는'
      : input.avgRating >= 4.0 ? '높은 평가를 받고 있는'
      : input.avgRating >= 3.0 ? '평균적인 평가를 받고 있는'
      : '개선이 필요한';

    return (
      `${input.university} ${input.department} 소속 ${input.professorName} 교수는 ` +
      `${input.reviewCount}개의 후기를 바탕으로 ${ratingDesc} 교수입니다. ` +
      `평균 평점은 ${input.avgRating.toFixed(1)}점(5점 만점)이며, ` +
      `학생들은 강의의 전달력과 열정을 긍정적으로 평가하고 있습니다. ` +
      `(이 요약은 OpenAI 연동 전 임시 Mock 데이터입니다.)`
    );
  }
}
