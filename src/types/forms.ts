export type AnswerType = 'text' | 'long_text' | 'email' | 'number' | 'select' | 'checkbox';

export interface Question {
  id: number;
  question_text: string;
  answer_type: AnswerType;
  options: string[];
  hint: string | null;
  is_required: boolean;
  allow_only_positive: boolean;
  max_length: number | null;
  min_value: number | null;
  max_value: number | null;
  order: number;
}

export interface Form {
  id: number;
  name: string;
  slug: string;
  owner: number;
  requires_auth: boolean;
  is_active: boolean;
  description: string | null;
  questions: Question[];
  questions_count: number;
  answers_count: number;
  created_at: string;
  updated_at: string;
}

export interface FormListItem {
  id: number;
  name: string;
  slug: string;
  requires_auth: boolean;
  is_active: boolean;
  description: string | null;
  questions_count: number;
  answers_count: number;
  created_at: string;
  updated_at: string;
}

export interface PublicForm {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  questions: Question[];
}

export interface AnswerSubmission {
  question_id: number;
  value: string;
}

export interface FormAnswer {
  submission_id: number;
  submitted_at: string;
  submitter_id: number | null;
  answers: Record<string, string>;
}

export interface CreateQuestionData {
  id?: number;
  question_text: string;
  answer_type: AnswerType;
  options: string[];
  hint: string | null;
  is_required: boolean;
  allow_only_positive: boolean;
  max_length: number | null;
  min_value: number | null;
  max_value: number | null;
  order: number;
}

export interface CreateFormData {
  name: string;
  requires_auth: boolean;
  is_active: boolean;
  description: string | null;
}

export const ANSWER_TYPE_CHOICES: { value: AnswerType; label: string }[] = [
  { value: 'text', label: 'Texto corto' },
  { value: 'long_text', label: 'Texto largo' },
  { value: 'email', label: 'Correo electrónico' },
  { value: 'number', label: 'Número' },
  { value: 'select', label: 'Selección única' },
  { value: 'checkbox', label: 'Selección múltiple' },
];
