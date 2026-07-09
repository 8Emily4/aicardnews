/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { CardNewsItem } from '../types';
import * as LucideIcons from 'lucide-react';
import { Play, Download, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface CardPreviewProps {
  card: CardNewsItem;
  fontFamily: string;
  totalCards: number;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card, fontFamily, totalCards }) => {
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic Lucide Icon mapping
  const renderIcon = (name: string, size = 48, color = card.accentColor) => {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) {
      return <IconComponent size={size} style={{ color }} />;
    }
    return <LucideIcons.Sparkles size={size} style={{ color }} />;
  };

  // Wrap text helper for Canvas API
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    // First, split by explicit newline character
    const paragraphs = text.split('\n');
    const lines: string[] = [];

    for (const paragraph of paragraphs) {
      const words = paragraph.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + (currentLine ? ' ' : '') + words[n];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          lines.push(currentLine);
          currentLine = words[n];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);
    }
    return lines;
  };

  // Perfect Canvas HD Renderer (1080x1080 px for social media)
  const downloadAsImage = async () => {
    setDownloading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 1080;
      canvas.width = size;
      canvas.height = size;

      // 1. Draw Beautiful Gradient Background
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, card.bgGradientStart);
      gradient.addColorStop(1, card.bgGradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // 2. Draw Decorative Shapes/Circles
      if (card.illustrationType === 'circle') {
        ctx.fillStyle = `${card.accentColor}1A`; // 10% opacity
        ctx.beginPath();
        ctx.arc(size * 0.8, size * 0.2, 350, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `${card.accentColor}33`; // 20% opacity
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(size * 0.8, size * 0.2, 420, 0, Math.PI * 2);
        ctx.stroke();
      } else if (card.illustrationType === 'shape') {
        ctx.fillStyle = `${card.accentColor}0D`; // 5% opacity
        ctx.beginPath();
        ctx.moveTo(0, size * 0.6);
        ctx.lineTo(size * 0.5, size * 0.8);
        ctx.lineTo(size, size * 0.5);
        ctx.lineTo(size, size);
        ctx.lineTo(0, size);
        ctx.closePath();
        ctx.fill();
      }

      // 3. Setup Custom Fonts
      // Map css variables to standard font family names for system
      let finalFontFamily = 'sans-serif';
      if (fontFamily.includes('blackhansans')) finalFontFamily = '"Black Han Sans"';
      else if (fontFamily.includes('dohyeon')) finalFontFamily = '"Do Hyeon"';
      else if (fontFamily.includes('gowunbatang')) finalFontFamily = '"Gowun Batang"';
      else if (fontFamily.includes('nanummyeongjo')) finalFontFamily = '"Nanum Myeongjo"';
      else if (fontFamily.includes('notosans')) finalFontFamily = '"Noto Sans KR"';

      // 4. Draw Header/Logo watermark (Social card vibe)
      ctx.fillStyle = `${card.textColor}66`; // 40% opacity
      ctx.font = `600 24px "Inter", sans-serif`;
      ctx.fillText('AI CARD NEWS', 80, 100);

      // Draw Top right page indicator (e.g. 02 / 06)
      ctx.fillStyle = card.accentColor;
      ctx.font = `bold 28px "Inter", sans-serif`;
      const slideNumText = `${String(card.slideNumber).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
      ctx.fillText(slideNumText, size - 180, 100);

      // 5. Draw Slide Layouts
      ctx.fillStyle = card.textColor;

      if (card.layout === 'title') {
        // --- TITLE LAYOUT ---
        // Big badge/accent
        if (card.accent) {
          ctx.fillStyle = `${card.accentColor}26`; // 15% opacity
          const badgeWidth = ctx.measureText(card.accent).width + 40;
          ctx.beginPath();
          ctx.roundRect(80, 220, badgeWidth + 20, 56, 12);
          ctx.fill();

          ctx.fillStyle = card.accentColor;
          ctx.font = `bold 24px ${finalFontFamily}, "Noto Sans KR", sans-serif`;
          ctx.fillText(card.accent.toUpperCase(), 100, 256);
        }

        // Large Headline Title
        ctx.fillStyle = card.textColor;
        ctx.font = `800 68px ${finalFontFamily}, sans-serif`;
        const titleLines = wrapText(ctx, card.title, size - 160);
        let titleY = 370;
        titleLines.forEach((line) => {
          ctx.fillText(line, 80, titleY);
          titleY += 90;
        });

        // Sub/Body Text
        ctx.fillStyle = `${card.textColor}D9`; // 85% opacity
        ctx.font = `400 34px "Noto Sans KR", sans-serif`;
        const bodyLines = wrapText(ctx, card.body, size - 160);
        let bodyY = titleY + 30;
        bodyLines.forEach((line) => {
          ctx.fillText(line, 80, bodyY);
          bodyY += 56;
        });

        // Aesthetic Accent bar
        ctx.fillStyle = card.accentColor;
        ctx.fillRect(80, size - 100, 120, 8);

      } else if (card.layout === 'quote') {
        // --- QUOTE LAYOUT ---
        // Huge quote marks
        ctx.fillStyle = `${card.accentColor}40`; // 25% opacity
        ctx.font = `italic 800 300px ${finalFontFamily}, "Nanum Myeongjo", serif`;
        ctx.fillText('“', 80, 420);

        // Core Quote Text
        ctx.fillStyle = card.textColor;
        ctx.font = `700 48px ${finalFontFamily}, "Nanum Myeongjo", serif`;
        const quoteLines = wrapText(ctx, card.body.replace(/"/g, ''), size - 240);
        let quoteY = 320;
        quoteLines.forEach((line) => {
          ctx.fillText(line, 140, quoteY);
          quoteY += 72;
        });

        // Close quote mark
        ctx.fillStyle = `${card.accentColor}40`;
        ctx.font = `italic 800 300px ${finalFontFamily}, "Nanum Myeongjo", serif`;
        ctx.fillText('”', size - 240, quoteY + 120);

        // Caption Author Accent
        if (card.accent) {
          ctx.fillStyle = card.accentColor;
          ctx.font = `bold 28px "Noto Sans KR", sans-serif`;
          ctx.fillText(`- ${card.accent} -`, 140, quoteY + 60);
        }

      } else if (card.layout === 'stat') {
        // --- STAT LAYOUT ---
        // Big Statistic Value
        ctx.fillStyle = card.accentColor;
        ctx.font = `900 180px "Inter", sans-serif`;
        ctx.fillText(card.accent, 80, 320);

        // Line Divider
        ctx.fillStyle = `${card.textColor}40`;
        ctx.fillRect(80, 360, size - 160, 4);

        // Slide Title (Statistical description)
        ctx.fillStyle = card.textColor;
        ctx.font = `800 52px ${finalFontFamily}, sans-serif`;
        const statTitleLines = wrapText(ctx, card.title, size - 160);
        let statTitleY = 440;
        statTitleLines.forEach((line) => {
          ctx.fillText(line, 80, statTitleY);
          statTitleY += 70;
        });

        // Detail Context
        ctx.fillStyle = `${card.textColor}D9`;
        ctx.font = `400 32px "Noto Sans KR", sans-serif`;
        const statBodyLines = wrapText(ctx, card.body, size - 160);
        let statBodyY = statTitleY + 30;
        statBodyLines.forEach((line) => {
          ctx.fillText(line, 80, statBodyY);
          statBodyY += 52;
        });

      } else if (card.layout === 'closing') {
        // --- CLOSING/OUTRO LAYOUT ---
        // Highlight Box
        ctx.fillStyle = `${card.accentColor}12`; // 7% opacity
        ctx.beginPath();
        ctx.roundRect(80, 220, size - 160, size - 380, 24);
        ctx.fill();
        ctx.strokeStyle = `${card.accentColor}40`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Thank you / Call to action title
        ctx.fillStyle = card.textColor;
        ctx.font = `800 56px ${finalFontFamily}, sans-serif`;
        const closingTitleLines = wrapText(ctx, card.title, size - 240);
        let closingTitleY = 320;
        closingTitleLines.forEach((line) => {
          ctx.fillText(line, 140, closingTitleY);
          closingTitleY += 76;
        });

        // Closing Body Text
        ctx.fillStyle = `${card.textColor}E6`;
        ctx.font = `500 34px "Noto Sans KR", sans-serif`;
        const closingBodyLines = wrapText(ctx, card.body, size - 240);
        let closingBodyY = closingTitleY + 40;
        closingBodyLines.forEach((line) => {
          ctx.fillText(line, 140, closingBodyY);
          closingBodyY += 56;
        });

        // Interaction cue at the bottom
        ctx.fillStyle = card.accentColor;
        ctx.font = `bold 28px "Noto Sans KR", sans-serif`;
        ctx.fillText('♥ 좋아요 | 💬 댓글 | 👤 공유하기', size / 2 - 220, size - 200);

      } else {
        // --- TEXT or SPLIT LAYOUT (Standard) ---
        // Decorative Vector Icon
        if (card.illustrationType === 'icon' || card.layout === 'split') {
          // Draw a soft glowing backdrop for the icon
          ctx.fillStyle = `${card.accentColor}26`;
          ctx.beginPath();
          ctx.arc(140, 260, 60, 0, Math.PI * 2);
          ctx.fill();

          // Standard font glyph-like or simple shape representation of icon
          // Since drawing custom SVG paths is complex, we draw an elegant gear, target, or sparkle with canvas
          ctx.fillStyle = card.accentColor;
          ctx.beginPath();
          ctx.arc(140, 260, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = card.accentColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(140, 260, 36, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Slide Title (General)
        ctx.fillStyle = card.textColor;
        ctx.font = `800 54px ${finalFontFamily}, sans-serif`;
        const standardTitleLines = wrapText(ctx, card.title, size - 160);
        let standardTitleY = card.illustrationType === 'icon' || card.layout === 'split' ? 380 : 280;
        standardTitleLines.forEach((line) => {
          ctx.fillText(line, 80, standardTitleY);
          standardTitleY += 74;
        });

        // Slide Body
        ctx.fillStyle = `${card.textColor}E6`;
        ctx.font = `400 34px "Noto Sans KR", sans-serif`;
        const standardBodyLines = wrapText(ctx, card.body, size - 160);
        let standardBodyY = standardTitleY + 30;
        standardBodyLines.forEach((line) => {
          ctx.fillText(line, 80, standardBodyY);
          standardBodyY += 56;
        });

        // Subtle accent block
        if (card.accent) {
          ctx.fillStyle = `${card.accentColor}1F`;
          ctx.fillRect(80, standardBodyY + 30, size - 160, 70);
          ctx.fillStyle = card.accentColor;
          ctx.font = `bold 26px "Noto Sans KR", sans-serif`;
          ctx.fillText(`• ${card.accent}`, 110, standardBodyY + 74);
        }
      }

      // 6. Download the file as PNG
      const link = document.createElement('a');
      link.download = `cardnews_slide_${card.slideNumber}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Canvas rendering failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  // UI rendering with customized preview style according to layout
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* 1:1 Aspect Ratio Instagram Sandbox Card */}
      <div
        id={`card-news-canvas-${card.slideNumber}`}
        className="relative w-full aspect-square rounded-2xl shadow-xl overflow-hidden transition-all duration-300 flex flex-col p-8 sm:p-10 select-none"
        style={{
          background: `linear-gradient(135deg, ${card.bgGradientStart}, ${card.bgGradientEnd})`,
          fontFamily: fontFamily,
          color: card.textColor,
        }}
      >
        {/* Subtle Decorative Background Illumination */}
        {card.illustrationType === 'circle' && (
          <>
            <div
              className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full opacity-10 blur-xl pointer-events-none"
              style={{ backgroundColor: card.accentColor }}
            />
            <div
              className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full border-4 opacity-20 pointer-events-none"
              style={{ borderColor: card.accentColor }}
            />
          </>
        )}

        {card.illustrationType === 'shape' && (
          <div
            className="absolute bottom-[-10%] left-[-15%] right-[-15%] h-[40%] opacity-5 pointer-events-none transform skew-y-6"
            style={{ backgroundColor: card.accentColor }}
          />
        )}

        {/* Top Header Watermark & Slide Index */}
        <div className="flex items-center justify-between w-full mb-8 z-10">
          <span className="text-xs tracking-wider opacity-50 font-semibold font-inter">AI CARD NEWS</span>
          <div
            className="px-2.5 py-0.5 rounded-full text-xs font-bold font-inter"
            style={{ backgroundColor: `${card.accentColor}22`, color: card.accentColor }}
          >
            {String(card.slideNumber).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
          </div>
        </div>

        {/* Body Content according to selected layout */}
        <div className="flex-1 flex flex-col justify-center z-10 w-full relative">
          {card.layout === 'title' && (
            <div className="flex flex-col items-start text-left space-y-4">
              {card.accent && (
                <span
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300"
                  style={{ backgroundColor: `${card.accentColor}26`, color: card.accentColor }}
                >
                  {card.accent}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight whitespace-pre-wrap select-text">
                {card.title}
              </h1>
              <p className="text-sm sm:text-base opacity-85 leading-relaxed font-notosans whitespace-pre-wrap mt-2 select-text">
                {card.body}
              </p>
              {/* Aesthetic anchor lines */}
              <div className="w-16 h-1.5 rounded-full mt-4" style={{ backgroundColor: card.accentColor }} />
            </div>
          )}

          {card.layout === 'quote' && (
            <div className="flex flex-col items-start text-left justify-center relative pl-4">
              <span className="absolute top-[-40px] left-[-15px] text-[120px] font-serif leading-none opacity-20 select-none" style={{ color: card.accentColor }}>
                “
              </span>
              <p className="text-lg sm:text-xl font-bold italic leading-relaxed font-gowunbatang whitespace-pre-wrap z-10 select-text">
                {card.body.replace(/"/g, '')}
              </p>
              {card.accent && (
                <div className="mt-4 flex items-center space-x-2 z-10 select-text">
                  <span className="w-4 h-[2px]" style={{ backgroundColor: card.accentColor }} />
                  <span className="text-xs sm:text-sm font-semibold opacity-80">{card.accent}</span>
                </div>
              )}
            </div>
          )}

          {card.layout === 'stat' && (
            <div className="flex flex-col text-left space-y-4">
              <div className="text-5xl sm:text-6xl font-black tracking-tight select-text" style={{ color: card.accentColor }}>
                {card.accent || '00%'}
              </div>
              <div className="w-full h-[1px] opacity-20" style={{ backgroundColor: card.textColor }} />
              <h2 className="text-lg sm:text-xl font-bold leading-snug whitespace-pre-wrap select-text">
                {card.title}
              </h2>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed font-notosans whitespace-pre-wrap select-text">
                {card.body}
              </p>
            </div>
          )}

          {card.layout === 'closing' && (
            <div
              className="flex flex-col justify-center p-5 sm:p-6 rounded-2xl border text-left space-y-3 relative"
              style={{ backgroundColor: `${card.accentColor}0D`, borderColor: `${card.accentColor}33` }}
            >
              <h2 className="text-xl sm:text-2xl font-bold leading-snug select-text">
                {card.title}
              </h2>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-notosans whitespace-pre-wrap select-text">
                {card.body}
              </p>
              {/* Interaction Call-To-Action */}
              <div className="pt-2 flex items-center space-x-4 text-xs font-semibold select-none opacity-85 mt-2" style={{ color: card.accentColor }}>
                <span>♥ 좋아요</span>
                <span>💬 댓글</span>
                <span>👤 공유하기</span>
              </div>
            </div>
          )}

          {(card.layout === 'text' || card.layout === 'split') && (
            <div className="flex flex-col items-start text-left space-y-3">
              {(card.illustrationType === 'icon' || card.layout === 'split') && (
                <div
                  className="p-3.5 rounded-2xl flex items-center justify-center mb-1"
                  style={{ backgroundColor: `${card.accentColor}1A` }}
                >
                  {renderIcon(card.iconName, 28)}
                </div>
              )}
              <h2 className="text-lg sm:text-xl font-bold leading-snug whitespace-pre-wrap select-text">
                {card.title}
              </h2>
              <p className="text-xs sm:text-sm opacity-85 leading-relaxed font-notosans whitespace-pre-wrap select-text">
                {card.body}
              </p>
              {card.accent && (
                <div
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold mt-2 flex items-center space-x-2 select-text"
                  style={{ backgroundColor: `${card.textColor}10`, color: card.textColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.accentColor }} />
                  <span>{card.accent}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer brand indicator */}
        <div className="w-full flex justify-between items-center z-10 mt-6 pt-4 border-t border-white/5 opacity-40">
          <span className="text-[10px] tracking-widest font-medium font-inter">MADE WITH AI ARTIST</span>
          <span className="text-[10px] font-inter">#CARDNEWS</span>
        </div>
      </div>

      {/* Slide Utilities Panel */}
      <div className="flex items-center justify-between w-full mt-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-gray-400">비주얼 추천 키워드</span>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 italic font-mono">
            "{card.imagePrompt || 'no keywords'}"
          </span>
        </div>

        <button
          onClick={downloadAsImage}
          disabled={downloading}
          className="flex items-center space-x-2 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 px-4 py-2 rounded-lg transition shadow-sm cursor-pointer disabled:opacity-50"
        >
          {downloading ? (
            <div className="w-3.5 h-3.5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={14} />
          )}
          <span>{downloading ? '렌더링 중...' : '슬라이드 저장'}</span>
        </button>
      </div>

      {/* Hidden HD 1080x1080 Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
