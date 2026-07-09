/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CardNewsProject, CardNewsItem, LayoutType } from './types';
import { CardPreview } from './components/CardPreview';
import { EditorPanel } from './components/EditorPanel';
import {
  THEME_PRESETS,
  FONT_PRESETS,
  SAMPLE_NEWS_ARTICLES,
  DEFAULT_PROJECT
} from './constants';
import {
  Sparkles,
  Layout,
  FileText,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Sliders,
  Type as FontIcon,
  Palette,
  Play,
  X,
  Plus,
  HelpCircle,
  Clock
} from 'lucide-react';

export default function App() {
  // Global Card News Project state
  const [project, setProject] = useState<CardNewsProject>(DEFAULT_PROJECT);
  const [activeCardId, setActiveCardId] = useState<string>('default-1');

  // Generator form states
  const [inputText, setInputText] = useState<string>('');
  const [cardCount, setCardCount] = useState<number>(6);
  const [style, setStyle] = useState<string>('informative');

  // UI system states
  const [generating, setGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [activeLeftTab, setActiveLeftTab] = useState<'generate' | 'design' | 'slides'>('generate');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeString, setCurrentTimeString] = useState<string>('');

  // Auto-set first active card when project cards change
  useEffect(() => {
    if (project.cards.length > 0) {
      const activeExists = project.cards.some(c => c.id === activeCardId);
      if (!activeExists) {
        setActiveCardId(project.cards[0].id);
      }
    }
  }, [project.cards, activeCardId]);

  // Real-time UTC clock for professional UI (based on system instructions)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeString(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCard = project.cards.find(c => c.id === activeCardId) || project.cards[0];

  // Load sample article
  const loadSampleArticle = (content: string) => {
    setInputText(content);
  };

  // AI-powered Card News generation function
  const handleGenerateCardNews = async () => {
    if (!inputText.trim()) {
      setGenerateError('요약할 기사나 글 내용을 입력해주세요.');
      return;
    }

    setGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/generate-cardnews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          cardCount,
          style,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '네트워크 응답에 문제가 있습니다.');
      }

      const rawResult = await response.json();

      // Transform result with active theme presets
      const theme = THEME_PRESETS.find(t => t.id === project.theme) || THEME_PRESETS[0];

      const cards: CardNewsItem[] = rawResult.cards.map((card: any, idx: number) => ({
        id: `gen-${Date.now()}-${idx}`,
        slideNumber: card.slideNumber || (idx + 1),
        layout: card.layout || 'text',
        title: card.title || '슬라이드 주제',
        body: card.body || '상세 내용 설명',
        accent: card.accent || '',
        bgGradientStart: card.suggestedBgColor || theme.bgGradientStart,
        bgGradientEnd: card.suggestedBgColor || theme.bgGradientEnd,
        textColor: card.suggestedTextColor || theme.textColor,
        accentColor: card.suggestedAccentColor || theme.accentColor,
        imagePrompt: card.imagePrompt || 'conceptual background design',
        illustrationType: card.illustrationType || 'icon',
        iconName: card.iconName || 'Sparkles',
      }));

      const newProject: CardNewsProject = {
        title: rawResult.title || '새 인공지능 카드뉴스',
        description: rawResult.description || 'AI가 생성한 카드뉴스 요약',
        theme: project.theme,
        fontFamily: project.fontFamily,
        cards,
      };

      setProject(newProject);
      if (cards.length > 0) {
        setActiveCardId(cards[0].id);
      }
      setActiveLeftTab('slides'); // Switch to editor to refine
    } catch (err: any) {
      console.error('Error creating card news:', err);
      setGenerateError(err.message || '카드뉴스 생성에 실패했습니다. API 설정을 확인해주세요.');
    } finally {
      setGenerating(false);
    }
  };

  // Switch design theme and apply colors universally or optionally
  const applyThemeToProject = (themeId: string) => {
    const selectedTheme = THEME_PRESETS.find(t => t.id === themeId);
    if (!selectedTheme) return;

    const updatedCards = project.cards.map(card => ({
      ...card,
      bgGradientStart: selectedTheme.bgGradientStart,
      bgGradientEnd: selectedTheme.bgGradientEnd,
      textColor: selectedTheme.textColor,
      accentColor: selectedTheme.accentColor,
    }));

    setProject({
      ...project,
      theme: themeId,
      cards: updatedCards,
    });
  };

  // Apply typography universally
  const applyFontToProject = (fontFamilyValue: string) => {
    setProject({
      ...project,
      fontFamily: fontFamilyValue,
    });
  };

  // Card Content updates from detailed editor panel
  const handleCardChange = (updatedCard: CardNewsItem) => {
    const updatedCards = project.cards.map(c =>
      c.id === updatedCard.id ? updatedCard : c
    );
    setProject({
      ...project,
      cards: updatedCards,
    });
  };

  // Add individual slide card manually
  const handleAddCard = () => {
    const activeTheme = THEME_PRESETS.find(t => t.id === project.theme) || THEME_PRESETS[0];
    const newSlideNum = project.cards.length + 1;
    const newCard: CardNewsItem = {
      id: `manual-${Date.now()}`,
      slideNumber: newSlideNum,
      layout: 'text',
      title: '새로운 슬라이드 제목',
      body: '상세한 텍스트 내용을 입력하세요.\n줄바꿈을 자유롭게 하실 수 있습니다.',
      accent: '새 정보',
      bgGradientStart: activeTheme.bgGradientStart,
      bgGradientEnd: activeTheme.bgGradientEnd,
      textColor: activeTheme.textColor,
      accentColor: activeTheme.accentColor,
      imagePrompt: 'digital minimal art',
      illustrationType: 'icon',
      iconName: 'Sparkles',
    };

    setProject({
      ...project,
      cards: [...project.cards, newCard],
    });
    setActiveCardId(newCard.id);
  };

  // Delete individual slide card
  const handleDeleteCard = (cardId: string) => {
    if (project.cards.length <= 2) return; // Prevent empty project

    const filteredCards = project.cards
      .filter(c => c.id !== cardId)
      .map((c, idx) => ({
        ...c,
        slideNumber: idx + 1, // Re-index slides
      }));

    setProject({
      ...project,
      cards: filteredCards,
    });
  };

  // Move slide index up or down
  const moveCardOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === project.cards.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updatedCards = [...project.cards];

    // Swap
    const temp = updatedCards[index];
    updatedCards[index] = updatedCards[targetIdx];
    updatedCards[targetIdx] = temp;

    // Fix slide indexes
    const fixedCards = updatedCards.map((c, idx) => ({
      ...c,
      slideNumber: idx + 1,
    }));

    setProject({
      ...project,
      cards: fixedCards,
    });
  };

  // Slideshow navigation helper
  const navigateActiveCard = (direction: 'next' | 'prev') => {
    const currentIdx = project.cards.findIndex(c => c.id === activeCardId);
    if (direction === 'next' && currentIdx < project.cards.length - 1) {
      setActiveCardId(project.cards[currentIdx + 1].id);
    } else if (direction === 'prev' && currentIdx > 0) {
      setActiveCardId(project.cards[currentIdx - 1].id);
    }
  };

  // Full Batch Download - automatically renders and sequentializes downloads
  const handleBatchDownload = async () => {
    for (const card of project.cards) {
      const cardContainer = document.getElementById(`card-news-canvas-${card.slideNumber}`);
      if (cardContainer) {
        // Trigger specific slide button download click programmatically
        const downloadBtn = cardContainer.nextElementSibling?.querySelector('button');
        if (downloadBtn) {
          (downloadBtn as HTMLButtonElement).click();
          // Short timeout to let browser register and download safely
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
      {/* Upper Professional Header bar */}
      <header className="bg-white/95 dark:bg-gray-900/95 border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Meta */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-md font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                AI 카드뉴스 제작기
              </h1>
              <p className="text-[10px] text-gray-400 font-medium">뉴스/긴 글의 소셜 슬라이드 변환 도구</p>
            </div>
          </div>

          {/* Quick info bar & Real-time clock */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs font-semibold bg-gray-50 dark:bg-gray-800/60 px-3.5 py-1.5 rounded-full text-gray-500 dark:text-gray-400">
              <Clock size={12} className="text-emerald-500" />
              <span>{currentTimeString || '2026-07-08 18:30:00 UTC'}</span>
            </div>

            {/* General App Info */}
            <div className="flex items-center space-x-2">
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                PRO EDITION
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

        {/* LEFT COLUMN: Sidebar controllers, Forms, Customizer (5 cols) */}
        <section className="lg:col-span-5 space-y-6">

          {/* Left Side Tab Navigation */}
          <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-900 rounded-xl p-1 shadow-inner">
            {[
              { id: 'generate', label: 'AI 분석 생성', icon: FileText },
              { id: 'slides', label: '슬라이드 편집', icon: Sliders },
              { id: 'design', label: '디자인 설정', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLeftTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeLeftTab === tab.id
                      ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* TAB 1: AI GENERATOR FORM */}
          {activeLeftTab === 'generate' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
                  <Sparkles size={16} className="text-emerald-500" />
                  <span>뉴스 텍스트 입력</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  카드뉴스로 가공할 뉴스 본문이나 장문의 기사를 입력해주세요.
                </p>
              </div>

              {/* Sample Loader */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 block">빠른 테스트 샘플 뉴스 로드</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_NEWS_ARTICLES.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => loadSampleArticle(article.content)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-950/20 transition cursor-pointer"
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Textarea */}
              <div className="space-y-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="여기에 요약할 기사 전문을 복사해서 붙여넣으세요... (최대 3000자)"
                  rows={8}
                  className="w-full text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
                />
                <div className="text-[10px] text-gray-400 text-right">
                  {inputText.length}자 입력됨
                </div>
              </div>

              {/* Advanced creation options */}
              <div className="grid grid-cols-2 gap-4">
                {/* Count Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">
                    추출 슬라이드 장수
                  </label>
                  <select
                    value={cardCount}
                    onChange={(e) => setCardCount(Number(e.target.value))}
                    className="w-full text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
                  >
                    {[5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>
                        {n}장 구성
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone and style option */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">
                    어조 및 가공 스타일
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="informative">기본 정보전달체 (~입니다)</option>
                    <option value="professional">전문적인 기자 어투 (~습니다)</option>
                    <option value="trendy">인스타 해시태그형 (~했음)</option>
                    <option value="friendly">친근한 지식 설명체 (~해요)</option>
                    <option value="emotive">감성적 에세이 칼럼형 (~다)</option>
                  </select>
                </div>
              </div>

              {/* Error Box */}
              {generateError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs">
                  {generateError}
                </div>
              )}

              {/* Action Create button */}
              <button
                onClick={handleGenerateCardNews}
                disabled={generating}
                className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI가 뉴스를 분석하여 쪼개는 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>AI 카드뉴스 생성하기</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: SLIDES LIST & MANAGE */}
          {activeLeftTab === 'slides' && (
            <div className="space-y-6">
              {/* Slides Sorter Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
                    <Layout size={16} className="text-emerald-500" />
                    <span>슬라이드 리스트 ({project.cards.length}장)</span>
                  </h3>

                  <button
                    onClick={handleAddCard}
                    className="flex items-center space-x-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>추가</span>
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {project.cards.map((card, idx) => (
                    <div
                      key={card.id}
                      onClick={() => setActiveCardId(card.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition ${
                        activeCardId === card.id
                          ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10'
                          : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <span className="text-xs font-bold font-inter text-gray-400 bg-gray-50 dark:bg-gray-800/80 w-6 h-6 rounded flex items-center justify-center shrink-0">
                          {card.slideNumber}
                        </span>
                        <div className="truncate">
                          <span className="text-[10px] font-semibold text-emerald-500 uppercase block leading-none">
                            {card.layout}
                          </span>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate block mt-1">
                            {card.title || card.body}
                          </span>
                        </div>
                      </div>

                      {/* Swap order buttons */}
                      <div className="flex items-center space-x-1 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          disabled={idx === 0}
                          onClick={() => moveCardOrder(idx, 'up')}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 disabled:opacity-25"
                        >
                          <ChevronLeft size={14} className="transform rotate-90" />
                        </button>
                        <button
                          disabled={idx === project.cards.length - 1}
                          onClick={() => moveCardOrder(idx, 'down')}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 disabled:opacity-25"
                        >
                          <ChevronRight size={14} className="transform rotate-90" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embedded Interactive Card Editor */}
              <EditorPanel
                card={activeCard}
                onChange={handleCardChange}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                totalCards={project.cards.length}
              />
            </div>
          )}

          {/* TAB 3: UNIVERSAL DESIGN STYLE CONFIG */}
          {activeLeftTab === 'design' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Theme Presets */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1">
                  <Palette size={12} />
                  <span>테마 프리셋 (일괄 적용)</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_PRESETS.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => applyThemeToProject(theme.id)}
                      className={`flex flex-col text-left p-3 rounded-xl border transition cursor-pointer ${
                        project.theme === theme.id
                          ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10'
                          : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {theme.name}
                      </span>
                      {/* Color dots preview */}
                      <div className="flex items-center space-x-1.5 mt-2">
                        <div className="w-4.5 h-4.5 rounded-full border border-gray-100 dark:border-gray-700" style={{ backgroundColor: theme.bgGradientStart }} />
                        <div className="w-4.5 h-4.5 rounded-full border border-gray-100 dark:border-gray-700" style={{ backgroundColor: theme.bgGradientEnd }} />
                        <div className="w-4.5 h-4.5 rounded-full border border-gray-100 dark:border-gray-700" style={{ backgroundColor: theme.textColor }} />
                        <div className="w-4.5 h-4.5 rounded-full border border-gray-100 dark:border-gray-700" style={{ backgroundColor: theme.accentColor }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Presets */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1">
                  <FontIcon size={12} />
                  <span>서체/폰트 패밀리</span>
                </h4>
                <div className="space-y-2">
                  {FONT_PRESETS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => applyFontToProject(font.fontFamily)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer ${
                        project.fontFamily === font.fontFamily
                          ? 'border-emerald-500 bg-emerald-50/10'
                          : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{font.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5">{font.fontFamily}</span>
                      </div>
                      <span className={`text-base font-extrabold ${font.titleClass}`}>가나다</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </section>

        {/* RIGHT COLUMN: Interactive live slides view (7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-6">

          {/* Core Slidshow header & universal triggers */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left w-full sm:w-auto">
              <h2 className="text-sm font-extrabold text-gray-800 dark:text-gray-100 truncate max-w-sm">
                {project.title}
              </h2>
              <p className="text-xs text-gray-400 mt-1 truncate max-w-sm">
                {project.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              {/* Play Slider mode */}
              <button
                onClick={() => setIsPlaying(true)}
                className="flex items-center space-x-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition shadow-sm cursor-pointer"
              >
                <Play size={14} />
                <span>프레젠테이션</span>
              </button>

              {/* Instant batch zip helper */}
              <button
                onClick={handleBatchDownload}
                className="flex items-center space-x-1.5 text-xs font-bold border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition cursor-pointer"
              >
                <Download size={14} />
                <span>전체 슬라이드 저장</span>
              </button>
            </div>
          </div>

          {/* Display Card Canvas Box Container */}
          <div className="relative py-4 flex items-center justify-center">
            {/* Nav Left Arrow */}
            <button
              disabled={project.cards.findIndex(c => c.id === activeCardId) === 0}
              onClick={() => navigateActiveCard('prev')}
              className="absolute left-[-20px] sm:left-[-12px] z-25 w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center shadow hover:bg-gray-50 transition cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Interactive Preview Canvas */}
            <div className="w-full">
              <CardPreview
                card={activeCard}
                fontFamily={project.fontFamily}
                totalCards={project.cards.length}
              />
            </div>

            {/* Nav Right Arrow */}
            <button
              disabled={project.cards.findIndex(c => c.id === activeCardId) === project.cards.length - 1}
              onClick={() => navigateActiveCard('next')}
              className="absolute right-[-20px] sm:right-[-12px] z-25 w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center shadow hover:bg-gray-50 transition cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Quick Indicator Carousel Dots */}
          <div className="flex items-center justify-center space-x-2">
            {project.cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => setActiveCardId(card.id)}
                className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                  activeCardId === card.id
                    ? 'w-8 bg-emerald-500'
                    : 'bg-gray-300 dark:bg-gray-800 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

        </section>

      </main>

      {/* FULLSCREEN SLIDESHOW PLAYER MODAL */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X size={28} />
          </button>

          <div className="w-full max-w-2xl flex items-center justify-between gap-4">
            {/* Left Prev */}
            <button
              disabled={project.cards.findIndex(c => c.id === activeCardId) === 0}
              onClick={() => navigateActiveCard('prev')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-20 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Scale Slide view */}
            <div className="flex-1 max-w-lg aspect-square">
              <div
                className="w-full h-full rounded-2xl flex flex-col p-8 select-none shadow-2xl relative"
                style={{
                  background: `linear-gradient(135deg, ${activeCard.bgGradientStart}, ${activeCard.bgGradientEnd})`,
                  fontFamily: project.fontFamily,
                  color: activeCard.textColor,
                }}
              >
                {/* Visual Header */}
                <div className="flex items-center justify-between w-full mb-6 text-xs tracking-wider opacity-60">
                  <span>AI PRESENTATION</span>
                  <span className="font-bold">
                    {activeCard.slideNumber} / {project.cards.length}
                  </span>
                </div>

                {/* Body details */}
                <div className="flex-1 flex flex-col justify-center text-left">
                  {activeCard.layout === 'title' ? (
                    <div className="space-y-3">
                      {activeCard.accent && (
                        <span className="px-3 py-1 bg-white/10 text-xs font-bold rounded-lg" style={{ color: activeCard.accentColor }}>
                          {activeCard.accent}
                        </span>
                      )}
                      <h1 className="text-3xl font-extrabold tracking-tight">{activeCard.title}</h1>
                      <p className="text-sm opacity-85 font-notosans whitespace-pre-wrap">{activeCard.body}</p>
                    </div>
                  ) : activeCard.layout === 'quote' ? (
                    <div className="relative pl-4 space-y-4">
                      <span className="absolute top-[-30px] left-0 text-[100px] leading-none opacity-20" style={{ color: activeCard.accentColor }}>“</span>
                      <p className="text-xl font-bold font-gowunbatang whitespace-pre-wrap z-10">{activeCard.body.replace(/"/g, '')}</p>
                      {activeCard.accent && <p className="text-xs font-semibold opacity-70">- {activeCard.accent} -</p>}
                    </div>
                  ) : activeCard.layout === 'stat' ? (
                    <div className="space-y-3">
                      <div className="text-6xl font-black" style={{ color: activeCard.accentColor }}>{activeCard.accent}</div>
                      <div className="w-12 h-1 rounded" style={{ backgroundColor: activeCard.textColor }} />
                      <h2 className="text-lg font-bold">{activeCard.title}</h2>
                      <p className="text-xs opacity-80 font-notosans">{activeCard.body}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold">{activeCard.title}</h2>
                      <p className="text-xs opacity-85 font-notosans whitespace-pre-wrap">{activeCard.body}</p>
                    </div>
                  )}
                </div>

                {/* Footer brand */}
                <div className="mt-6 pt-4 border-t border-white/5 opacity-40 text-[9px] tracking-widest text-center">
                  MADE WITH AI CARDNEWS GENERATOR
                </div>
              </div>
            </div>

            {/* Right Next */}
            <button
              disabled={project.cards.findIndex(c => c.id === activeCardId) === project.cards.length - 1}
              onClick={() => navigateActiveCard('next')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-20 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
