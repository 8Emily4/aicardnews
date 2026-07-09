/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LayoutType = 'title' | 'text' | 'split' | 'stat' | 'quote' | 'closing';

export interface CardNewsItem {
  id: string;
  slideNumber: number;
  layout: LayoutType;
  title: string;
  body: string;
  accent: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  textColor: string;
  accentColor: string;
  imagePrompt: string;
  illustrationType: 'none' | 'icon' | 'shape' | 'circle';
  iconName: string;
}

export interface CardNewsProject {
  title: string;
  description: string;
  theme: string;
  fontFamily: string;
  cards: CardNewsItem[];
}

export interface ThemePreset {
  id: string;
  name: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  textColor: string;
  accentColor: string;
}

export interface FontPreset {
  id: string;
  name: string;
  fontFamily: string;
  titleClass: string;
  bodyClass: string;
}
