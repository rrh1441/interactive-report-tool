"use client";

import { useEffect, useRef } from "react";
import * as vegaEmbed from "vega-embed";
import type { ChartVegaLite } from "@/types/report";

type Props = { chart: ChartVegaLite };

export default function ChartVegaLiteComp({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const spec = {
        ...chart.spec,
        data: { url: chart.data.src }
      };
      
      vegaEmbed.default(ref.current, spec, { actions: false })
        .catch(console.error);
    }
  }, [chart.spec, chart.data.src]);

  return (
    <figure className="my-8">
      <div ref={ref} className="w-full" />
      {chart.description && (
        <figcaption className="mt-4 text-sm text-gray-600 text-center italic">
          {chart.description}
        </figcaption>
      )}
    </figure>
  );
}