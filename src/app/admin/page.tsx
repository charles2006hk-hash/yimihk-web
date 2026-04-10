'use client';

import React, { useState } from 'react';
import { Save, RefreshCw, BarChart, FileText, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [prompt, setPrompt] = useState("你是一位蟻米集團的資深分析師。請結合今日的中港股市指數與 AI 產業趨勢，生成三則 150 字內的集團動態資訊。語氣需專業、具國際視野。");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    // 這裡未來對接到 Firebase 的 config 集合
    setTimeout(() => {
      setIsSaving(false);
      alert('配置已成功同步到 Firebase！');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="text-xl font-bold mb-10 text-blue-400">YIMI ADMIN</div>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer">
            <Settings size={20} /> 系統設定
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer">
            <FileText size={20} /> 新聞管理
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer">
            <BarChart size={20} /> 指數監控
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-slate-800">AI 策略管理中心</h1>
          <button 
            onClick={handleSaveConfig}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            儲存所有更改
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prompt Setup */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} /> AI 新聞生成 Prompt
            </h2>
            <p className="text-sm text-slate-500 mb-4">這段 Prompt 將決定每天自動生成新聞的方向與語氣。</p>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 leading-relaxed"
            />
          </div>

          {/* Market Index Management */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart className="text-blue-600" size={20} /> 即時指數顯示設定
            </h2>
            <div className="space-y-4">
              {['恆生指數', '上證指數', '標普 500', '納斯達克'].map((index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-medium text-slate-700">{index}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-green-600 font-bold">自動抓取中</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
              提示：指數數據每 15 分鐘透過金融 API 代理自動更新，國內訪問將透過伺服器緩存分發。
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}