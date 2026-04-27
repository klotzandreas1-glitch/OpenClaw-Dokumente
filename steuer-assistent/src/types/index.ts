export type FieldType =
  | 'yesno'
  | 'text'
  | 'number'
  | 'currency'
  | 'select'
  | 'multiselect'
  | 'info';

export interface FollowUp {
  whenValue: string | boolean | string[];
  questions: Question[];
}

export interface Question {
  id: string;
  label: string;
  hint?: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  followUps?: FollowUp[];
  unit?: string;
}

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  questions: Question[];
}

export type Answers = Record<string, string | boolean | string[] | number>;
