"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Copy, Trash2, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { APP_URL } from "@/lib/constants";

interface Signature {
  id: string;
  name: string;
  public_slug: string;
  updated_at: string;
  html_output: string;
}

export function SignatureList() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/signatures")
      .then((r) => r.json())
      .then((data) => {
        setSignatures(data.signatures ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this signature?")) return;
    await fetch(`/api/signatures/${id}`, { method: "DELETE" });
    setSignatures((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleDuplicate(sig: Signature) {
    const res = await fetch(`/api/signatures/${sig.id}`);
    if (!res.ok) return;
    const full = await res.json();
    const dupRes = await fetch("/api/signatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${sig.name} (Copy)`,
        config: full.config,
        html_output: full.html_output,
      }),
    });
    if (dupRes.ok) {
      const data = await dupRes.json();
      setSignatures((prev) => [data, ...prev]);
    }
  }

  if (loading) {
    return <p className="text-slate-500">Loading signatures...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Signature Manager</h1>
          <p className="text-sm text-slate-600">Create, organize, and deploy your email signatures.</p>
        </div>
        <Link href="/editor">
          <Button><Plus className="h-4 w-4" /> New Signature</Button>
        </Link>
      </div>

      {signatures.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600">No signatures yet.</p>
            <Link href="/editor">
              <Button className="mt-4">Create Your First Signature</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {signatures.map((sig) => (
            <Card key={sig.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{sig.name}</CardTitle>
                  <p className="text-xs text-slate-500">Updated {formatDate(sig.updated_at)}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/editor/${sig.id}`}>
                    <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                  </Link>
                  <Link href={`/s/${sig.public_slug}`} target="_blank">
                    <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicate(sig)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(sig.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div dangerouslySetInnerHTML={{ __html: sig.html_output }} />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Public URL: {APP_URL}/s/{sig.public_slug}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
