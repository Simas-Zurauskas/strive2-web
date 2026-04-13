'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DEV_MODE } from '@/conf/env';
import * as S from './DevScreen.styles';

const FIRST_STEPS_SVG = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sky" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#f6e8c8"/>
      <stop offset="45%" stop-color="#e8ddd0"/>
      <stop offset="100%" stop-color="#d5cec4"/>
    </radialGradient>
    <radialGradient id="sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#96793e" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#96793e" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#96793e" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="path-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c4b090"/>
      <stop offset="100%" stop-color="#b8a888"/>
    </linearGradient>
    <clipPath id="circle-clip"><circle cx="200" cy="200" r="190"/></clipPath>
  </defs>

  <!-- Outer ring -->
  <circle cx="200" cy="200" r="196" fill="none" stroke="#dfd9d3" stroke-width="1"/>
  <circle cx="200" cy="200" r="190" fill="url(#sky)"/>

  <g clip-path="url(#circle-clip)">
    <!-- Sun glow -->
    <circle cx="200" cy="110" r="120" fill="url(#sun)"/>
    <circle cx="200" cy="110" r="28" fill="#96793e" opacity="0.2"/>
    <circle cx="200" cy="110" r="16" fill="#96793e" opacity="0.3"/>

    <!-- Distant mountains -->
    <path d="M0 200 L60 145 L95 170 L140 120 L180 155 L220 108 L260 150 L305 125 L340 160 L400 135 L400 250 L0 250Z" fill="#2c5545" opacity="0.12"/>
    <path d="M0 220 L50 175 L100 195 L150 155 L200 180 L250 148 L300 178 L350 158 L400 185 L400 260 L0 260Z" fill="#2c5545" opacity="0.18"/>

    <!-- Rolling hills - back -->
    <path d="M-20 280 Q80 210, 180 245 Q260 270, 340 235 Q380 220, 420 240 L420 400 L-20 400Z" fill="#3d7a5f" opacity="0.35"/>
    <!-- Rolling hills - mid -->
    <path d="M-20 300 Q60 250, 150 275 Q220 295, 300 260 Q360 240, 420 265 L420 400 L-20 400Z" fill="#2c5545" opacity="0.3"/>

    <!-- Distant trees on hills -->
    <g fill="#2c5545" opacity="0.25">
      <path d="M55 248 l-5 12 l10 0Z"/><rect x="54" y="260" width="2" height="4"/>
      <path d="M72 240 l-6 14 l12 0Z"/><rect x="71" y="254" width="2" height="5"/>
      <path d="M62 244 l-4 10 l8 0Z"/><rect x="61" y="254" width="2" height="3"/>
      <path d="M310 238 l-5 12 l10 0Z"/><rect x="309" y="250" width="2" height="4"/>
      <path d="M325 232 l-6 14 l12 0Z"/><rect x="324" y="246" width="2" height="5"/>
      <path d="M340 240 l-4 10 l8 0Z"/><rect x="339" y="250" width="2" height="3"/>
    </g>

    <!-- Foreground hill -->
    <path d="M-20 330 Q100 280, 200 310 Q300 340, 420 300 L420 420 L-20 420Z" fill="#3d7a5f" opacity="0.45"/>

    <!-- Winding path -->
    <path d="M200 395 C195 370, 170 355, 165 340 C160 325, 185 310, 195 295 C205 280, 175 268, 180 255 C185 242, 210 238, 200 220" stroke="url(#path-grad)" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M200 395 C195 370, 170 355, 165 340 C160 325, 185 310, 195 295 C205 280, 175 268, 180 255 C185 242, 210 238, 200 220" stroke="#dfd9d3" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.4"/>
    <!-- Path dashes -->
    <path d="M200 395 C195 370, 170 355, 165 340 C160 325, 185 310, 195 295 C205 280, 175 268, 180 255 C185 242, 210 238, 200 220" stroke="#c4b090" stroke-width="2" fill="none" stroke-dasharray="6 8" stroke-linecap="round" opacity="0.6"/>

    <!-- Ground / earth at bottom -->
    <path d="M-20 360 Q100 340, 200 355 Q300 370, 420 345 L420 420 L-20 420Z" fill="#2c5545" opacity="0.5"/>
    <path d="M-20 375 Q80 360, 200 370 Q320 380, 420 360 L420 420 L-20 420Z" fill="#1e3d31" opacity="0.4"/>

    <!-- Foreground grass tufts -->
    <g stroke="#2c5545" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.5">
      <path d="M40 385 Q42 370, 38 358"/><path d="M44 385 Q48 368, 50 356"/>
      <path d="M120 378 Q118 365, 122 354"/><path d="M125 378 Q130 362, 128 352"/>
      <path d="M280 375 Q278 362, 282 350"/><path d="M285 375 Q290 360, 287 348"/>
      <path d="M350 380 Q347 368, 352 356"/><path d="M355 380 Q360 365, 357 354"/>
    </g>

    <!-- Left tree -->
    <g transform="translate(75, 310)">
      <rect x="-3" y="0" width="6" height="25" rx="2" fill="#4a3728" opacity="0.6"/>
      <ellipse cx="0" cy="-8" rx="22" ry="25" fill="#2c5545" opacity="0.55"/>
      <ellipse cx="-6" cy="-14" rx="14" ry="16" fill="#3d7a5f" opacity="0.5"/>
      <ellipse cx="8" cy="-5" rx="12" ry="14" fill="#2c5545" opacity="0.4"/>
    </g>

    <!-- Right tree -->
    <g transform="translate(330, 300)">
      <rect x="-3" y="0" width="6" height="28" rx="2" fill="#4a3728" opacity="0.6"/>
      <ellipse cx="0" cy="-10" rx="25" ry="28" fill="#2c5545" opacity="0.5"/>
      <ellipse cx="7" cy="-16" rx="16" ry="18" fill="#3d7a5f" opacity="0.45"/>
      <ellipse cx="-8" cy="-6" rx="13" ry="15" fill="#2c5545" opacity="0.35"/>
    </g>

    <!-- Open book at the start of the path -->
    <g transform="translate(200, 375)">
      <!-- Book shadow -->
      <ellipse cx="0" cy="8" rx="28" ry="5" fill="#1e3d31" opacity="0.15"/>
      <!-- Left page -->
      <path d="M-3 0 C-3 -5, -8 -28, -26 -30 L-26 2 C-8 5, -3 4, -3 0Z" fill="#faf9f7" stroke="#2c5545" stroke-width="1.2" stroke-linejoin="round"/>
      <!-- Right page -->
      <path d="M3 0 C3 -5, 8 -28, 26 -30 L26 2 C8 5, 3 4, 3 0Z" fill="#faf9f7" stroke="#2c5545" stroke-width="1.2" stroke-linejoin="round"/>
      <!-- Spine -->
      <path d="M0 -32 L0 4" stroke="#2c5545" stroke-width="1.2"/>
      <!-- Text lines -->
      <g stroke="#dfd9d3" stroke-width="0.8">
        <line x1="-22" y1="-22" x2="-7" y2="-17"/>
        <line x1="-23" y1="-17" x2="-7" y2="-12"/>
        <line x1="-24" y1="-12" x2="-6" y2="-7"/>
        <line x1="7" y1="-17" x2="22" y2="-22"/>
        <line x1="7" y1="-12" x2="23" y2="-17"/>
        <line x1="6" y1="-7" x2="24" y2="-12"/>
      </g>
    </g>

    <!-- Footsteps on the path -->
    <g fill="#4a3728" opacity="0.3">
      <ellipse cx="197" cy="365" rx="3.5" ry="5.5" transform="rotate(-8 197 365)"/>
      <ellipse cx="192" cy="350" rx="3" ry="5" transform="rotate(-15 192 350)"/>
      <ellipse cx="177" cy="338" rx="3" ry="5" transform="rotate(-20 177 338)"/>
      <ellipse cx="172" cy="322" rx="3" ry="4.5" transform="rotate(5 172 322)"/>
      <ellipse cx="183" cy="308" rx="3" ry="4.5" transform="rotate(15 183 308)"/>
      <ellipse cx="192" cy="295" rx="2.5" ry="4" transform="rotate(5 192 295)"/>
    </g>

    <!-- Small wildflowers -->
    <g>
      <circle cx="155" cy="365" r="2.5" fill="#96793e" opacity="0.6"/>
      <circle cx="152" cy="362" r="2" fill="#96793e" opacity="0.4"/>
      <circle cx="240" cy="358" r="2.5" fill="#96793e" opacity="0.5"/>
      <circle cx="244" cy="355" r="2" fill="#96793e" opacity="0.35"/>
      <circle cx="135" cy="350" r="2" fill="#c4a265" opacity="0.4"/>
      <circle cx="260" cy="345" r="2" fill="#c4a265" opacity="0.35"/>
    </g>

    <!-- Birds in the sky -->
    <g stroke="#2c5545" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.2">
      <path d="M140 85 Q145 80, 150 84 Q155 80, 160 85"/>
      <path d="M250 70 Q254 66, 258 69 Q262 66, 266 70"/>
      <path d="M180 100 Q183 97, 186 99 Q189 97, 192 100"/>
    </g>

    <!-- Sparkles / light particles -->
    <g fill="#96793e">
      <circle cx="200" cy="215" r="2" opacity="0.6"/>
      <circle cx="195" cy="208" r="1.2" opacity="0.4"/>
      <circle cx="207" cy="210" r="1" opacity="0.35"/>
      <circle cx="200" cy="200" r="1.5" opacity="0.3"/>
      <circle cx="192" cy="198" r="0.8" opacity="0.25"/>
      <circle cx="210" cy="202" r="0.8" opacity="0.25"/>
    </g>

    <!-- Light rays from the horizon -->
    <g stroke="#96793e" stroke-width="0.8" opacity="0.08">
      <line x1="200" y1="110" x2="100" y2="20"/>
      <line x1="200" y1="110" x2="150" y2="15"/>
      <line x1="200" y1="110" x2="200" y2="10"/>
      <line x1="200" y1="110" x2="250" y2="15"/>
      <line x1="200" y1="110" x2="300" y2="20"/>
    </g>
  </g>

  <!-- Subtle outer shadow -->
  <circle cx="200" cy="200" r="190" fill="none" stroke="#2c5545" stroke-width="0.5" opacity="0.15"/>
</svg>`;

export const DevScreen: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!DEV_MODE) router.replace('/');
  }, [router]);

  if (!DEV_MODE) return null;

  return (
    <S.Layout>
      <S.Container>
        <S.Title>_dev</S.Title>

        <S.TopTabs>
          <S.TopTab $active>Illustrator</S.TopTab>
        </S.TopTabs>

        <S.Preview>
          <div dangerouslySetInnerHTML={{ __html: FIRST_STEPS_SVG }} />
        </S.Preview>

        <S.CodeBlock>
          <code>{FIRST_STEPS_SVG}</code>
        </S.CodeBlock>
      </S.Container>
    </S.Layout>
  );
};
