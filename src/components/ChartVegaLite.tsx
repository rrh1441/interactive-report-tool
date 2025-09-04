"use client";

import { useEffect, useRef } from "react";
import embed, { type VisualizationSpec, type Result } from "vega-embed";
import type { ChartVegaLite } from "@/types/report";

type Props = { chart: ChartVegaLite };

export default function ChartVegaLiteComp({ chart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<import("vega-typings").View | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Snapshot the element for cleanup to avoid ref drift warnings
    const containerEl = containerRef.current;

    // Clear any previous embed (important for React StrictMode double effects)
    if (viewRef.current) {
      try {
        viewRef.current.finalize();
      } catch {}
      viewRef.current = null;
    }
    containerEl.innerHTML = "";

    // Merge data so we preserve any format/parse in the spec
    const baseSpec = chart.spec as unknown as VisualizationSpec;
    let dataProp: VisualizationSpec["data"];
    if (Array.isArray(baseSpec.data)) {
      // If multiple named datasets are provided, do not override
      dataProp = baseSpec.data;
    } else if (typeof baseSpec.data === "object" && baseSpec.data) {
      dataProp = { ...((baseSpec.data as unknown) as Record<string, unknown>), url: chart.data.src } as any;
    } else {
      dataProp = { url: chart.data.src } as any;
    }

    const spec: VisualizationSpec = ({
      ...(baseSpec as any),
      data: dataProp,
    } as unknown) as VisualizationSpec;

    let cancelled = false;
    embed(containerEl, spec, { actions: false })
      .then((res: Result) => {
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
      containerEl.innerHTML = "";
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
