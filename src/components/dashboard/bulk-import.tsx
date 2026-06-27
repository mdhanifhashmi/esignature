"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Download } from "lucide-react";

interface BulkResult {
  name: string;
  status: "success" | "error";
  id?: string;
  error?: string;
}

export function BulkImport() {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<BulkResult[]>([]);
  const [message, setMessage] = useState("");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setMessage("");
    setResults([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (parsed) => {
        const res = await fetch("/api/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows: parsed.data }),
        });
        const data = await res.json();
        if (res.ok) {
          setResults(data.results ?? []);
          setMessage(`Generated ${data.results?.filter((r: BulkResult) => r.status === "success").length ?? 0} signatures`);
        } else {
          setMessage(data.error ?? "Bulk import failed");
        }
        setProcessing(false);
      },
      error: () => {
        setMessage("Failed to parse CSV file");
        setProcessing(false);
      },
    });
  }

  function downloadTemplate() {
    const csv = "name,title,company,email,phone,website,linkedin\nJohn Doe,CEO,Acme Inc,john@acme.com,+1 555 0100,https://acme.com,https://linkedin.com/in/johndoe";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sigmotion-bulk-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExportZip() {
    const res = await fetch("/api/bulk/export");
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "signatures.zip";
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-purple-950">Bulk Create Signatures</h1>
        <p className="text-sm text-purple-600">
          Upload a CSV to generate signatures for your entire team at once.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV Import</CardTitle>
          <CardDescription>
            Required columns: name, title, company, email. Optional: phone, website, linkedin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4" /> Download Template
            </Button>
            <label className="cursor-pointer">
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                <Upload className="h-4 w-4" /> {processing ? "Processing..." : "Upload CSV"}
              </span>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
            {results.length > 0 && (
              <Button variant="outline" onClick={handleExportZip}>
                <Download className="h-4 w-4" /> Export ZIP
              </Button>
            )}
          </div>
          {message && <p className="text-sm text-slate-600">{message}</p>}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-2">{r.name}</td>
                      <td className={r.status === "success" ? "text-green-600" : "text-red-600"}>
                        {r.status === "success" ? "Created" : r.error}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
