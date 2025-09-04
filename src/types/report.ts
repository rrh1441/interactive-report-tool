export type TextBlock =
  | { type: "p"; text: string }
  | { type: "callout"; variant: "info" | "warning" | "success"; text: string };

export type ChartVegaLite = {
  id: string;
  type: "vegaLite";
  data: { src: string };          // CSV/JSON URL under /public or remote
  spec: Record<string, unknown>;  // raw vega-lite JSON
  description?: string;
};

export type Section = {
  id: string;
  title: string;
  body?: TextBlock[];
  charts?: ChartVegaLite[];
};

export type ReportSpec = {
  id: string;
  title: string;
  subtitle?: string;
  version?: string;
  publishedAt?: string;
  authors?: string[];
  tags?: string[];
  sections: Section[];
};