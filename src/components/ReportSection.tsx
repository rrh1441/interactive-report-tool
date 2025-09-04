"use client";

import type { Section, TextBlock } from "@/types/report";
import ChartVegaLiteComp from "./ChartVegaLite";

function TextRenderer({ block }: { block: TextBlock }) {
  if (block.type === "p") {
    // Handle markdown bold syntax with dangerouslySetInnerHTML to avoid React serialization issues
    const htmlText = block.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    return (
      <p 
        className="mb-4 leading-7" 
        dangerouslySetInnerHTML={{ __html: htmlText }}
      />
    );
  }
  if (block.type === "callout") {
    const tone =
      block.variant === "warning"
        ? "border-cinnabar bg-champagne-pink/50"
        : block.variant === "success"
        ? "border-emerald-500 bg-champagne-pink/30"
        : "border-dim-gray bg-gray-100/80";
    return (
      <div className={`mb-4 rounded-xl border px-4 py-3 ${tone}`}>
        <p className="text-sm">{block.text}</p>
      </div>
    );
  }
  return null;
}

export default function ReportSection({ section }: { section: Section }) {
  return (
    <section id={section.id} className="py-6">
      <h2 className="scroll-mt-24 text-2xl font-semibold">{section.title}</h2>
      {section.body?.map((b, i) => <TextRenderer key={i} block={b} />)}
      {section.charts?.map((c) => (
        <ChartVegaLiteComp key={c.id} chart={c} />
      ))}
    </section>
  );
}