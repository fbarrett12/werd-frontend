import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listWords } from "../api/words.ts";

export default function LibraryPage() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["words", search],
    queryFn: () => listWords({ q: search, limit: 50, offset: 0 }),
  });

  return (
    <div className="card">
      <h2>Library</h2>

      <div className="row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search words..."
        />
        <button className="btn secondary" onClick={() => setSearch(q.trim())}>
          Search
        </button>
        <button className="btn secondary" onClick={() => { setQ(""); setSearch(""); }}>
          Clear
        </button>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className="error">{(error as Error).message}</p>}

      <div className="list">
        {(data ?? []).map((w) => (
          <div key={w.id} className="listItem">
            <div className="listTitle">{w.text}</div>
            <div className="muted">{w.definition}</div>
            <div className="meta">
              {w.difficulty != null && <span>Difficulty: {w.difficulty}</span>}
              <span>Source: {w.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
