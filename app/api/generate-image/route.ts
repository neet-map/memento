import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'テキストが入力されていません' },
        { status: 400 }
      );
    }

    // TODO: 実際の画像生成APIに置き換える
    // 現在はモック実装
    const mockImageUrl = await generateMockImage(text);

    return NextResponse.json({
      success: true,
      imageUrl: mockImageUrl,
      prompt: text
    });

  } catch (error) {
    console.error('画像生成API エラー:', error);
    return NextResponse.json(
      { error: '画像生成に失敗しました' },
      { status: 500 }
    );
  }
}

// モック画像生成関数
async function generateMockImage(text: string): Promise<string> {
  // テキストの感情分析（簡易版）
  const emotions = analyzeEmotion(text);
  
  // 感情に基づいて画像を選択（現在は固定画像）
  // TODO: 実際のAI画像生成APIに置き換える
  // 例: OpenAI DALL-E 3, Stability AI, Midjourney API など
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // API呼び出しの模擬
  
  return '/bg_sakura_night.jpg';
}

// 簡易感情分析関数
function analyzeEmotion(text: string): {
  positive: number;
  negative: number;
  neutral: number;
} {
  const positiveWords = ['楽しい', '嬉しい', '幸せ', '良い', '最高', '素晴らしい', '感謝', '満足'];
  const negativeWords = ['悲しい', '辛い', '疲れた', '困った', '不安', '心配', '大変'];
  
  const lowerText = text.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++;
  });
  
  const total = Math.max(positiveScore + negativeScore, 1);
  
  return {
    positive: positiveScore / total,
    negative: negativeScore / total,
    neutral: 1 - (positiveScore + negativeScore) / total
  };
}
