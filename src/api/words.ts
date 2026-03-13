import { apiFetch } from "./client";
import type { Word } from "./types";

export function createWord(input: {
  text: string;
  definition: string;
  part_of_speech?: string | null;
}): Promise<Word> {
  return apiFetch<Word>("/api/words", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listWords(params: {
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<Word[]> {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.offset != null) sp.set("offset", String(params.offset));
  return apiFetch<Word[]>(`/api/words?${sp.toString()}`);
}
