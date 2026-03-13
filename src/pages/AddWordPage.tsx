import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createWord } from "../api/words.ts";

export default function AddWordPage() {
  const [text, setText] = useState("");
  const [definition, setDefinition] = useState("");

  const mutation = useMutation({
    mutationFn: createWord,
    onSuccess: () => {
      setText("");
      setDefinition("");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      text,
      definition,
    });
  };

  return (
    <div className="card">
      <h2>Add a word</h2>

      <form onSubmit={onSubmit} className="form">
        <label>
          Word
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="finna" />
        </label>

        <label>
          Definition
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="About to do something..."
            rows={4}
          />
        </label>

        <button className="btn" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save word"}
        </button>

        {mutation.isError && (
          <p className="error">{(mutation.error as Error).message}</p>
        )}
        {mutation.isSuccess && <p className="success">Saved!</p>}
      </form>
    </div>
  );
}
