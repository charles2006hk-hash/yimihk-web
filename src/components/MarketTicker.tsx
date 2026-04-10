'use client';

import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export default function MarketTicker() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const financialData = [
      { name: '恒生指數', value: '16,723.92', change: '+0.54%', trend: 'up' },
      { name: '上證指數', value: '3,047.05', change: '-0.12%', trend: 'down' },
      { name: '日經 225', value: '39,523.55', change: '+0.21%', trend: 'up' },
      { name: '標普 500', value: '5,204.34', change: '+1.12%', trend: 'up' },
      { name: '納斯達克', value: '16,306.64', change: '+1.24%', trend: 'up' },
      { name: '道瓊斯', value: '38,904.04', change: '-0.03%', trend: 'down' },
      { name: '富時 100', value: '7,911.16', change: '+0.48%', trend: 'up' },
      { name: '美元/離岸人民幣', value: '7.2452', change: '+0.02%', trend: 'up' },
    ];
    setData(financialData);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes custom-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .forced-marquee {
          display: flex;
          animation: custom-marquee 40s linear infinite !important;
          width: max-content;
        }
      `}} />

      <div className="sticky top-0 z-[100] w-full bg-[#0a0f18] border-b border-white/10 shadow-lg">
        <div className="flex items-center h-10 overflow-hidden">
          {/* 固定標籤 */}
          <div className="relative z-20 bg-blue-600 text-white px-5 h-full flex items-center gap-2 text-[11px] font-black tracking-widest shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
            <Activity size={14} strokeWidth={3} />
            LIVE MARKETS
          </div>

          {/* 跑馬燈軌道 */}
          <div className="flex-1 overflow-hidden">
            <div className="forced-marquee">
              {[...data, ...data].map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 px-10 border-r border-white/10 h-10">
                  <span className="text-white font-bold text-xs whitespace-nowrap tracking-wide">
                    {item.name}
                  </span>
                  <span className="text-slate-100 font-mono text-xs font-medium">
                    {item.value}
                  </span>
                  <span className={`flex items-center text-[10px] font-black ${item.trend === 'up' ? 'text-green-400' : 'text-red-500'}`}>
                    {item.trend === 'up' ? '▲' : '▼'}
                    <span className="ml-1">{item.change}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}