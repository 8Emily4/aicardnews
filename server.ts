/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint for Card News Generation
app.post('/api/generate-cardnews', async (req, res) => {
  try {
    const { text, cardCount = 6, style = 'informative' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text input is required' });
    }

    const ai = getGeminiClient();

    // Map style IDs to descriptive system instruction segments
    let styleInstruction = '';
    switch (style) {
      case 'trendy':
        styleInstruction = '인스타그램 타겟의 트렌디하고 힙한 말투(~했음, ~임, 친근한 대화체, 적절한 이모지 활용)를 사용해줘. 독자의 이목을 끌 수 있는 자극적이고 재미있는 소제목과 카피가 필수야.';
        break;
      case 'professional':
        styleInstruction = '신뢰감을 주는 전문 뉴스 아나운서 및 리포터 어투(~습니다, ~입니다, 객관적 서술)를 사용해줘. 비즈니스, 시사 경제 기사 요약에 적절한 격식 있는 명료한 문체여야 해.';
        break;
      case 'friendly':
        styleInstruction = '어려운 IT/테크/과학 상식이나 전문 지식도 초등학생도 이해할 수 있게 차근차근 다정하게 설명하는 어투(~해요, ~랍니다, 질문 던지기)를 사용해줘. 비유적 표현을 환영해.';
        break;
      case 'emotive':
        styleInstruction = '에세이나 칼럼처럼 따뜻하고 감성적이며 여운이 남는 깊이 있는 문체(~다, ~을 생각해보게 된다)를 사용해줘. 인문학적 성찰이나 마인드풀니스, 철학 요약에 어울리는 감각적 서사 방식이야.';
        break;
      default:
        styleInstruction = '깔끔하고 명확한 일반 정보성 정보 전달 어투(~입니다, ~가 있습니다)를 사용해줘. 객관적 사실을 불필요한 사족 없이 군더더기 없게 요약 정리해야 해.';
    }

    const systemInstruction = `
너는 긴 뉴스 기사나 장문의 글을 가독성이 높고 멋진 '카드뉴스(Card News)'용 콘텐츠로 기획, 요약, 가공하는 소셜미디어 전문 콘텐츠 에디터이자 카피라이터야.
주어진 텍스트를 분석하여, 사용자가 지정한 총 ${cardCount}장의 슬라이드 분량의 카드뉴스로 구성해야 해.

[카드뉴스 구성 원칙]
1. 슬라이드 개수: 반드시 정확히 ${cardCount}장으로 나누어 대본을 작성해라. (1장부터 ${cardCount}장까지)
2. 슬라이드 구성 가이드:
   - 슬라이드 1 (첫 번째 장): 무조건 'title' 레이아웃으로, 전체를 관통하는 핵심적이고 도발적인 대왕 헤드라인(제목)과 소제목(부제목)을 구성해.
   - 중간 슬라이드들 (2장 ~ ${cardCount - 1}장): 정보 전달 슬라이드들로, 'text', 'split', 'stat', 'quote' 등의 레이아웃을 적절히 교차 배치하여 지루하지 않게 해.
     - 'text': 중앙 집중형 텍스트 위주 카드.
     - 'split': 이미지 또는 그래픽 아이콘과 텍스트가 좌우 또는 상하로 분할 구성되는 레이아웃.
     - 'stat': 핵심적인 통계 수치나 놀라운 백분율(%), 연도, 숫자(예: '35% 증가', '3000명')를 강조하는 레이아웃. (accent 필드에 해당 수치를 넣어야 해)
     - 'quote': 특정 인물의 말, 인용구 또는 고도로 강조하고 싶은 원문을 따옴표와 함께 표시하는 레이아웃.
   - 마지막 슬라이드 (${cardCount}번째 장): 무조건 'closing' 레이아웃으로, 전체 주제를 한 줄로 요약 정리하거나, 독자에게 의견을 묻는 질문(Call to Action)을 던지며 마무리해.
3. 어투 조절: ${styleInstruction}
4. 각 카드의 글자 수 제한: 카드뉴스는 모바일 가독성이 핵심이므로 본문(body)은 3줄 이내, 절대 한 줄이 너무 길지 않게 강제 개행('\\n')을 넣어서 숏폼 형식으로 줄여줘. 줄바꿈을 적극적으로 활용해서 한 문장을 15자 내외로 끊어라.
5. 디자인 추천: 내용에 맞는 디자인 색상과 어울리는 대표 아이콘('lucide-react' 아이콘 명칭 중 하나: Newspaper, TrendingUp, TrendingDown, HelpCircle, Quote, AlertCircle, Info, Calendar, Lightbulb, Target, Users, Landmark, Award, Activity, Heart, Shield, Cpu, Cloud, Globe, BookOpen, MessageSquare, Zap, Star, ShieldAlert, CheckCircle, Flame, BarChart, Trophy, Settings, Sparkles)을 추천해 줘.
6. 이미지 검색 프롬프트: 각 카드 내용과 가장 부합하는 심플하고 감각적인 영문 키워드/검색 쿼리(예: 'robot artificial intelligence', 'chart grow success', 'sad empty street')를 2-3단어로 imagePrompt에 적어줘.

반드시 지정된 JSON 스키마 형식에 맞춰 정확한 JSON 데이터만을 반환해줘.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `다음 글을 분석해서 ${cardCount}장의 카드뉴스로 요약/재창조해줘.\n\n[대상 텍스트]\n${text}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['title', 'description', 'cards'],
          properties: {
            title: {
              type: Type.STRING,
              description: '카드뉴스 전체를 요약하는 대주제 제목',
            },
            description: {
              type: Type.STRING,
              description: '카드뉴스 기획 의도 및 전체 개요 한 줄 요약',
            },
            cards: {
              type: Type.ARRAY,
              description: `정확히 ${cardCount}개의 슬라이드로 구성된 카드 리스트`,
              items: {
                type: Type.OBJECT,
                required: ['slideNumber', 'layout', 'title', 'body', 'accent', 'imagePrompt', 'illustrationType', 'iconName', 'suggestedBgColor', 'suggestedTextColor', 'suggestedAccentColor'],
                properties: {
                  slideNumber: {
                    type: Type.INTEGER,
                    description: '슬라이드 번호 (1부터 시작)',
                  },
                  layout: {
                    type: Type.STRING,
                    description: '레이아웃 종류: "title", "text", "split", "stat", "quote", "closing" 중 하나',
                  },
                  title: {
                    type: Type.STRING,
                    description: '해당 슬라이드의 핵심 한 줄 소제목 또는 강조 카피',
                  },
                  body: {
                    type: Type.STRING,
                    description: '슬라이드 상세 본문 텍스트 (모바일용 가독성을 위해 개행 문자 \\n를 적극 포함한 2-3줄의 숏폼 문장)',
                  },
                  accent: {
                    type: Type.STRING,
                    description: 'stat 레이아웃일 때 강조할 수치나 단어(예: "94.2%", "2026년", "핵심 기술"), 다른 레이아웃이면 강조할 핵심 키워드',
                  },
                  imagePrompt: {
                    type: Type.STRING,
                    description: '이 카드뉴스 장의 비주얼 이미지를 Unsplash 등에서 찾기 위한 2~3단어의 구체적인 영문 키워드 쿼리',
                  },
                  illustrationType: {
                    type: Type.STRING,
                    description: '어울리는 비주얼 형태: "none", "icon", "shape", "circle" 중 선택',
                  },
                  iconName: {
                    type: Type.STRING,
                    description: 'Lucide-React 아이콘 이름 중 어울리는 것 하나 추천',
                  },
                  suggestedBgColor: {
                    type: Type.STRING,
                    description: '해당 카드의 분위기와 어울리는 메인 배경색 Hex코드 (어두운 색상이나 화사한 색상 등, 텍스트가 잘 보일 수 있는 색상 대비 선택)',
                  },
                  suggestedTextColor: {
                    type: Type.STRING,
                    description: '배경색에 대비되어 잘 보이는 텍스트 메인 글자색 Hex코드',
                  },
                  suggestedAccentColor: {
                    type: Type.STRING,
                    description: '핵심 단어 등을 하이라이트할 포인트 색상 Hex코드',
                  },
                },
              },
            },
          },
        },
      },
    });

    const jsonStr = response.text?.trim() || '{}';
    const cardNewsResult = JSON.parse(jsonStr);

    res.json(cardNewsResult);
  } catch (error: any) {
    console.error('Card News generation error:', error);
    res.status(500).json({ error: error.message || '카드뉴스 생성에 실패했습니다.' });
  }
});

// Vite & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
