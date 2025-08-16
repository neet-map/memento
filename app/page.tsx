'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [lastGeneratedText, setLastGeneratedText] = useState<string>('');

  const handleGenerateImage = async () => {
    if (!reflectionText.trim()) {
      alert('振り返りテキストを入力してください');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: reflectionText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '画像生成に失敗しました');
      }

      setGeneratedImage(data.imageUrl);
      setLastGeneratedText(reflectionText);
    } catch (error) {
      console.error('画像生成エラー:', error);
      alert('画像生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      // 画像を取得
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      
      // ダウンロード用のURLを作成
      const url = window.URL.createObjectURL(blob);
      
      // ダウンロード用のリンクを作成
      const link = document.createElement('a');
      link.href = url;
      
      // ファイル名を生成（現在の日時を使用）
      const now = new Date();
      const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD形式
      link.download = `memento-${timestamp}.jpg`;
      
      // ダウンロードを実行
      document.body.appendChild(link);
      link.click();
      
      // クリーンアップ
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('ダウンロードエラー:', error);
      alert('ダウンロードに失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Memento
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            一日の振り返りを美しい画像に
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* 左側：コントロールパネル */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div className="text-gray-500 dark:text-gray-400">
                <p className="mb-2 text-lg font-medium">今日はどんな一日でしたか？</p>
                <p className="text-sm">あなたの思い出を素敵な画像として残しましょう</p>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="reflection" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  振り返りテキスト
                </label>
                <textarea
                  id="reflection"
                  value={reflectionText}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setReflectionText(e.target.value);
                    }
                  }}
                  placeholder="今日の出来事、感じたこと、学んだことなどを自由に書いてください...&#10;&#10;例：&#10;・今日は友達とカフェに行って楽しい時間を過ごしました&#10;・新しいプロジェクトが始まって少し不安だけど頑張りたいです&#10;・散歩中に美しい夕焼けを見て心が穏やかになりました"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  disabled={isGenerating}
                />
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{reflectionText.length}/500文字</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    感情や体験を具体的に書くとより良い画像が生成されます
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    生成中...
                  </div>
                ) : (
                  '画像を生成する'
                )}
              </button>
              
              <div className="text-xs text-gray-400 dark:text-gray-500">
                あなたの一日の振り返りをAIが美しい画像に変換します
              </div>
            </div>
          </div>

          {/* 右側：画像プレビュー */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              生成された画像
            </h2>
            
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
              {generatedImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={generatedImage}
                    alt="生成された振り返り画像"
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm">
                    「画像を生成する」ボタンを押すと<br />
                    ここに画像が表示されます
                  </p>
                </div>
              )}
            </div>
            
            {generatedImage && (
              <div className="mt-4 space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    生成元のテキスト:
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                    {lastGeneratedText}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleDownload}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ダウンロード
                  </button>
                  <button 
                    onClick={() => {
                      setGeneratedImage(null);
                      setLastGeneratedText('');
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    クリア
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
