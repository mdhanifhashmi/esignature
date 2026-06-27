export type TemplateId =
  | "nav-left"
  | "nav-bottom"
  | "card"
  | "minimal"
  | "banner"
  | "split"
  | "corporate"
  | "creative"
  | "stack"
  | "compact"
  | "sidebar"
  | "gradient";

export type LogoAnimationPreset = "pulse" | "fadeLoop" | "slideReveal" | "subtleRotate";
export type ProfileAnimationPreset = "ringPulse" | "zoomLoop" | "fadeLoop";

export interface SocialLink {
  id: string;
  type: keyof typeof import("@/lib/constants").SOCIAL_ICONS | "custom";
  label: string;
  url: string;
  enabled: boolean;
}

export interface SignatureConfig {
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  tagline: string;
  templateId: TemplateId;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoUrl: string;
  profileUrl: string;
  logoAnimation: LogoAnimationPreset;
  profileAnimation: ProfileAnimationPreset;
  socialLinks: SocialLink[];
  showVerificationBadge: boolean;
  logoGifUrl?: string;
  profileGifUrl?: string;
}

export interface SignatureRecord {
  id: string;
  org_id: string | null;
  owner_user_id: string | null;
  template_id: string;
  name: string;
  config: SignatureConfig;
  html_output: string;
  public_slug: string;
  created_at: string;
  updated_at: string;
}

export interface AiSuggestion {
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  templateId: TemplateId;
  logoAnimation: LogoAnimationPreset;
  profileAnimation: ProfileAnimationPreset;
  socialLinkOrder: string[];
}
