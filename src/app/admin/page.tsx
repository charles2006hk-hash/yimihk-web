'use client';

import React, { useState } from 'react';
import { Lock, Cpu, Mail, Settings, LogOut, FileText, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 登入驗證 (你可以自行修改 'yimi2026' 為你想要的密碼)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'yimi2026') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('密碼錯誤，請重新輸入或聯繫系統管理員。');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">內部系統登入</h2>
          <p className="text-slate-400 text-center text-sm mb-8">蟻米集團 (國際) AI 管理後台</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入系統密碼"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center tracking-widest"
              />
              {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
              進入系統
            </button>
            <div className="text-center">
              <Link href="/" className="text-slate-500 text-sm hover:text-white transition-colors">返回官網首頁</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 登入成功後的管理介面
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl text-white flex items-center gap-2">
          <Cpu className="text-blue-500" /> YIMI Admin
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center text-slate-400 hover:text-white text-sm">
          <LogOut size={16} className="mr-1" /> 登出系統
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">控制中心 Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 功能卡片 1：觸發 AI 生成 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500 transition-all">
            <div className="w-12 h-12 bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI 新聞引擎</h3>
            <p className="text-slate-400 text-sm mb-6">手動觸發 AI 模型，根據今日大盤與國際動態生成最新智庫報告。</p>
            <button className="w-full py-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 rounded-lg font-semibold transition-all">
              一鍵生成今日報告
            </button>
          </div>

          {/* 功能卡片 2：客戶名單 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-900/30 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">業務諮詢名單</h3>
            <p className="text-slate-400 text-sm mb-6">查看來自首頁「聯繫業務負責人」表單的潛在客戶名單與需求。</p>
            <button className="w-full py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg font-semibold transition-all">
              查看 3 條未讀訊息
            </button>
          </div>

          {/* 功能卡片 3：網站設定 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-purple-900/30 text-purple-500 rounded-xl flex items-center justify-center mb-4">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">系統與參數設定</h3>
            <p className="text-slate-400 text-sm mb-6">設定 AI 引擎的 Prompt 提示詞、管理員密碼以及接收通知的 Email。</p>
            <button className="w-full py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg font-semibold transition-all">
              進入設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
