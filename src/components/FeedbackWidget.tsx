"use client";

import { useState } from "react";

type Props = {
  reportId: string;
  sectionId?: string;
};

export default function FeedbackWidget({ reportId, sectionId }: Props) {
  const [sentiment, setSentiment] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function submit() {
    if (!sentiment) return;
    try {
      setStatus("submitting");
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reportId, sectionId, sentiment, comment })
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") return (
    <div className="text-center p-4">
      <p className="text-gray-600">✓ Thanks for your feedback on this report!</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-dim-gray p-6 bg-champagne-pink/30">
      <h3 className="text-lg font-semibold mb-2 text-davy-gray">Report Feedback</h3>
      <p className="mb-4 text-sm text-dim-gray">Was this report helpful?</p>
      <div className="mb-3 flex gap-2">
        <button
          aria-label="Thumbs up"
          className={`rounded-xl border border-dim-gray px-3 py-1 hover:bg-champagne-pink/70 ${sentiment === "up" ? "bg-champagne-pink border-cinnabar" : "bg-white"}`}
          onClick={() => setSentiment("up")}
        >
          👍
        </button>
        <button
          aria-label="Thumbs down"
          className={`rounded-xl border border-dim-gray px-3 py-1 hover:bg-champagne-pink/70 ${sentiment === "down" ? "bg-champagne-pink border-cinnabar" : "bg-white"}`}
          onClick={() => setSentiment("down")}
        >
          👎
        </button>
      </div>
      <textarea
        className="w-full rounded-xl border border-dim-gray p-3 text-sm bg-white focus:border-cinnabar focus:outline-none"
        placeholder="Optional: How can we improve this report? Any suggestions or missing information?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={submit}
          disabled={!sentiment || status === "submitting"}
          className="rounded-xl border border-davy-gray bg-davy-gray text-white px-4 py-2 hover:bg-dim-gray disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Submitting…" : "Submit"}
        </button>
        {status === "error" ? <span className="text-sm text-cinnabar">Error. Try again.</span> : null}
      </div>
    </div>
  );
}