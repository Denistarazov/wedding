'use client';

import React from 'react';
import Image from 'next/image';

// ─── Placeholder ──────────────────────────────────────────────────────────────

interface PlaceholderProps {
  label?: string;
  ratio?: string;
  variant?: 'stripes' | 'dots' | 'grid' | 'cross';
  fg?: string;
  bg?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export function Placeholder({
  label, ratio = '4/5', variant = 'stripes',
  fg = '#8a7a5a', bg = '#ede4d0', style, ...rest
}: PlaceholderProps) {
  const pid = 'p' + React.useId().replace(/:/g, '');
  const patterns: Record<string, React.ReactNode> = {
    stripes: (
      <pattern id={pid} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke={fg} strokeWidth="0.6" opacity="0.35" />
      </pattern>
    ),
    dots: (
      <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="0.8" fill={fg} opacity="0.4" />
      </pattern>
    ),
    grid: (
      <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke={fg} strokeWidth="0.4" opacity="0.35" />
      </pattern>
    ),
    cross: (
      <pattern id={pid} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <line x1="0" y1="7" x2="14" y2="7" stroke={fg} strokeWidth="0.5" opacity="0.3" />
        <line x1="7" y1="0" x2="7" y2="14" stroke={fg} strokeWidth="0.5" opacity="0.3" />
      </pattern>
    ),
  };
  return (
    <div style={{ position: 'relative', aspectRatio: ratio, background: bg, overflow: 'hidden', ...style }} {...rest}>
      <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <defs>{patterns[variant]}</defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: fg, opacity: 0.75, textAlign: 'center', padding: 16,
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ─── Portrait ─────────────────────────────────────────────────────────────────

interface PortraitProps {
  label?: string;
  ratio?: string;
  fg?: string;
  bg?: string;
  frame?: boolean;
  style?: React.CSSProperties;
}

export function Portrait({ label = 'portrait', ratio = '4/5', fg, bg, frame = false, style }: PortraitProps) {
  return (
    <div className="letterpress-shell" style={{
      position: 'relative', aspectRatio: ratio, overflow: 'hidden',
      background: bg || '#e5dcc8', ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${bg || '#e5dcc8'} 0%, ${fg || '#c9b890'} 100%)` }} />
      {frame && <div style={{ position: 'absolute', inset: 10, border: `1px solid ${fg || '#8a7a5a'}`, opacity: 0.6 }} />}
      <Placeholder label={label} ratio={ratio} variant="stripes" fg={fg} bg="transparent" style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

// ─── AssetImage ───────────────────────────────────────────────────────────────

interface AssetImageProps {
  src: string;
  alt?: string;
  ratio?: string;
  fit?: 'cover' | 'contain' | 'fill';
  position?: string;
  sizes?: string;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  [key: string]: unknown;
}

export function AssetImage({
  src, alt = '', ratio = '4/5', fit = 'cover', position = 'center',
  sizes = '(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 720px',
  style, imgStyle, ...rest
}: AssetImageProps) {
  return (
    <div style={{ position: 'relative', aspectRatio: ratio, overflow: 'hidden', ...style }} {...rest}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectFit: fit, objectPosition: position, ...imgStyle }}
      />
    </div>
  );
}
