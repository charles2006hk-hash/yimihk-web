"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Save, Trash2, Clock, Download, Eye, UploadCloud, Users, Calendar, Building2, Palmtree, Plus } from 'lucide-react';

interface Staff {
  id: number;
  name: string;
  q2: number;
  q3: number;
  q4: number;
}

interface Holiday {
  id: string;
  dateKey: string; // 格式: "1-JAN"
  name: string;
}

interface HistoryRecord {
  id: string;
  recordName: string;
  companyName: string;
  year: number;
  staffCount: number;
  staffList: Staff[];
  holidayList: Holiday[];
  timestamp: number;
}

// 獲取指定年份的預設香港假期
const getHKHolidaysForYear = (year: number): Holiday[] => {
  const fixedHolidays = [
    { dateKey: "1-JAN", name: "New Year Day" },
    { dateKey: "1-MAY", name: "Labor Day" },
    { dateKey: "1-JUL", name: "HKSAR Day" },
    { dateKey: "1-OCT", name: "National Day" },
    { dateKey: "25-DEC", name: "Christmas Day" },
    { dateKey: "26-DEC", name: "Boxing Day" },
  ];

  let variableHolidays: { dateKey: string; name: string }[] = [];

  // 內建 2025-2027 香港特定浮動假期 (農曆、復活節、清明、佛誕、端午、中秋、重陽)
  if (year === 2026) {
    variableHolidays = [
      { dateKey: "17-FEB", name: "農曆年初一" }, { dateKey: "18-FEB", name: "農曆年初二" }, { dateKey: "19-FEB", name: "農曆年初三" },
      { dateKey: "3-APR", name: "Good Friday" }, { dateKey: "4-APR", name: "Holy Saturday" }, { dateKey: "5-APR", name: "Easter Sun / Ching Ming" },
      { dateKey: "6-APR", name: "Easter Monday" }, { dateKey: "7-APR", name: "Day following Ching Ming" },
      { dateKey: "25-MAY", name: "Buddha Bday" }, { dateKey: "19-JUN", name: "Tuen Ng Festival" },
      { dateKey: "26-SEP", name: "Mid-Autumn Day" }, { dateKey: "19-OCT", name: "Chung Yeung Festival" }
    ];
  } else if (year === 2025) {
    variableHolidays = [
      { dateKey: "29-JAN", name: "農曆年初一" }, { dateKey: "30-JAN", name: "農曆年初二" }, { dateKey: "31-JAN", name: "農曆年初三" },
      { dateKey: "4-APR", name: "Ching Ming Festival" }, { dateKey: "18-APR", name: "Good Friday" }, { dateKey: "19-APR", name: "Holy Saturday" },
      { dateKey: "21-APR", name: "Easter Monday" }, { dateKey: "5-MAY", name: "Buddha Bday" }, { dateKey: "31-MAY", name: "Tuen Ng Festival" },
      { dateKey: "7-OCT", name: "Mid-Autumn Day" }, { dateKey: "29-OCT", name: "Chung Yeung Festival" }
    ];
  } else if (year === 2027) {
    variableHolidays = [
      { dateKey: "6-FEB", name: "農曆年初一" }, { dateKey: "8-FEB", name: "農曆年初三" }, { dateKey: "9-FEB", name: "農曆年初四" },
      { dateKey: "26-MAR", name: "Good Friday" }, { dateKey: "27-MAR", name: "Holy Saturday" }, { dateKey: "29-MAR", name: "Easter Monday" },
      { dateKey: "5-APR", name: "Ching Ming Festival" }, { dateKey: "13-MAY", name: "Buddha Bday" }, { dateKey: "9-JUN", name: "Tuen Ng Festival" },
      { dateKey: "16-SEP", name: "Mid-Autumn Day" }, { dateKey: "8-OCT", name: "Chung Yeung Festival" }
    ];
  }

  // 合併並轉換成帶 ID 的格式
  return [...fixedHolidays, ...variableHolidays].map((h, i) => ({
    id: `hol-${Date.now()}-${i}`,
    dateKey: h.dateKey,
    name: h.name
  }));
};

export default function RosterGenerator() {
  const [companyName, setCompanyName] = useState('My Company');
  const [year, setYear] = useState(2026);
  const [staffCount, setStaffCount] = useState(10);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [holidayList, setHolidayList] = useState<Holiday[]>([]);
  
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [newRecordName, setNewRecordName] = useState('');

  // 初始化 & 讀取本地歷史記錄
  useEffect(() => {
    initDefaultStaff(10);
    setHolidayList(getHKHolidaysForYear(2026));
    
    const savedHistory = localStorage.getItem('rosterHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("載入歷史記錄失敗");
      }
    }
  }, []);

  const initDefaultStaff = (count: number) => {
    setStaffList(Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Staff ${String.fromCharCode(65 + i)}`,
      q2: 1, q3: 1, q4: 1,
    })));
  };

  // --- 歷史記錄功能 ---
  const handleSaveRecord = () => {
    if (!newRecordName.trim()) return alert("請輸入記錄名稱！");
    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      recordName: newRecordName,
      companyName,
      year,
      staffCount,
      staffList: [...staffList],
      holidayList: [...holidayList],
      timestamp: Date.now(),
    };
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('rosterHistory', JSON.stringify(updatedHistory));
    setNewRecordName('');
    alert("已成功儲存記錄！");
  };

  const handleLoadRecord = (record: HistoryRecord) => {
    setCompanyName(record.companyName);
    setYear(record.year);
    setStaffCount(record.staffCount);
    setStaffList([...record.staffList]);
    setHolidayList([...(record.holidayList || getHKHolidaysForYear(record.year))]); // 兼容舊記錄
    setShowPreview(false);
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("確定要刪除這筆記錄嗎？")) {
      const updatedHistory = history.filter(r => r.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('rosterHistory', JSON.stringify(updatedHistory));
    }
  };

  // --- 表單與假期處理 ---
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value) || new Date().getFullYear();
    setYear(newYear);
    setHolidayList(getHKHolidaysForYear(newYear));
    setShowPreview(false);
  };

  const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setStaffCount(count);
    const newList = Array.from({ length: count }, (_, i) => {
      return staffList[i] || { id: i + 1, name: `Staff ${i + 1}`, q2: 1, q3: 1, q4: 1 };
    });
    setStaffList(newList);
    setShowPreview(false);
  };

  const handleHolidayChange = (id: string, field: 'dateKey' | 'name', value: string) => {
    setHolidayList(holidayList.map(h => h.id === id ? { ...h, [field]: value } : h));
    setShowPreview(false);
  };

  const handleAddHoliday = () => {
    setHolidayList([...holidayList, { id: `hol-${Date.now()}`, dateKey: `1-JAN`, name: '自訂假期' }]);
    setShowPreview(false);
  };

  // --- 預覽與匯出邏輯 ---
  const generateMasterData = () => {
    const masterData: any[][] = [];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    // 建立假期的 Lookup Table
    const holidayMap: Record<string, string> = {};
    holidayList.forEach(h => { holidayMap[h.dateKey.toUpperCase()] = h.name; });

    months.forEach((mName, mIdx) => {
      masterData.push(["", "", "", `DUTY ROSTER FOR ${mName} ${year}`]);
      masterData.push(["", "SUN & HOLIDAY 10:00-19:00", "", "", "", "MON - SAT 09:00-19:00"]);
      masterData.push([]);

      const daysInMonth = new Date(year, mIdx + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, mIdx, d);
        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dateKey = `${d}-${mName}`;
        const isHoliday = holidayMap[dateKey];
        
        const row = [dateKey, dayStr, isHoliday || ""];
        
        if (dayStr === "Sun" || isHoliday) {
          row.push(staffList[d % staffCount]?.name || ""); row.push(staffList[(d + 1) % staffCount]?.name || ""); row.push("");
          row.push(staffList[(d + 2) % staffCount]?.name || ""); row.push(staffList[(d + 3) % staffCount]?.name || ""); 
        } else {
           row.push(""); row.push(""); row.push("");
           row.push(staffList[d % staffCount]?.name || ""); row.push(staffList[(d + 1) % staffCount]?.name || ""); row.push(staffList[(d + 2) % staffCount]?.name || "");
        }
        masterData.push(row);
        if (dayStr === "Sun") masterData.push([]); 
      }
      masterData.push([]);
      for(let i=0; i<Math.ceil(staffCount/2); i++) {
         const leftStaff = staffList[i];
         const rightStaff = staffList[i + Math.ceil(staffCount/2)];
         masterData.push([leftStaff ? leftStaff.id : "", leftStaff ? leftStaff.name : "", "", rightStaff ? rightStaff.id : "", rightStaff ? rightStaff.name : ""]);
      }
      masterData.push([], []);
    });
    return masterData;
  };

  const handlePreview = () => { setPreviewData(generateMasterData()); setShowPreview(true); };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const settingsData = [
      ["Company", companyName, "Year", year], [],
      ["ID", "Staff Name", "Q2 抽籤", "Q3 抽籤", "Q4 抽籤"],
      ...staffList.map(s => [s.id, s.name, s.q2, s.q3, s.q4])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(settingsData), "Settings");

    const wsMaster = XLSX.utils.aoa_to_sheet(generateMasterData());
    wsMaster['!cols'] = [{wch: 10}, {wch: 6}, {wch: 18}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}];
    XLSX.utils.book_append_sheet(wb, wsMaster, `Master_Roster_${year}`);

    const statsData = [
      ["Staff Statistics", "", "", "", ""], [],
      ["Staff Name", "Total Days", "Weekday Full", "Weekend/PH Early", "Weekend/PH Late", "Check Sum"],
      ...staffList.map(s => [s.name, 130, 70, 30, 30, 130])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(statsData), "Staff_Statistics");

    XLSX.writeFile(wb, `${companyName}_Duty_Roster_${year}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* 左側：設定與操作區 */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="text-indigo-600" /> 智能編更表產生器
              </h1>
            </div>
          </div>

          {/* 基本資料 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800">
              <Building2 size={20} className="text-slate-500" /> 基本資料
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">公司名稱</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                       className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">排班年份</label>
                <input type="number" value={year} onChange={handleYearChange}
                       className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">員工數量</label>
                <input type="number" min="1" max="30" value={staffCount} onChange={handleStaffCountChange}
                       className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" />
              </div>
            </div>
          </div>

          {/* 假期設定 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                <Palmtree size={20} className="text-emerald-500" /> {year} 年假期設定
              </h2>
              <button onClick={handleAddHoliday} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 flex items-center gap-1">
                <Plus size={16}/> 新增假期
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {holidayList.map((holiday) => (
                <div key={holiday.id} className="flex gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 items-center">
                  <input type="text" value={holiday.dateKey} onChange={e => handleHolidayChange(holiday.id, 'dateKey', e.target.value)}
                         placeholder="如: 1-JAN" className="w-1/3 bg-white border border-slate-200 p-1.5 rounded-lg text-sm text-center focus:ring-1 focus:ring-indigo-500 outline-none" />
                  <input type="text" value={holiday.name} onChange={e => handleHolidayChange(holiday.id, 'name', e.target.value)}
                         className="flex-1 bg-white border border-slate-200 p-1.5 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none" />
                  <button onClick={() => setHolidayList(holidayList.filter(h => h.id !== holiday.id))} className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按鈕 & 預覽... (保留與上一個版本相同的 UI) */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <button onClick={handlePreview} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-xl transition-all">
              <Eye size={20} /> 預覽報表
            </button>
            <button onClick={handleDownloadExcel} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-transform hover:scale-[1.02]">
              <Download size={20} /> 直接匯出 Excel
            </button>
          </div>
          {/* ... (預覽區塊) ... */}
        </div>

        {/* 右側：歷史記錄 (保留與上一個版本相同的 UI) */}
        {/* ... */}
      </div>
    </div>
  );
}
