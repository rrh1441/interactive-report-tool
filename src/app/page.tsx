import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Interactive Report System</h1>
        <p className="text-gray-600 text-lg">
          Transform static PDFs into dynamic, interactive, and measurable reports
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 className="text-2xl font-semibold mb-3">Available Reports</h2>
          <div className="space-y-3">
            <Link 
              href="/reports/dwiq-monthly-august-2025"
              className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-lg">DWIQ Monthly Report: August 2025</h3>
              <p className="text-gray-600 text-sm mt-1">
                Intelligence Summary & Threat Analysis with interactive charts and feedback
              </p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">cybersecurity</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">threat intelligence</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-2xl font-semibold mb-3">Features</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Interactive Vega-Lite charts
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Section-level feedback collection
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Responsive design
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Structured JSON content model
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Accessible navigation
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Built with Next.js, React, Vega-Lite, and Tailwind CSS
        </p>
      </div>
    </main>
  );
}
