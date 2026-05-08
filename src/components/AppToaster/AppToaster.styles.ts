import { createGlobalStyle } from 'styled-components';

export const ToasterGlobalStyle = createGlobalStyle`
  [data-sonner-toaster] {
    --width: 380px;
    --border-radius: 10px;
    font-family: var(--font-body-sans), system-ui, sans-serif;
  }

  [data-sonner-toaster][data-sonner-theme='light'],
  [data-sonner-toaster][data-sonner-theme='dark'] {
    --normal-bg: ${(p) => p.theme.colors.surface};
    --normal-border: ${(p) => p.theme.colors.surfaceBorder};
    --normal-text: ${(p) => p.theme.colors.foreground};

    --success-bg: color-mix(in srgb, ${(p) => p.theme.colors.success} 8%, ${(p) => p.theme.colors.surface});
    --success-border: color-mix(in srgb, ${(p) => p.theme.colors.success} 30%, ${(p) => p.theme.colors.surfaceBorder});
    --success-text: ${(p) => p.theme.colors.foreground};

    --info-bg: color-mix(in srgb, ${(p) => p.theme.colors.accent} 8%, ${(p) => p.theme.colors.surface});
    --info-border: color-mix(in srgb, ${(p) => p.theme.colors.accent} 30%, ${(p) => p.theme.colors.surfaceBorder});
    --info-text: ${(p) => p.theme.colors.foreground};

    --warning-bg: color-mix(in srgb, ${(p) => p.theme.colors.warning} 8%, ${(p) => p.theme.colors.surface});
    --warning-border: color-mix(in srgb, ${(p) => p.theme.colors.warning} 30%, ${(p) => p.theme.colors.surfaceBorder});
    --warning-text: ${(p) => p.theme.colors.foreground};

    --error-bg: color-mix(in srgb, ${(p) => p.theme.colors.error} 8%, ${(p) => p.theme.colors.surface});
    --error-border: color-mix(in srgb, ${(p) => p.theme.colors.error} 30%, ${(p) => p.theme.colors.surfaceBorder});
    --error-text: ${(p) => p.theme.colors.foreground};
  }

  /* ── Toast card ─────────────────────────────── */

  [data-sonner-toast][data-styled='true'] {
    padding: 0.875rem 1rem;
    gap: 0.625rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--normal-border);
    box-shadow: var(--shadow-toast);
  }

  /* ── Exit animation: slide out right + fade (mirrors bottom-right entry) ── */

  [data-sonner-toast][data-y-position='bottom'][data-removed='true'][data-swipe-out='false'] {
    --y: translateX(110%);
    transition:
      transform 380ms cubic-bezier(0.32, 0.72, 0.3, 1),
      opacity 280ms ease-out;
  }

  [data-sonner-toast][data-y-position='top'][data-removed='true'][data-swipe-out='false'] {
    --y: translateX(110%);
    transition:
      transform 380ms cubic-bezier(0.32, 0.72, 0.3, 1),
      opacity 280ms ease-out;
  }

  /* ── Typography ─────────────────────────────── */

  [data-sonner-toast][data-styled='true'] [data-title] {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: -0.005em;
    color: ${(p) => p.theme.colors.foreground};
  }

  [data-sonner-toast][data-styled='true'] [data-description] {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: ${(p) => p.theme.colors.muted};
  }

  [data-rich-colors='true'][data-sonner-toast][data-styled='true'] [data-description] {
    color: ${(p) => p.theme.colors.muted};
    opacity: 0.9;
  }

  /* ── Icon tint per variant ──────────────────── */

  [data-sonner-toast][data-styled='true'] [data-icon] {
    width: 18px;
    height: 18px;
    margin-right: 0.5rem;
  }

  [data-sonner-toast][data-type='success'] [data-icon] { color: ${(p) => p.theme.colors.success}; }
  [data-sonner-toast][data-type='info']    [data-icon] { color: ${(p) => p.theme.colors.accent}; }
  [data-sonner-toast][data-type='warning'] [data-icon] { color: ${(p) => p.theme.colors.warning}; }
  [data-sonner-toast][data-type='error']   [data-icon] { color: ${(p) => p.theme.colors.error}; }

  /* ── Action / cancel buttons (mirror Button variants) ── */

  [data-sonner-toast][data-styled='true'] [data-button] {
    height: auto;
    padding: 0.375rem 0.875rem;
    border-radius: 6px;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: ${(p) => p.theme.colors.accent};
    color: var(--on-accent);
    border: 1px solid transparent;
    box-shadow: var(--shadow-btn);
    transition:
      background 0.15s,
      box-shadow 0.15s,
      transform 0.1s;
  }

  [data-sonner-toast][data-styled='true'] [data-button]:hover {
    background: ${(p) => p.theme.colors.accentHover};
  }

  [data-sonner-toast][data-styled='true'] [data-button]:active {
    transform: scale(0.98);
  }

  [data-sonner-toast][data-styled='true'] [data-cancel] {
    background: transparent;
    color: ${(p) => p.theme.colors.foreground};
    border: 1px solid ${(p) => p.theme.colors.border};
    box-shadow: none;
    text-transform: none;
    letter-spacing: normal;
    font-weight: 500;
  }

  [data-sonner-toast][data-styled='true'] [data-cancel]:hover {
    background: transparent;
    border-color: ${(p) => p.theme.colors.tertiary};
    color: ${(p) => p.theme.colors.tertiary};
  }

  /* ── Loader colour ──────────────────────────── */

  [data-sonner-toast][data-styled='true'] [data-icon] .sonner-loader {
    --loader-color: ${(p) => p.theme.colors.accent};
  }
`;
