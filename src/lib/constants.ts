export const APP_NAME = "SigMotion";
export const APP_DESCRIPTION =
  "The only AI-generated email signature with an interactive nav bar, logo animation, and profile animation — 100% free.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const SOCIAL_ICONS = {
  website: { label: "Website", icon: "globe" },
  linkedin: { label: "LinkedIn", icon: "linkedin" },
  twitter: { label: "Twitter/X", icon: "twitter" },
  instagram: { label: "Instagram", icon: "instagram" },
  facebook: { label: "Facebook", icon: "facebook" },
  youtube: { label: "YouTube", icon: "youtube" },
  github: { label: "GitHub", icon: "github" },
} as const;

export const ANIMATION_PRESETS = {
  logo: [
    { id: "pulse", label: "Pulse", description: "Gentle scale pulse" },
    { id: "fadeLoop", label: "Fade Loop", description: "Soft opacity fade" },
    { id: "slideReveal", label: "Slide Reveal", description: "Horizontal slide" },
    { id: "subtleRotate", label: "Subtle Rotate", description: "Light rotation wobble" },
  ],
  profile: [
    { id: "ringPulse", label: "Ring Pulse", description: "Pulsing ring border" },
    { id: "zoomLoop", label: "Zoom Loop", description: "Subtle zoom in/out" },
    { id: "fadeLoop", label: "Fade Loop", description: "Soft opacity fade" },
  ],
} as const;

export const TEMPLATE_OPTIONS = [
  { id: "nav-left", label: "Nav Left", description: "Profile left, nav icons on the right" },
  { id: "nav-bottom", label: "Nav Bottom", description: "Content on top, nav bar below" },
  { id: "card", label: "Card", description: "Bordered card layout" },
  { id: "minimal", label: "Minimal", description: "Clean text-focused design" },
] as const;
