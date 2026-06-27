"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, Copy, Check, Wand2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, ANIMATION_PRESETS, TEMPLATE_OPTIONS } from "@/lib/constants";
import { getDefaultConfig, renderSignatureHtml } from "@/lib/signature/renderHtml";
import type { SignatureConfig } from "@/types/signature";
import { cn } from "@/lib/utils";

const STEPS = ["Profile", "Brand", "Links", "Animation", "Preview"];

interface SignatureEditorProps {
  initialConfig?: SignatureConfig;
  signatureId?: string;
  signatureName?: string;
}

export function SignatureEditor({
  initialConfig,
  signatureId,
  signatureName: initialName,
}: SignatureEditorProps) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<SignatureConfig>(initialConfig ?? getDefaultConfig());
  const [name, setName] = useState(initialName ?? "My Signature");
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const updateConfig = useCallback((partial: Partial<SignatureConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const html = renderSignatureHtml(config);

  async function handleAiSuggest() {
    if (!config.fullName || !config.jobTitle || !config.company) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: config.fullName,
          jobTitle: config.jobTitle,
          company: config.company,
        }),
      });
      const suggestion = await res.json();
      updateConfig({
        tagline: suggestion.tagline ?? config.tagline,
        primaryColor: suggestion.primaryColor ?? config.primaryColor,
        secondaryColor: suggestion.secondaryColor ?? config.secondaryColor,
        textColor: suggestion.textColor ?? config.textColor,
        templateId: suggestion.templateId ?? config.templateId,
        logoAnimation: suggestion.logoAnimation ?? config.logoAnimation,
        profileAnimation: suggestion.profileAnimation ?? config.profileAnimation,
      });
    } finally {
      setAiLoading(false);
    }
  }

  async function handleGenerateAnimations() {
    setAnimating(true);
    try {
      const res = await fetch("/api/animation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoUrl: config.logoUrl,
          profileUrl: config.profileUrl,
          logoAnimation: config.logoAnimation,
          profileAnimation: config.profileAnimation,
        }),
      });
      const data = await res.json();
      if (data.logoGifUrl) updateConfig({ logoGifUrl: data.logoGifUrl });
      if (data.profileGifUrl) updateConfig({ profileGifUrl: data.profileGifUrl });
    } finally {
      setAnimating(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage("");
    try {
      const method = signatureId ? "PUT" : "POST";
      const url = signatureId ? `/api/signatures/${signatureId}` : "/api/signatures";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, config, html_output: html }),
      });
      if (res.ok) {
        setSaveMessage("Saved successfully!");
        if (!signatureId) {
          const data = await res.json();
          window.location.href = `/editor/${data.id}`;
        }
      } else {
        const err = await res.json();
        setSaveMessage(err.error ?? "Save failed. Sign in to save signatures.");
      }
    } catch {
      setSaveMessage("Save failed. Check your connection.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleImageUpload(field: "logoUrl" | "profileUrl", file: File) {
    const reader = new FileReader();
    reader.onload = () => updateConfig({ [field]: reader.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-blue-600" />
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {saveMessage && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
            {saveMessage}
          </div>
        )}

        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                step === i ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{STEPS[step]}</span>
                {step === 0 && (
                  <Button variant="outline" size="sm" onClick={handleAiSuggest} disabled={aiLoading}>
                    <Wand2 className="h-4 w-4" />
                    {aiLoading ? "Thinking..." : "AI Suggest"}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 0 && (
                <>
                  <div>
                    <Label htmlFor="name">Signature Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={config.fullName} onChange={(e) => updateConfig({ fullName: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" value={config.jobTitle} onChange={(e) => updateConfig({ jobTitle: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" value={config.company} onChange={(e) => updateConfig({ company: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={config.email} onChange={(e) => updateConfig({ email: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={config.phone} onChange={(e) => updateConfig({ phone: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Textarea id="tagline" value={config.tagline} onChange={(e) => updateConfig({ tagline: e.target.value })} />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <Label>Template</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {TEMPLATE_OPTIONS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => updateConfig({ templateId: t.id })}
                          className={cn(
                            "rounded-lg border p-3 text-left text-sm transition-colors",
                            config.templateId === t.id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <p className="font-medium">{t.label}</p>
                          <p className="text-xs text-slate-500">{t.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary</Label>
                      <Input id="primaryColor" type="color" value={config.primaryColor} onChange={(e) => updateConfig({ primaryColor: e.target.value })} className="h-10" />
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary</Label>
                      <Input id="secondaryColor" type="color" value={config.secondaryColor} onChange={(e) => updateConfig({ secondaryColor: e.target.value })} className="h-10" />
                    </div>
                    <div>
                      <Label htmlFor="textColor">Text</Label>
                      <Input id="textColor" type="color" value={config.textColor} onChange={(e) => updateConfig({ textColor: e.target.value })} className="h-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="logo">Logo Upload</Label>
                    <Input id="logo" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload("logoUrl", e.target.files[0])} />
                  </div>
                  <div>
                    <Label htmlFor="profile">Profile Photo</Label>
                    <Input id="profile" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload("profileUrl", e.target.files[0])} />
                  </div>
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input id="website" value={config.website} onChange={(e) => updateConfig({ website: e.target.value })} placeholder="https://yourcompany.com" />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={config.showVerificationBadge}
                      onChange={(e) => updateConfig({ showVerificationBadge: e.target.checked })}
                    />
                    Show verification badge
                  </label>
                </>
              )}

              {step === 2 && (
                <>
                  {config.socialLinks.map((link, index) => (
                    <div key={link.id} className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>{link.label}</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const links = [...config.socialLinks];
                            links[index] = { ...link, url: e.target.value };
                            updateConfig({ socialLinks: links });
                          }}
                          placeholder={`https://${link.type}.com/yourprofile`}
                        />
                      </div>
                      <label className="flex items-center gap-1 pb-2 text-sm">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) => {
                            const links = [...config.socialLinks];
                            links[index] = { ...link, enabled: e.target.checked };
                            updateConfig({ socialLinks: links });
                          }}
                        />
                        On
                      </label>
                    </div>
                  ))}
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <Label>Logo Animation</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {ANIMATION_PRESETS.logo.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => updateConfig({ logoAnimation: preset.id })}
                          className={cn(
                            "rounded-lg border p-3 text-left text-sm",
                            config.logoAnimation === preset.id ? "border-blue-600 bg-blue-50" : "border-slate-200"
                          )}
                        >
                          <p className="font-medium">{preset.label}</p>
                          <p className="text-xs text-slate-500">{preset.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Profile Animation</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {ANIMATION_PRESETS.profile.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => updateConfig({ profileAnimation: preset.id })}
                          className={cn(
                            "rounded-lg border p-3 text-left text-sm",
                            config.profileAnimation === preset.id ? "border-blue-600 bg-blue-50" : "border-slate-200"
                          )}
                        >
                          <p className="font-medium">{preset.label}</p>
                          <p className="text-xs text-slate-500">{preset.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleGenerateAnimations} disabled={animating || (!config.logoUrl && !config.profileUrl)}>
                    {animating ? "Generating..." : "Generate Animated GIFs"}
                  </Button>
                  {(config.logoGifUrl || config.profileGifUrl) && (
                    <Badge className="bg-green-50 text-green-700">Animations generated!</Badge>
                  )}
                </>
              )}

              {step === 4 && (
                <>
                  <p className="text-sm text-slate-600">
                    Copy the HTML below and paste it into your email client signature settings.
                  </p>
                  <Textarea readOnly value={html} className="min-h-[200px] font-mono text-xs" />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy HTML"}
                    </Button>
                    <Link href="/guides/gmail"><Button variant="outline">Gmail Guide</Button></Link>
                    <Link href="/guides/outlook"><Button variant="outline">Outlook Guide</Button></Link>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Outlook desktop shows the first GIF frame as a static image. We design for that fallback.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
