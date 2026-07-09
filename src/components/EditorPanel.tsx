/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CardNewsItem, LayoutType } from '../types';
import { Layout, Type, Edit3, Image, Award, Eye } from 'lucide-react';

interface EditorPanelProps {
  card: CardNewsItem | undefined;
  onChange: (updatedCard: CardNewsItem) => void;
  onAddCard: () => void;
  onDeleteCard: (id: string) => void;
  totalCards: number;
}

const AVAILABLE_ICONS = [
  'Sparkles', 'Newspaper', 'TrendingUp', 'TrendingDown', 'HelpCircle', 'Quote',
  'AlertCircle', 'Info', 'Calendar', 'Lightbulb', 'Target', 'Users',
  'Landmark', 'Award', 'Activity', 'Heart', 'Shield', 'Cpu', 'Cloud',
  'Globe', 'BookOpen', 'MessageSquare', 'Zap', 'Star', 'Flame', 'Trophy'
];

export const EditorPanel: React.FC<EditorPanelProps> = ({
  card,
  onChange,
  onAddCard,
  onDeleteCard,
  totalCards
}) => {
  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl h-64">
        <Edit3 size={32} className="text-gray-300 mb-2 animate-bounce" />
        <p className="text-sm font-medium text-gray-500">편집할 슬라이드를 리스트에서 선택해주세요.</p>
      </div>
    );
  }

  const handleFieldChange = (field: keyof CardNewsItem, value: any) => {
    onChange({
      ...card,
      [field]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
            <Edit3 size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
            슬라이드 {card.slideNumber} 상세 편집
          </h3>
        </div>

        {totalCards > 2 && (
          <button
            onClick={() => onDeleteCard(card.id)}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/40 cursor-pointer"
          >
            삭제
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Layout Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center space-x-1">
            <Layout size={12} />
            <span>레이아웃 구성</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'title', label: '타이틀/대문' },
              { id: 'text', label: '일반 본문형' },
              { id: 'split', label: '그래픽 분할형' },
              { id: 'stat', label: '수치강조형' },
              { id: 'quote', label: '명언/인용구' },
              { id: 'closing', label: '아웃트로형' },
            ].map((layoutOption) => (
              <button
                key={layoutOption.id}
                onClick={() => handleFieldChange('layout', layoutOption.id as LayoutType)}
                className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition cursor-pointer ${
                  card.layout === layoutOption.id
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {layoutOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Fields based on layout */}
        {card.layout !== 'quote' && (
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">
              슬라이드 소제목 / 키워드
            </label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="예: 현대 사회의 수면 실태"
              className="w-full text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">
            {card.layout === 'quote' ? '인용구 본문' : '슬라이드 본문 설명'}
          </label>
          <textarea
            value={card.body}
            onChange={(e) => handleFieldChange('body', e.target.value)}
            rows={3}
            placeholder="예: 스마트폰 블루라이트 노출이\n우리 수면의 핵심 방해물입니다."
            className="w-full text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-500 font-sans whitespace-pre-wrap"
          />
          <p className="text-[10px] text-gray-400 mt-0.5">
            * 모바일 가독성을 위해 개행(Enter)을 자유롭게 사용하여 문장을 짧게 구성하세요.
          </p>
        </div>

        {/* Accent content field */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5 flex items-center justify-between">
            <span>
              {card.layout === 'stat' ? '강조 수치 (Stat)' : card.layout === 'quote' ? '인용구 출처/화자' : '포인트 키워드'}
            </span>
            <span className="text-[10px] font-normal text-gray-400">
              {card.layout === 'stat' ? '* 숫자로 강조' : ''}
            </span>
          </label>
          <input
            type="text"
            value={card.accent}
            onChange={(e) => handleFieldChange('accent', e.target.value)}
            placeholder={card.layout === 'stat' ? '92.5%' : card.layout === 'quote' ? '김철수 연구원' : '수면 부족'}
            className="w-full text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Visual Element & Icon */}
        {(card.layout === 'text' || card.layout === 'split') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">
                데코 유형
              </label>
              <select
                value={card.illustrationType}
                onChange={(e) => handleFieldChange('illustrationType', e.target.value)}
                className="w-full text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="none">비주얼 없음</option>
                <option value="icon">중앙 벡터 아이콘</option>
                <option value="circle">우측 원형 구체</option>
                <option value="shape">하단 기하학 파형</option>
              </select>
            </div>

            {card.illustrationType === 'icon' && (
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">
                  추천 아이콘
                </label>
                <select
                  value={card.iconName}
                  onChange={(e) => handleFieldChange('iconName', e.target.value)}
                  className="w-full text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
                >
                  {AVAILABLE_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Visual prompt helper */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5 flex items-center space-x-1">
            <Image size={12} />
            <span>비주얼 묘사 / 검색 쿼리</span>
          </label>
          <input
            type="text"
            value={card.imagePrompt}
            onChange={(e) => handleFieldChange('imagePrompt', e.target.value)}
            placeholder="예: technology business digital graph"
            className="w-full text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        {/* Color Palette customization */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <label className="block text-xs font-bold text-gray-400 mb-2">
            슬라이드 전용 색상 커스텀
          </label>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">배경 시작</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={card.bgGradientStart}
                  onChange={(e) => handleFieldChange('bgGradientStart', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                />
                <span className="text-[10px] font-mono opacity-60 uppercase">{card.bgGradientStart}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 block mb-1">배경 끝</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={card.bgGradientEnd}
                  onChange={(e) => handleFieldChange('bgGradientEnd', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                />
                <span className="text-[10px] font-mono opacity-60 uppercase">{card.bgGradientEnd}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 block mb-1">본문 글자</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={card.textColor}
                  onChange={(e) => handleFieldChange('textColor', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                />
                <span className="text-[10px] font-mono opacity-60 uppercase">{card.textColor}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 block mb-1">강조 포인트</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={card.accentColor}
                  onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                />
                <span className="text-[10px] font-mono opacity-60 uppercase">{card.accentColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
