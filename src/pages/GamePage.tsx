import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Choice, Question, QuizMode } from "../api/types";
import { createQuestion, createSession, submitAnswer } from "../api/game";

function choiceLabel(q: Question, c: Choice) {
  return q.mode === "def_to_word" ? (c.text ?? "") : (c.definition ?? "");
}

export default function GamePage() {
  const [mode, setMode] = useState<QuizMode>("def_to_word");
  const [difficulty, setDifficulty] = useState<number | "">("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sessionMutation = useMutation({ mutationFn: createSession });
  const questionMutation = useMutation({ mutationFn: createQuestion });
  const answerMutation = useMutation({ mutationFn: (args: { sessionId: string; attemptId: string; wordId: string }) =>
    submitAnswer(args.sessionId, { attempt_id: args.attemptId, selected_word_id: args.wordId })
  });

  const score = answerMutation.data?.score ?? 0;
  const streak = answerMutation.data?.streak ?? 0;

  async function start() {
    setFeedback(null);
    setLocked(false);
    setQuestion(null);

    const session = await sessionMutation.mutateAsync({
      mode,
      difficulty: difficulty === "" ? null : difficulty,
    });

    setSessionId(session.id);

    const q = await questionMutation.mutateAsync(session.id);
    setQuestion(q);
  }

  async function nextQuestion() {
    if (!sessionId) return;
    setFeedback(null);
    setLocked(false);
    const q = await questionMutation.mutateAsync(sessionId);
    setQuestion(q);
  }

  async function pickChoice(c: Choice) {
    if (!sessionId || !question || locked) return;
    setLocked(true);

    const res = await answerMutation.mutateAsync({
      sessionId,
      attemptId: question.attempt_id,
      wordId: c.word_id,
    });

    setFeedback(res.correct ? "✅ Correct!" : `❌ Nope. It was "${res.correct_text}".`);
  }

  // Start a session on first visit (optional)
  useEffect(() => {
    // comment this out if you prefer manual start
  }, []);

  const promptTitle = useMemo(() => {
    if (!question) return "";
    return question.mode === "def_to_word" ? "Guess the word" : "Guess the definition";
  }, [question]);

  return (
    <div className="card">
      <h2>Game</h2>

      <div className="row wrap">
        <label className="inline">
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value as QuizMode)}>
            <option value="def_to_word">Definition → Word</option>
            <option value="word_to_def">Word → Definition</option>
          </select>
        </label>

        <label className="inline">
          Difficulty:
          <input
            type="number"
            min={1}
            max={10}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="optional"
          />
        </label>

        <button className="btn" onClick={start} disabled={sessionMutation.isPending || questionMutation.isPending}>
          Start
        </button>

        {sessionId && (
          <button className="btn secondary" onClick={nextQuestion} disabled={questionMutation.isPending}>
            Next
          </button>
        )}
      </div>

      <div className="row">
        <div className="pill">Score: {score}</div>
        <div className="pill">Streak: {streak}</div>
      </div>

      {(sessionMutation.isError || questionMutation.isError || answerMutation.isError) && (
        <p className="error">
          {(sessionMutation.error as Error)?.message ||
            (questionMutation.error as Error)?.message ||
            (answerMutation.error as Error)?.message}
        </p>
      )}

      {!question ? (
        <p className="muted">Start a game to get a question.</p>
      ) : (
        <>
          <div className="prompt">
            <div className="muted">{promptTitle}</div>
            <div className="promptText">{question.prompt}</div>
          </div>

          <div className="grid">
            {question.choices.map((c) => (
              <button
                key={c.word_id}
                className="choice"
                onClick={() => pickChoice(c)}
                disabled={locked || answerMutation.isPending}
              >
                {choiceLabel(question, c)}
              </button>
            ))}
          </div>

          {feedback && <div className="feedback">{feedback}</div>}
        </>
      )}
    </div>
  );
}
