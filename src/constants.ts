/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemePreset, FontPreset, CardNewsProject } from './types';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'modern-dark',
    name: '모던 다크 (시크)',
    bgGradientStart: '#111827',
    bgGradientEnd: '#1F2937',
    textColor: '#F9FAFB',
    accentColor: '#10B981', // Emerald
  },
  {
    id: 'business-blue',
    name: '신뢰의 블루 (시사 뉴스)',
    bgGradientStart: '#0F172A',
    bgGradientEnd: '#1E3A8A',
    textColor: '#F8FAFC',
    accentColor: '#3B82F6', // Blue
  },
  {
    id: 'calm-pastel',
    name: '차분한 파스텔 (스토리)',
    bgGradientStart: '#FDF2F8',
    bgGradientEnd: '#FCE7F3',
    textColor: '#374151',
    accentColor: '#DB2777', // Pink
  },
  {
    id: 'neon-pop',
    name: '네온 팝 (트렌디)',
    bgGradientStart: '#0F051D',
    bgGradientEnd: '#2D0B5A',
    textColor: '#FFFFFF',
    accentColor: '#F43F5E', // Rose
  },
  {
    id: 'warm-cream',
    name: '감성 크림 (칼럼)',
    bgGradientStart: '#FAF8F5',
    bgGradientEnd: '#F5EFEB',
    textColor: '#292524',
    accentColor: '#D97706', // Amber
  },
  {
    id: 'mint-fresh',
    name: '싱그러운 민트 (정보)',
    bgGradientStart: '#ECFDF5',
    bgGradientEnd: '#D1FAE5',
    textColor: '#064E3B',
    accentColor: '#059669', // Emerald Green
  },
];

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'blackhansans',
    name: '검은고딕 (굵은 타이틀)',
    fontFamily: 'var(--font-blackhansans)',
    titleClass: 'font-blackhansans',
    bodyClass: 'font-notosans',
  },
  {
    id: 'dohyeon',
    name: '도현체 (귀엽고 볼드)',
    fontFamily: 'var(--font-dohyeon)',
    titleClass: 'font-dohyeon',
    bodyClass: 'font-notosans',
  },
  {
    id: 'notosans',
    name: '본고딕 (정갈함)',
    fontFamily: 'var(--font-notosans)',
    titleClass: 'font-notosans font-bold',
    bodyClass: 'font-notosans',
  },
  {
    id: 'gowunbatang',
    name: '고운바탕 (따뜻한 명조)',
    fontFamily: 'var(--font-gowunbatang)',
    titleClass: 'font-gowunbatang font-bold',
    bodyClass: 'font-gowunbatang',
  },
  {
    id: 'nanummyeongjo',
    name: '나눔명조 (격식있는 신문)',
    fontFamily: 'var(--font-nanummyeongjo)',
    titleClass: 'font-nanummyeongjo font-extrabold',
    bodyClass: 'font-nanummyeongjo',
  },
];

export const SAMPLE_NEWS_ARTICLES = [
  {
    id: 'sample-ai',
    title: '인공지능(AI) 혁명과 윤리',
    content: `최근 생성형 인공지능(AI) 기술이 급속도로 발전하면서 인간의 창작 고유 영역에 도전하고 있습니다. 일자리 대체 우려와 가짜 뉴스, 딥페이크 확산 등 윤리적 문제도 심각해지고 있습니다. 전문가들은 혁신을 장려하되 적절한 규제 안전장치를 신속히 구축해야 한다고 조언합니다. 특히 미국과 EU 등 세계 각국은 이미 AI 가이드라인 입법 절차에 돌입했으며, 기술 기업들도 스스로 책임감 있는 AI 원칙을 세우는 중입니다.`,
  },
  {
    id: 'sample-health',
    title: '현대인의 수면 부족 실태와 해결책',
    content: `성인의 절반 이상이 만성적인 수면 부족을 겪고 있다는 보도가 나왔습니다. 스마트폰 블루라이트의 야간 노출과 잦은 카페인 섭취가 멜라토닌 분비를 방해하는 핵심 원인입니다. 하루 7~8시간의 규칙적인 수면은 심혈관 질환 예방과 면역력 증진에 지대한 영향을 미칩니다. 전문가들은 '수면 위생' 수칙으로 취침 1시간 전 스마트폰 사용 금지, 일정한 기상 시간 유지, 가벼운 저녁 식사를 권장합니다.`,
  },
  {
    id: 'sample-finance',
    title: '글로벌 경기 전망과 재테크 전략',
    content: `올해 하반기 세계 경제는 인플레이션 둔화 조짐과 함께 금리 인하 기대감이 교차하며 조심스러운 반등이 예상됩니다. 다만 원자재 가격 변동성과 지정학적 불안정이 상존해 있어 변동성은 여전히 높을 전망입니다. 이러한 시기에 전문가들은 자산의 과도한 레버리지를 피하고, 안정적인 배당주나 우량 채권 비율을 늘리는 분산 투자가 현명한 생존 전략이라고 귀뎠습니다. 무리한 단기 투자보다는 장기적 관점이 필요합니다.`,
  },
];

export const DEFAULT_PROJECT: CardNewsProject = {
  title: '새 카드뉴스 프로젝트',
  description: '뉴스에서 카드뉴스를 쉽고 멋지게 요약하여 추출해보세요.',
  theme: 'modern-dark',
  fontFamily: 'var(--font-blackhansans)',
  cards: [
    {
      id: 'default-1',
      slideNumber: 1,
      layout: 'title',
      title: '나만의 스마트한\nAI 카드뉴스 제작기',
      body: '복잡하고 긴 뉴스를 한눈에 들어오는\n아름다운 이미지 슬라이드로\n지금 바로 변환해 보세요!',
      accent: 'AI 카드뉴스',
      bgGradientStart: '#111827',
      bgGradientEnd: '#1F2937',
      textColor: '#F9FAFB',
      accentColor: '#10B981',
      imagePrompt: 'newspaper technology ai',
      illustrationType: 'icon',
      iconName: 'Sparkles',
    },
    {
      id: 'default-2',
      slideNumber: 2,
      layout: 'text',
      title: '쉽고 간편한 텍스트 분석',
      body: '인터넷 기사나 긴 글을 복사해서 붙여넣기만 하면,\n인공지능이 핵심 정보만을 엄선하여\n5~10장의 깔끔한 구성으로 자동 변환합니다.',
      accent: '텍스트 분석',
      bgGradientStart: '#111827',
      bgGradientEnd: '#1F2937',
      textColor: '#F9FAFB',
      accentColor: '#10B981',
      imagePrompt: 'brain scan digital tech',
      illustrationType: 'circle',
      iconName: 'Cpu',
    },
    {
      id: 'default-3',
      slideNumber: 3,
      layout: 'stat',
      title: '소셜 미디어 최적화 규격',
      body: '기본 1:1 정방형 규격을 제공하여\n인스타그램 피드나 카카오톡 공유 등\n모바일 가독성을 완벽하게 보장합니다.',
      accent: '100%',
      bgGradientStart: '#111827',
      bgGradientEnd: '#1F2937',
      textColor: '#F9FAFB',
      accentColor: '#10B981',
      imagePrompt: 'social media mobile phone',
      illustrationType: 'icon',
      iconName: 'Smartphone',
    },
    {
      id: 'default-4',
      slideNumber: 4,
      layout: 'quote',
      title: '감동을 주는 한 문장',
      body: '"한 장의 요약된 카드뉴스는\n백 페이지짜리 무거운 책보다\n더 많은 대중에게 가 닿습니다."',
      accent: '소셜 미디어 전문가',
      bgGradientStart: '#111827',
      bgGradientEnd: '#1F2937',
      textColor: '#F9FAFB',
      accentColor: '#10B981',
      imagePrompt: 'quote speech bubble creative',
      illustrationType: 'shape',
      iconName: 'Quote',
    },
    {
      id: 'default-5',
      slideNumber: 5,
      layout: 'closing',
      title: '지금 바로 시작해보세요!',
      body: '왼쪽 텍스트 입력창에 뉴스를 넣고\n[AI 카드뉴스 생성하기]를 클릭하여\n나만의 뉴스 콘텐츠를 직접 경험해보세요.',
      accent: '카드뉴스 다운로드',
      bgGradientStart: '#111827',
      bgGradientEnd: '#1F2937',
      textColor: '#F9FAFB',
      accentColor: '#10B981',
      imagePrompt: 'rocket start launch sky',
      illustrationType: 'icon',
      iconName: 'Rocket',
    },
  ],
};
