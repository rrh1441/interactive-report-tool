"use client";

import { VegaEmbed } from "react-vega";
import type { ChartVegaLite } from "@/types/report";

type Props = { chart: ChartVegaLite };

export default function ChartVegaLiteComp({ chart }: Props) {
  // Patch the spec to include the data URL
  const patchedSpec = {
    ...chart.spec,
    data: { url: chart.data.src }
  };

  return (
    <figure className="my-8">
      <VegaEmbed 
        spec={patchedSpec} 
        options={{ actions: false }}
      />
      {chart.description ? (
        <figcaption className="mt-4 text-sm text-gray-600 text-center italic">
          {chart.description}
        </figcaption>
      ) : null}
    </figure>
  );
}