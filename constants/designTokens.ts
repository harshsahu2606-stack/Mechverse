/**
 * Mechverse Design System Tokens v2
 * Minimalist, Cinematic, High-Precision Engineering Aesthetic
 */

export const TOKENS = {
  colors: {
    background: "#07080A",
    surface: "#0F1114",
    raised: "#161A1F",
    hairline: "rgba(255, 255, 255, 0.08)",
    hairlineHover: "rgba(255, 255, 255, 0.16)",
    text: "#F4F5F7",
    secondary: "#9AA0A9",
    muted: "#5C626B",
    accent: "#FF6A1A",
    accentGlow: "rgba(255, 106, 26, 0.25)",
    wireframe: "rgba(191, 212, 230, 0.30)",
    status: {
      verified: "#3DDC97",
      verifiedGlow: "rgba(61, 220, 151, 0.2)",
      estimated: "#E6B84A",
      estimatedGlow: "rgba(230, 184, 74, 0.2)",
      danger: "#F87171",
    },
  },
  typography: {
    fontSans: 'var(--font-geist-sans), "Inter Tight", "Sora", sans-serif',
    fontMono: 'var(--font-geist-mono), "JetBrains Mono", monospace',
  },
  radii: {
    card: "14px",
    button: "10px",
    tag: "6px",
    full: "9999px",
  },
  transitions: {
    cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
    durationSlow: "1000ms",
    durationDefault: "700ms",
    durationFast: "300ms",
  },
} as const;

export type DesignTokens = typeof TOKENS;
