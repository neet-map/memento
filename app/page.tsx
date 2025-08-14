'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    
    // 生成中の演出のため少し待機
    setTimeout(() => {
      setGeneratedImage('/bg_sakura_night.jpg');
      setIsGenerating(false);
    }, 1500);
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
              <div className="mt-4 flex gap-2">
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
                  onClick={() => setGeneratedImage(null)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  クリア
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
