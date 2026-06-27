"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, Copy, Check, Wand2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MotionBackground } from "@/components/landing/motion-background";
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
  const progress = ((step + 1) / STEPS.length) * 100;

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
    <div className="relative min-h-screen bg-mesh-purple">
      <MotionBackground />

      <header className="glass-purple relative z-10 border-b border-purple-200/50">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-purple-950">
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}>
              <Sparkles className="h-5 w-5 text-purple-600" />
            </motion.div>
            <span className="text-gradient-purple">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-purple-700">Dashboard</Button>
            </Link>
            <Button size="sm" onClick={handleSave} disabled={saving} className="shadow-md shadow-purple-500/20">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-4 rounded-xl px-4 py-2 text-sm",
              saveMessage.includes("success") ? "bg-green-50 text-green-700" : "bg-purple-50 text-purple-700"
            )}
          >
            {saveMessage}
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-xs text-purple-600">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-purple-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step pills */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {STEPS.map((s, i) => (
            <motion.button
              key={s}
              onClick={() => setStep(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                step === i
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/25"
                  : i < step
                    ? "bg-purple-100 text-purple-700"
                    : "bg-white/80 text-purple-400 hover:bg-purple-50"
              )}
            >
              {s}
            </motion.button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-purple-100/80 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-purple-950">
                <span>{STEPS[step]}</span>
                {step === 0 && (
                  <Button variant="outline" size="sm" onClick={handleAiSuggest} disabled={aiLoading} className="border-purple-200">
                    <Wand2 className="h-4 w-4" />
                    {aiLoading ? "Thinking..." : "AI Suggest"}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {step === 0 && (
                    <>
                      <div><Label htmlFor="name">Signature Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
                      <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={config.fullName} onChange={(e) => updateConfig({ fullName: e.target.value })} /></div>
                      <div><Label htmlFor="jobTitle">Job Title</Label><Input id="jobTitle" value={config.jobTitle} onChange={(e) => updateConfig({ jobTitle: e.target.value })} /></div>
                      <div><Label htmlFor="company">Company</Label><Input id="company" value={config.company} onChange={(e) => updateConfig({ company: e.target.value })} /></div>
                      <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={config.email} onChange={(e) => updateConfig({ email: e.target.value })} /></div>
                      <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={config.phone} onChange={(e) => updateConfig({ phone: e.target.value })} /></div>
                      <div><Label htmlFor="tagline">Tagline</Label><Textarea id="tagline" value={config.tagline} onChange={(e) => updateConfig({ tagline: e.target.value })} /></div>
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
                                "rounded-xl border p-3 text-left text-sm transition-all",
                                config.templateId === t.id
                                  ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10"
                                  : "border-purple-100 hover:border-purple-300"
                              )}
                            >
                              <p className="font-medium text-purple-950">{t.label}</p>
                              <p className="text-xs text-purple-500">{t.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {(["primaryColor", "secondaryColor", "textColor"] as const).map((c) => (
                          <div key={c}>
                            <Label htmlFor={c}>{c.replace("Color", "")}</Label>
                            <Input id={c} type="color" value={config[c]} onChange={(e) => updateConfig({ [c]: e.target.value })} className="h-10" />
                          </div>
                        ))}
                      </div>
                      <div><Label htmlFor="logo">Logo Upload</Label><Input id="logo" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload("logoUrl", e.target.files[0])} /></div>
                      <div><Label htmlFor="profile">Profile Photo</Label><Input id="profile" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload("profileUrl", e.target.files[0])} /></div>
                      <div><Label htmlFor="website">Website URL</Label><Input id="website" value={config.website} onChange={(e) => updateConfig({ website: e.target.value })} placeholder="https://yourcompany.com" /></div>
                      <label className="flex items-center gap-2 text-sm text-purple-700">
                        <input type="checkbox" checked={config.showVerificationBadge} onChange={(e) => updateConfig({ showVerificationBadge: e.target.checked })} className="accent-purple-600" />
                        Show verification badge
                      </label>
                    </>
                  )}

                  {step === 2 && config.socialLinks.map((link, index) => (
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
                      <label className="flex items-center gap-1 pb-2 text-sm text-purple-700">
                        <input type="checkbox" checked={link.enabled} onChange={(e) => {
                          const links = [...config.socialLinks];
                          links[index] = { ...link, enabled: e.target.checked };
                          updateConfig({ socialLinks: links });
                        }} className="accent-purple-600" />
                        On
                      </label>
                    </div>
                  ))}

                  {step === 3 && (
                    <>
                      {(["logo", "profile"] as const).map((type) => (
                        <div key={type}>
                          <Label>{type === "logo" ? "Logo" : "Profile"} Animation</Label>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {ANIMATION_PRESETS[type].map((preset) => {
                              const key = type === "logo" ? "logoAnimation" : "profileAnimation";
                              return (
                                <button
                                  key={preset.id}
                                  onClick={() => updateConfig({ [key]: preset.id })}
                                  className={cn(
                                    "rounded-xl border p-3 text-left text-sm transition-all",
                                    config[key] === preset.id
                                      ? "border-purple-500 bg-purple-50"
                                      : "border-purple-100 hover:border-purple-300"
                                  )}
                                >
                                  <p className="font-medium text-purple-950">{preset.label}</p>
                                  <p className="text-xs text-purple-500">{preset.description}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <Button onClick={handleGenerateAnimations} disabled={animating || (!config.logoUrl && !config.profileUrl)}>
                        {animating ? "Generating..." : "Generate Animated GIFs"}
                      </Button>
                      {(config.logoGifUrl || config.profileGifUrl) && (
                        <Badge className="border-green-200 bg-green-50 text-green-700">Animations generated!</Badge>
                      )}
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <p className="text-sm text-purple-600">Copy the HTML below and paste it into your email client signature settings.</p>
                      <Textarea readOnly value={html} className="min-h-[200px] font-mono text-xs border-purple-100" />
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={handleCopy}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? "Copied!" : "Copy HTML"}
                        </Button>
                        <Link href="/guides/gmail"><Button variant="outline" className="border-purple-200">Gmail Guide</Button></Link>
                        <Link href="/guides/outlook"><Button variant="outline" className="border-purple-200">Outlook Guide</Button></Link>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between border-t border-purple-100 pt-4">
                <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="border-purple-200">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100/80 bg-white/80 backdrop-blur-sm lg:sticky lg:top-20 lg:self-start">
            <CardHeader>
              <CardTitle className="text-purple-950">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="animate-nav-pulse rounded-xl border border-purple-100 bg-white p-6"
                key={html.slice(0, 50)}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </motion.div>
              <p className="mt-4 text-xs text-purple-400">
                Outlook desktop shows the first GIF frame as a static image. We design for that fallback.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
