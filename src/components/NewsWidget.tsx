'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
}

export default function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 呼叫我們之前寫好的 Serverless API
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (data.success) {
          setNews(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-slate-600 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-slate-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {news.map((item) => (
        <div key={item.id} className="group bg-slate-800 hover:bg-slate-750 p-6 rounded-xl border border-slate-700 transition-colors cursor-pointer flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium px-2.5 py-1 bg-blue-900/50 text-blue-400 rounded-full border border-blue-800/50">
                {item.category}
              </span>
              <span className="text-slate-400 text-sm">{item.date}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
              {item.title}
            </h3>
          </div>
          <div className="mt-6 flex items-center text-sm text-slate-400 font-medium group-hover:text-white transition-colors">
            閱讀全文 <ArrowUpRight size={16} className="ml-1" />
          </div>
        </div>
      ))}
    </div>
  );
}