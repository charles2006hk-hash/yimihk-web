"use client";

import React, { useState, useEffect } from 'react';

export default function ToothcareDemo() {
  // 狀態管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 處理驗證碼倒數
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOTP = () => {
    if (!phone || phone.length !== 11) {
      alert('請輸入有效的11位手機號碼');
      return;
    }
    setCountdown(60);
    // TODO: 串接後端 SMS API
    console.log(`[Mock] 驗證碼已發送至: ${phone}`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 串接 UniCloud / 自建 JWT 驗證
    console.log(`[Mock] 嘗試登入: 手機號 ${phone}, 驗證碼 ${otp}`);
    alert('登入成功！準備跳轉至會員中心...');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-50 font-sans text-gray-800 min-h-screen">
      {/* 頂部導航列 */}
      <nav className="bg-white shadow-md fixed w-full z-40 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo 區 */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2 text-blue-600">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2c1.31 0 2.53.53 3.44 1.48L12 5l1.56-1.52C14.47 2.53 15.69 2 17 2c2.76 0 5 2.24 5 5 0 1.94-1.07 3.65-2.65 4.5l-6.85 7c-.2.2-.47.31-.75.31s-.55-.11-.75-.31l-6.85-7C2.57 10.65 1.5 8.94 1.5 7c0-2.76 2.24-5 5-5zm0 2C5.35 4 4 5.35 4 7c0 1.25.74 2.37 1.88 2.87l6.12 6.26 6.12-6.26C19.26 9.37 20 8.25 20 7c0-1.65-1.35-3-3-3-.93 0-1.78.43-2.34 1.12L12 8.35 9.34 5.12C8.78 4.43 7.93 4 7 4z"/></svg>
                <span className="font-bold text-2xl tracking-wider">
                  瑞康口腔
                  <span className="text-sm font-normal text-gray-500 block">瀋陽旗艦院 · 醫保定點</span>
                </span>
              </div>
            </div>
            {/* 導航連結 */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">首頁</a>
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition">診療項目</a>
              <a href="#doctors" className="text-gray-600 hover:text-blue-600 transition">專家團隊</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition">關於我們</a>
            </div>
            {/* 登入與預約按鈕 */}
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsModalOpen(true)} className="text-gray-600 hover:text-blue-600 font-medium flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                會員登入
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition shadow-lg shadow-blue-500/30">
                在線預約
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 首屏 Hero Section */}
      <header className="pt-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase bg-blue-100 px-3 py-1 rounded-full">德國精工 · 醫大專家</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 leading-tight">
              重塑自信笑容 <br /> <span className="text-blue-600">從專業齒科開始</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              引進全套德國數位化口腔設備，專注微創種植牙、隱形矯正、兒童早期干預。為瀋陽市民提供全生命週期的口腔健康管理。
            </p>
            <div className="mt-8 flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg">立即獲取方案</button>
              <button className="bg-white text-blue-600 border border-blue-200 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition">本月優惠</button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="現代化牙科診所" className="rounded-2xl shadow-2xl object-cover h-96 w-full" />
          </div>
        </div>
      </header>

      {/* 核心科室板塊 */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">卓越診療中心</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: '數位化種植', desc: '3D導航微創種植，即拔即種，當天恢復咀嚼功能，提供終身維護。' },
              { title: '美學正畸', desc: '隱适美/時代天使認證醫師，3D動畫預演矯正效果，隱形美觀。' },
              { title: '兒童齒科', desc: '專屬卡通診室與兒童安撫引導，專注齲齒防治與早期咬合誘導。' },
              { title: '牙周與綜合修復', desc: '超聲波無痛潔牙、全瓷冠修復、顯微根管治療，守護牙周健康。' }
            ].map((service, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition hover:-translate-y-1 group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition">
                  <div className="w-8 h-8 rounded-full bg-blue-600 group-hover:bg-white transition"></div>
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 會員登入 / 註冊彈跳視窗 (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all m-4">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">病患/會員登入</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">手機號碼</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">+86</span>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      placeholder="請輸入手機號" 
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">驗證碼</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required 
                      className="w-2/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                      placeholder="6位驗證碼" 
                    />
                    <button 
                      type="button" 
                      onClick={handleSendOTP} 
                      disabled={countdown > 0}
                      className="w-1/3 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 font-medium rounded-lg text-sm transition"
                    >
                      {countdown > 0 ? `${countdown}s 後重試` : '獲取驗證碼'}
                    </button>
                  </div>
                  <p className="text-xs text-amber-600 mt-2 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    架構提醒：部署於 Vercel 並面向國內用戶時，建議放棄 Firebase Auth。
                  </p>
                </div>
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg">
                  登入 / 註冊
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                登入即代表您同意 <a href="#" className="text-blue-600 hover:underline">服務條款</a> 與 <a href="#" className="text-blue-600 hover:underline">隱私權政策</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
