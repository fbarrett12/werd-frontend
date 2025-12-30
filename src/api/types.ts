export type Word = {
  id: string;
  text: string;
  definition: string;
  part_of_speech?: string | null;
  difficulty?: number | null;
  approved: boolean;
  source: string;
};

export type QuizMode = "def_to_word" | "word_to_def";

export type Session = {
  id: string;
  device_id: string;
  mode: QuizMode;
  difficulty?: number | null;
  score: number;
  streak: number;
};

export type Choice = {
  word_id: string;
  text?: string | null;
  definition?: string | null;
};

export type Question = {
  attempt_id: string;
  session_id: string;
  mode: QuizMode;
  prompt: string;
  choices: Choice[];
};

export type AnswerResult = {
  correct: boolean;
  correct_word_id: string;
  correct_text: string;
  correct_definition: string;
  score: number;
  streak: number;
};
