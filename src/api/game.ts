import { apiFetch } from "./client";
import type { AnswerResult, Question, QuizMode, Session } from "./types";

export function createSession(input: {
  mode: QuizMode;
  difficulty?: number | null;
}): Promise<Session> {
  return apiFetch<Session>("/api/sessions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function createQuestion(sessionId: string): Promise<Question> {
  return apiFetch<Question>(`/api/sessions/${sessionId}/question`, {
    method: "POST",
  });
}

export function submitAnswer(sessionId: string, input: {
  attempt_id: string;
  selected_word_id: string;
}): Promise<AnswerResult> {
  return apiFetch<AnswerResult>(`/api/sessions/${sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
