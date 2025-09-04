import fs from "node:fs/promises";
import path from "node:path";
import type { ReportSpec } from "@/types/report";
import ReportSection from "@/components/ReportSection";
import FeedbackWidget from "@/components/FeedbackWidget";

async function loadReport(reportId: string): Promise<ReportSpec> {
  const file = path.join(process.cwd(), "public", "content", "reports", reportId, "report.json");
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data) as ReportSpec;
}

export default async function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = await loadReport(reportId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{report.title}</h1>
        {report.subtitle ? <p className="mt-1 text-gray-600">{report.subtitle}</p> : null}
        <div className="mt-2 text-sm text-gray-500">
          {report.publishedAt ? <span>Published {report.publishedAt}</span> : null}
          {report.version ? <span className="ml-2">v{report.version}</span> : null}
          {report.authors && report.authors.length > 0 ? (
            <span className="ml-2">by {report.authors.join(", ")}</span>
          ) : null}
        </div>
        {report.tags && report.tags.length > 0 ? (
          <div className="mt-2 flex gap-2">
            {report.tags.map(tag => (
              <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {report.sections.map((s) => (
        <ReportSection key={s.id} section={s} />
      ))}
      
      <div className="mt-12 pt-8 border-t">
        <FeedbackWidget reportId={report.id} />
      </div>
    </main>
  );
}