"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function RosterGenerator() {
  const [companyName, setCompanyName] = useState('My Company');
  const [year, setYear] = useState(2026);
  const [staffCount, setStaffCount] = useState(10);
  
  // 動態管理員工名單
  const [staffList, setStaffList] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Staff ${String.fromCharCode(65 + i)}`,
      q2: Math.floor(Math.random() * 10) + 1,
      q3: Math.floor(Math.random() * 10) + 1,
      q4: Math.floor(Math.random() * 10) + 1,
    }))
  );

  // 預覽狀態
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setStaffCount(count);
    
    const newList = Array.from({ length: count }, (_, i) => {
      return staffList[i] || { id: i + 1, name: `Staff ${i + 1}`, q2: 1, q3: 1, q4: 1 };
    });
    setStaffList(newList);
    setShowPreview(false); // 修改人數時隱藏預覽
  };

  const handleStaffNameChange = (index: number, newName: string) => {
    const updated = [...staffList];
    updated[index].name = newName;
    setStaffList(updated);
    setShowPreview(false); // 修改名字時隱藏預覽
  };

  // 生成核心陣列資料 (給預覽和 Excel 共用)
  const generateMasterData = () => {
    const masterData: any[][] = [];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    // 香港假期定義 (可自行擴充)
    const holidays: Record<string, string> = {
      "1-JAN": "New Year Day", "17-FEB": "農曆年初一", "18-FEB": "農曆年初二", "19-FEB": "農曆年初三",
      "3-APR": "Good Friday", "4-APR": "Holy Saturday", "5-APR": "Easter Sun", "6-APR": "Easter Monday",
      "1-MAY": "Labor Day", "1-JUL": "HKSAR Day", "1-OCT": "National Day", "25-DEC": "Christmas Day"
    };

    months.forEach((mName, mIdx) => {
      masterData.push(["", "", "", `DUTY ROSTER FOR ${mName} ${year}`]);
      masterData.push(["", "SUN & HOLIDAY 10:00-19:00", "", "", "", "MON - SAT 09:00-19:00"]);
      masterData.push([]);

      const daysInMonth = new Date(year, mIdx + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, mIdx, d);
        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dateKey = `${d}-${mName}`;
        const isHoliday = holidays[dateKey];
        
        const row = [dateKey, dayStr, isHoliday || ""];
        
        // 模擬排班輪替
        if (dayStr === "Sun" || isHoliday) {
          row.push(staffList[d % staffCount]?.name || ""); 
          row.push(staffList[(d + 1) % staffCount]?.name || ""); 
          row.push("");
          row.push(staffList[(d + 2) % staffCount]?.name || ""); 
          row.push(staffList[(d + 3) % staffCount]?.name || ""); 
        } else {
           row.push(""); row.push(""); row.push("");
           row.push(staffList[d % staffCount]?.name || "");
           row.push(staffList[(d + 1) % staffCount]?.name || "");
           row.push(staffList[(d + 2) % staffCount]?.name || "");
        }
        masterData.push(row);
        
        if (dayStr === "Sun") masterData.push([]); 
      }
      masterData.push([]);
      
      // 底部員工列表
      for(let i=0; i<Math.ceil(staffCount/2); i++) {
         const leftStaff = staffList[i];
         const rightStaff = staffList[i + Math.ceil(staffCount/2)];
         masterData.push([
             leftStaff ? leftStaff.id : "", leftStaff ? leftStaff.name : "", "", 
             rightStaff ? rightStaff.id : "", rightStaff ? rightStaff.name : ""
         ]);
      }
      masterData.push([], []);
    });
    return masterData;
  };

  const handlePreview = () => {
    const data = generateMasterData();
    setPreviewData(data);
    setShowPreview(true);
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Settings Sheet
    const settingsData = [
      ["Company", companyName, "Year", year],
      [],
      ["ID", "Staff Name", "Q2 抽籤", "Q3 抽籤", "Q4 抽籤"],
      ...staffList.map(s => [s.id, s.name, s.q2, s.q3, s.q4])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(settingsData), "Settings");

    // 2. Master Roster Sheet
    const wsMaster = XLSX.utils.aoa_to_sheet(previewData);
    wsMaster['!cols'] = [{wch: 10}, {wch: 6}, {wch: 18}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}];
    XLSX.utils.book_append_sheet(wb, wsMaster, `Master_Roster_${year}`);

    // 3. Stats Sheet
    const statsData = [
      ["Staff Statistics", "", "", "", ""],
      [],
      ["Staff Name", "Total Days", "Weekday Full", "Weekend/PH Early", "Weekend/PH Late", "Check Sum"],
      ...staffList.map(s => [s.name, 130, 70, 30, 30, 130])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(statsData), "Staff_Statistics");

    XLSX.writeFile(wb, `${companyName}_Duty_Roster_${year}.xlsx`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">編更表產生器 (Web版)</h1>
      
      {/* 表單區塊 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">公司名稱</label>
          <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                 className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">年份 (開始日期)</label>
          <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value) || 2026)}
                 className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">員工數量</label>
          <input type="number" min="1" max="30" value={staffCount} onChange={handleStaffCountChange}
                 className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">員工名單設定</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {staffList.map((staff, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded border">
              <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
              <input type="text" value={staff.name} onChange={e => handleStaffNameChange(index, e.target.value)}
                     className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 mb-8 gap-4">
        <button onClick={handlePreview}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg shadow transition">
          👁️ 預覽編更表
        </button>
        {showPreview && (
          <button onClick={handleDownloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105">
            ⬇️ 確認並下載 Excel
          </button>
        )}
      </div>

      {/* 預覽區塊 */}
      {showPreview && (
        <div className="border rounded-lg p-4 bg-gray-50 shadow-inner">
          <h2 className="text-xl font-bold mb-4 text-center">排班表預覽 ({year}年)</h2>
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] border border-gray-300 bg-white">
            <table className="min-w-full text-sm border-collapse">
              <tbody>
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {row.map((cell, cellIndex) => {
                      // 簡單模擬 Excel 裡的假日/週日底色
                      let bg = "";
                      if (row[1] === "Sun") bg = "bg-red-100";
                      else if (row[2] && row[0]?.includes("-")) bg = "bg-yellow-100";

                      // 標題加粗
                      const isHeader = cell?.toString().includes("DUTY ROSTER");
                      
                      return (
                        <td key={cellIndex} className={`p-2 border-r whitespace-nowrap ${bg} ${isHeader ? 'font-bold text-lg' : ''}`}>
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
