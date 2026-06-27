import type { SignatureConfig } from "@/types/signature";
import { APP_NAME, APP_URL } from "@/lib/constants";

interface RenderOptions {
  trackedLinkMap?: Record<string, string>;
  logoGifUrl?: string;
  profileGifUrl?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getLinkUrl(
  url: string,
  label: string,
  trackedLinkMap?: Record<string, string>
): string {
  if (!url) return "#";
  const key = label.toLowerCase();
  return trackedLinkMap?.[key] ?? url;
}

function renderNavIcons(
  config: SignatureConfig,
  trackedLinkMap?: Record<string, string>
): string {
  const enabledLinks = config.socialLinks.filter((l) => l.enabled && l.url);
  if (enabledLinks.length === 0) return "";

  const icons = enabledLinks
    .map(
      (link) =>
        `<td style="padding:0 4px;">
          <a href="${escapeHtml(getLinkUrl(link.url, link.label, trackedLinkMap))}" target="_blank" style="text-decoration:none;">
            <img src="${escapeHtml(link.url.includes("http") ? getSocialIconUrl(link.type) : link.url)}" alt="${escapeHtml(link.label)}" width="24" height="24" style="display:block;border:0;" />
          </a>
        </td>`
    )
    .join("");

  return `<table cellpadding="0" cellspacing="0" border="0"><tr>${icons}</tr></table>`;
}

function getSocialIconUrl(type: string): string {
  const base = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons";
  const map: Record<string, string> = {
    linkedin: `${base}/linkedin.svg`,
    twitter: `${base}/x.svg`,
    instagram: `${base}/instagram.svg`,
    facebook: `${base}/facebook.svg`,
    youtube: `${base}/youtube.svg`,
    github: `${base}/github.svg`,
    website: `${base}/googlechrome.svg`,
  };
  return map[type] ?? map.website;
}

function renderProfileImage(config: SignatureConfig, profileUrl?: string): string {
  const url = profileUrl ?? config.profileGifUrl ?? config.profileUrl;
  if (!url) return "";
  return `<img src="${escapeHtml(url)}" alt="${escapeHtml(config.fullName)}" width="80" height="80" style="display:block;border-radius:50%;border:2px solid ${config.primaryColor};" />`;
}

function renderLogo(config: SignatureConfig, logoUrl?: string): string {
  const url = logoUrl ?? config.logoGifUrl ?? config.logoUrl;
  if (!url) return "";
  return `<img src="${escapeHtml(url)}" alt="${escapeHtml(config.company)}" width="120" height="40" style="display:block;" />`;
}

function renderContactInfo(config: SignatureConfig): string {
  const lines = [
    config.fullName &&
      `<span style="font-size:16px;font-weight:bold;color:${config.textColor};">${escapeHtml(config.fullName)}</span>`,
    config.jobTitle &&
      `<span style="font-size:13px;color:${config.secondaryColor};">${escapeHtml(config.jobTitle)}</span>`,
    config.company &&
      `<span style="font-size:13px;font-weight:600;color:${config.primaryColor};">${escapeHtml(config.company)}</span>`,
    config.tagline &&
      `<span style="font-size:12px;color:${config.secondaryColor};font-style:italic;">${escapeHtml(config.tagline)}</span>`,
    config.email &&
      `<a href="mailto:${escapeHtml(config.email)}" style="font-size:12px;color:${config.primaryColor};text-decoration:none;">${escapeHtml(config.email)}</a>`,
    config.phone &&
      `<span style="font-size:12px;color:${config.textColor};">${escapeHtml(config.phone)}</span>`,
    config.website &&
      `<a href="${escapeHtml(config.website)}" style="font-size:12px;color:${config.primaryColor};text-decoration:none;">${escapeHtml(config.website.replace(/^https?:\/\//, ""))}</a>`,
  ].filter(Boolean);

  return lines
    .map(
      (line) =>
        `<tr><td style="padding:2px 0;font-family:Arial,Helvetica,sans-serif;line-height:1.4;">${line}</td></tr>`
    )
    .join("");
}

function renderVerificationBadge(config: SignatureConfig): string {
  if (!config.showVerificationBadge) return "";
  return `<tr><td style="padding-top:6px;">
    <a href="${APP_URL}" target="_blank" style="font-size:10px;color:#999;text-decoration:none;font-family:Arial,sans-serif;">
      ✓ Verified by ${APP_NAME}
    </a>
  </td></tr>`;
}

export function renderSignatureHtml(
  config: SignatureConfig,
  options: RenderOptions = {}
): string {
  const { trackedLinkMap, logoGifUrl, profileGifUrl } = options;
  const nav = renderNavIcons(config, trackedLinkMap);
  const profile = renderProfileImage(config, profileGifUrl);
  const logo = renderLogo(config, logoGifUrl);
  const contact = renderContactInfo(config);
  const badge = renderVerificationBadge(config);

  switch (config.templateId) {
    case "nav-bottom":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td style="padding-right:16px;vertical-align:top;">${profile}</td>
          <td style="vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0">${contact}${badge}</table>
          </td>
          <td style="padding-left:16px;vertical-align:top;">${logo}</td>
        </tr>
        <tr><td colspan="3" style="padding-top:10px;">${nav}</td></tr>
      </table>`;

    case "card":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;border:1px solid ${config.primaryColor};border-radius:8px;padding:12px;">
        <tr>
          <td style="padding-right:16px;vertical-align:top;">${profile}</td>
          <td style="vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0">${contact}</table>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top:10px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td>${logo}</td>
                <td style="text-align:right;vertical-align:middle;">${nav}</td>
              </tr>
            </table>
          </td>
        </tr>
        ${badge ? `<tr><td colspan="2">${badge.replace("<tr><td", "<td").replace("</td></tr>", "</td>")}</td></tr>` : ""}
      </table>`;

    case "minimal":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">
        <tr><td>
          <table cellpadding="0" cellspacing="0" border="0">${contact}</table>
        </td></tr>
        <tr><td style="padding-top:8px;">${nav}</td></tr>
        ${badge}
      </table>`;

    case "banner":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;max-width:480px;">
        <tr><td style="background:${config.primaryColor};height:4px;border-radius:4px 4px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:12px 0;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="padding-right:14px;vertical-align:top;">${profile}</td>
            <td style="vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0">${contact}</table></td>
            <td style="padding-left:14px;vertical-align:top;">${logo}</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding-top:6px;border-top:1px solid ${config.secondaryColor}33;">${nav}</td></tr>
        ${badge}
      </table>`;

    case "split":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td style="padding-right:16px;vertical-align:top;border-right:3px solid ${config.primaryColor};">${profile}${logo ? `<div style="margin-top:8px;">${logo}</div>` : ""}</td>
          <td style="padding-left:16px;vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0">${contact}${badge}</table>
            <div style="margin-top:10px;">${nav}</div>
          </td>
        </tr>
      </table>`;

    case "corporate":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;text-align:center;">
        <tr><td style="padding-bottom:10px;text-align:center;">${logo || `<span style="font-size:18px;font-weight:bold;color:${config.primaryColor};">${escapeHtml(config.company)}</span>`}</td></tr>
        <tr><td style="border-top:1px solid ${config.secondaryColor};padding-top:10px;">
          <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
            <td style="padding-right:12px;vertical-align:top;">${profile}</td>
            <td style="vertical-align:top;text-align:left;"><table cellpadding="0" cellspacing="0" border="0">${contact}</table></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding-top:10px;text-align:center;">${nav}</td></tr>
        ${badge ? `<tr><td style="text-align:center;">${badge.replace("<tr><td", "<td").replace("</td></tr>", "</td>")}</td></tr>` : ""}
      </table>`;

    case "creative":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td style="width:5px;background:${config.primaryColor};border-radius:3px;">&nbsp;</td>
          <td style="padding-left:14px;vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="padding-right:12px;vertical-align:top;">${profile}</td>
              <td style="vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0">${contact}</table></td>
            </tr></table>
            <table cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;width:100%;"><tr>
              <td>${logo}</td><td style="text-align:right;vertical-align:middle;">${nav}</td>
            </tr></table>
            ${badge}
          </td>
        </tr>
      </table>`;

    case "stack":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;text-align:center;">
        <tr><td style="text-align:center;padding-bottom:8px;">${profile}</td></tr>
        <tr><td style="text-align:center;"><table cellpadding="0" cellspacing="0" border="0" align="center">${contact}</table></td></tr>
        <tr><td style="padding-top:8px;text-align:center;">${logo}</td></tr>
        <tr><td style="padding-top:10px;text-align:center;">${nav}</td></tr>
        ${badge ? `<tr><td style="text-align:center;">${badge.replace("<tr><td", "<td").replace("</td></tr>", "</td>")}</td></tr>` : ""}
      </table>`;

    case "compact":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td style="padding-right:10px;vertical-align:middle;">${profile || logo}</td>
          <td style="vertical-align:middle;border-left:2px solid ${config.primaryColor};padding-left:10px;">
            <table cellpadding="0" cellspacing="0" border="0">${contact}</table>
          </td>
          <td style="padding-left:10px;vertical-align:middle;">${nav}</td>
        </tr>
      </table>`;

    case "sidebar":
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td style="background:${config.primaryColor}11;padding:12px;vertical-align:top;border-radius:8px 0 0 8px;min-width:100px;">
            ${profile}
            <div style="margin-top:8px;">${logo}</div>
          </td>
          <td style="padding:12px;vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0">${contact}${badge}</table>
            <div style="margin-top:10px;">${nav}</div>
          </td>
        </tr>
      </table>`;

    case "gradient": {
      const bodyLines = [
        config.company &&
          `<span style="font-size:13px;font-weight:600;color:${config.primaryColor};">${escapeHtml(config.company)}</span>`,
        config.email &&
          `<a href="mailto:${escapeHtml(config.email)}" style="font-size:12px;color:${config.primaryColor};text-decoration:none;">${escapeHtml(config.email)}</a>`,
        config.phone &&
          `<span style="font-size:12px;color:${config.textColor};">${escapeHtml(config.phone)}</span>`,
        config.website &&
          `<a href="${escapeHtml(config.website)}" style="font-size:12px;color:${config.primaryColor};text-decoration:none;">${escapeHtml(config.website.replace(/^https?:\/\//, ""))}</a>`,
      ].filter(Boolean);
      const bodyContact = bodyLines
        .map((line) => `<tr><td style="padding:2px 0;line-height:1.4;">${line}</td></tr>`)
        .join("");
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;border-radius:8px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,${config.primaryColor},${config.secondaryColor});padding:10px 14px;">
          <span style="font-size:15px;font-weight:bold;color:#ffffff;">${escapeHtml(config.fullName || "Your Name")}</span>
          ${config.jobTitle ? `<br><span style="font-size:12px;color:#ffffffcc;">${escapeHtml(config.jobTitle)}</span>` : ""}
        </td></tr>
        <tr><td style="padding:12px 14px;background:#ffffff;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="padding-right:12px;vertical-align:top;">${profile}</td>
            <td style="vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0">${bodyContact}</table></td>
            <td style="padding-left:12px;vertical-align:top;">${logo}</td>
          </tr></table>
          <div style="margin-top:10px;">${nav}</div>
        </td></tr>
      </table>`;
    }

    case "nav-left":
    default:
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td style="padding-right:16px;vertical-align:top;">${profile}</td>
          <td style="vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0">${contact}${badge}</table>
            <table cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;"><tr><td>${nav}</td></tr></table>
          </td>
          <td style="padding-left:16px;vertical-align:top;">${logo}</td>
        </tr>
      </table>`;
  }
}

export function getDefaultConfig(): SignatureConfig {
  return {
    fullName: "",
    jobTitle: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    tagline: "",
    templateId: "nav-left",
    primaryColor: "#9333ea",
    secondaryColor: "#a78bfa",
    textColor: "#1e1b4b",
    logoUrl: "",
    profileUrl: "",
    logoAnimation: "pulse",
    profileAnimation: "ringPulse",
    socialLinks: [
      { id: "1", type: "website", label: "Website", url: "", enabled: true },
      { id: "2", type: "linkedin", label: "LinkedIn", url: "", enabled: true },
      { id: "3", type: "twitter", label: "Twitter/X", url: "", enabled: false },
      { id: "4", type: "instagram", label: "Instagram", url: "", enabled: false },
    ],
    showVerificationBadge: false,
  };
}
