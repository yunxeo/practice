export interface ProfessorSummaryInput {
  professorName: string;
  department: string;
  university: string;
  reviews: Array<{
    content: string;
    ratingOverall: number;
    courseName?: string;
    semester?: string;
  }>;
  avgRating: number;
  reviewCount: number;
}

export interface AiProviderInterface {
  generateProfessorSummary(input: ProfessorSummaryInput): Promise<string>;
}

export const AI_PROVIDER = 'AI_PROVIDER';
