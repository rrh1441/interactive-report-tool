"use client";

import { useEffect, useRef } from "react";
import * as vegaEmbed from "vega-embed";
import type { ChartVegaLite } from "@/types/report";

type Props = { chart: ChartVegaLite };

export default function ChartVegaLiteComp({ chart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<import("vega-typings").View | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous embed (important for React StrictMode double effects)
    if (viewRef.current) {
      try {
        viewRef.current.finalize();
      } catch {}
      viewRef.current = null;
    }
    containerRef.current.innerHTML = "";

    // Merge data so we preserve any format/parse in the spec
    const existingData = (chart.spec as any)?.data ?? {};
    const spec = {
      ...chart.spec,
      data: { ...existingData, url: chart.data.src },
    } as any;

    let cancelled = false;
    vegaEmbed.default(containerRef.current, spec, { actions: false })
      .then((res) => {
        if (cancelled) return;
        viewRef.current = res.view;
      })
      .catch(console.error);

    return () => {
      cancelled = true;
      if (viewRef.current) {
        try {
          viewRef.current.finalize();
        } catch {}
        viewRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [chart.spec, chart.data.src]);

  return (
    <figure className="my-8">
      <div ref={containerRef} className="w-full" />
      {chart.description && (
        <figcaption className="mt-4 text-sm text-gray-600 text-center italic">
          {chart.description}
        </figcaption>
      )}
    </figure>
  );
}
