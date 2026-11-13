"use client";

import { useMemo, useState } from "react";

type Group = "recurring" | "highvalue";

type ServiceItem = {
  id: string;
  name: string;
  desc: string;
  group: Group;
  unit: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  stepPrice: number;
  volume: number;
  minVol: number;
  maxVol: number;
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "fluoride",
    name: "兒童塗氟",
    desc: "每半年一次，家長課帶動返單",
    group: "recurring",
    unit: "人次/月",
    price: 180,
    minPrice: 0,
    maxPrice: 500,
    stepPrice: 10,
    volume: 50,
    minVol: 0,
    maxVol: 200,
  },
  {
    id: "sealant",
    name: "窩溝封閉",
    desc: "6–9 歲，全口計",
    group: "recurring",
    unit: "人/月",
    price: 800,
    minPrice: 0,
    maxPrice: 2000,
    stepPrice: 50,
    volume: 20,
    minVol: 0,
    maxVol: 120,
  },
  {
    id: "cleaning",
    name: "潔牙及牙周維護",
    desc: "超聲波潔牙，牙周每 3 個月覆診",
    group: "recurring",
    unit: "人次/月",
    price: 350,
    minPrice: 0,
    maxPrice: 1000,
    stepPrice: 10,
    volume: 100,
    minVol: 0,
    maxVol: 400,
  },
  {
    id: "member",
    name: "口腔健康會員年卡",
    desc: "年卡四檔，包檢查、潔牙、塗氟",
    group: "recurring",
    unit: "張/月",
    price: 980,
    minPrice: 0,
    maxPrice: 3000,
    stepPrice: 20,
    volume: 25,
    minVol: 0,
    maxVol: 200,
  },
  {
    id: "implant",
    name: "單顆種植牙",
    desc: "集采後賣技術，唔賣耗材差價",
    group: "highvalue",
    unit: "顆/月",
    price: 6500,
    minPrice: 0,
    maxPrice: 15000,
    stepPrice: 100,
    volume: 12,
    minVol: 0,
    maxVol: 60,
  },
  {
    id: "denture",
    name: "活動義齒 / 修復",
    desc: "老年修復三檔之一",
    group: "highvalue",
    unit: "件/月",
    price: 3500,
    minPrice: 0,
    maxPrice: 12000,
    stepPrice: 100,
    volume: 15,
    minVol: 0,
    maxVol: 100,
  },
  {
    id: "ortho",
    name: "兒童早矯 / 隱形矯正",
    desc: "早矯篩查轉化，隱形矯正",
    group: "highvalue",
    unit: "例/月",
    price: 18000,
    minPrice: 0,
    maxPrice: 40000,
    stepPrice: 500,
    volume: 3,
    minVol: 0,
    maxVol: 20,
  },
];

const PRESETS: {
  id: string;
  label: string;
  desc: string;
  volumes: Record<string, number>;
}[] = [
  {
    id: "current",
    label: "現況",
    desc: "升級前的大概水平",
    volumes: {
      fluoride: 30,
      sealant: 10,
      cleaning: 60,
      member: 5,
      implant: 8,
      denture: 10,
      ortho: 2,
    },
  },
  {
    id: "steady",
    label: "保守目標",
    desc: "90 日路線圖達標水平",
    volumes: {
      fluoride: 50,
      sealant: 20,
      cleaning: 100,
      member: 25,
      implant: 12,
      denture: 15,
      ortho: 3,
    },
  },
  {
    id: "stretch",
    label: "進取目標",
    desc: "兒童 + 老年兩線齊發力",
    volumes: {
      fluoride: 90,
      sealant: 40,
      cleaning: 180,
      member: 60,
      implant: 22,
      denture: 30,
      ortho: 6,
    },
  },
];

function fmt(n: number): string {
  return "¥" + Math.round(n).toLocaleString("zh-CN");
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function ServiceRow({
  item,
  onPrice,
  onVolume,
}: {
  item: ServiceItem;
  onPrice: (id: string, v: number) => void;
  onVolume: (id: string, v: number) => void;
}) {
  const monthly = item.price * item.volume;
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-extrabold text-blue-700">
            {fmt(monthly)}
            <span className="text-xs font-normal text-gray-500"> /月</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600">單價（¥/次）</span>
            <input
              type="number"
              value={item.price}
              min={item.minPrice}
              max={item.maxPrice}
              step={item.stepPrice}
              onChange={(e) =>
                onPrice(item.id, clamp(parseInt(e.target.value, 10), item.minPrice, item.maxPrice))
              }
              className="w-24 text-right border border-gray-300 rounded-md px-2 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="range"
            value={item.price}
            min={item.minPrice}
            max={item.maxPrice}
            step={item.stepPrice}
            onChange={(e) => onPrice(item.id, parseInt(e.target.value, 10))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>¥{item.minPrice}</span>
            <span>¥{item.maxPrice}</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600">客戶量（{item.unit}）</span>
            <input
              type="number"
              value={item.volume}
              min={item.minVol}
              max={item.maxVol}
              onChange={(e) =>
                onVolume(item.id, clamp(parseInt(e.target.value, 10), item.minVol, item.maxVol))
              }
              className="w-24 text-right border border-gray-300 rounded-md px-2 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="range"
            value={item.volume}
            min={item.minVol}
            max={item.maxVol}
            step={1}
            onChange={(e) => onVolume(item.id, parseInt(e.target.value, 10))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>{item.maxVol}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToothcareUpgradePage() {
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [baseline, setBaseline] = useState(180000);
  const [activePreset, setActivePreset] = useState<string>("steady");

  const setPrice = (id: string, v: number) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, price: v } : s)));

  const setVolume = (id: string, v: number) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, volume: v } : s)));

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePreset(presetId);
    setServices((prev) =>
      prev.map((s) => ({
        ...s,
        volume: preset.volumes[s.id] ?? s.volume,
      }))
    );
  };

  const resetAll = () => {
    setServices(DEFAULT_SERVICES);
    setBaseline(180000);
    setActivePreset("steady");
  };

  const calc = useMemo(() => {
    const lines = services.map((s) => ({
      ...s,
      monthly: s.price * s.volume,
    }));
    const totalMonthly = lines.reduce((sum, l) => sum + l.monthly, 0);
    const totalVisits = lines.reduce((sum, l) => sum + l.volume, 0);
    const avgTicket = totalVisits > 0 ? totalMonthly / totalVisits : 0;
    const uplift = totalMonthly - baseline;
    const upliftPct = baseline > 0 ? (uplift / baseline) * 100 : 0;
    return { lines, totalMonthly, totalAnnual: totalMonthly * 12, totalVisits, avgTicket, uplift, upliftPct };
  }, [services, baseline]);

  const recurring = calc.lines.filter((l) => l.group === "recurring");
  const highvalue = calc.lines.filter((l) => l.group === "highvalue");

  return (
    <div className="bg-gray-50 font-sans text-gray-800 min-h-screen">
      {/* 頂部導航 */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 text-blue-700">
              <span className="font-bold text-xl tracking-wider">
                瑞康口腔
                <span className="text-xs font-normal text-gray-500 block">瀋陽旗艦院 · 升級方案</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <a href="#market" className="text-gray-600 hover:text-blue-700">市場現況</a>
              <a href="#lines" className="text-gray-600 hover:text-blue-700">三條主線</a>
              <a href="#calculator" className="text-gray-600 hover:text-blue-700 font-semibold">收益計算器</a>
              <a href="#plan" className="text-gray-600 hover:text-blue-700">90 日計劃</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <span className="text-blue-200 font-semibold tracking-wider text-sm bg-blue-800 px-3 py-1 rounded-full">
            診所升級 · 內部方案
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-6 leading-tight">
            瀋陽牙科診所升級方案
            <br />
            <span className="text-blue-200 text-2xl md:text-3xl">吸新客靠產品升級，留舊客靠健康教育</span>
          </h1>
          <p className="mt-4 text-lg text-blue-100 max-w-3xl">
            集采打掉耗材差價、機構過剩推高獲客成本之後，診所要由「賣治療」轉做「賣健康管理」。
            三條主線：兒童預防、年度健康管理、老年修復。下面個計算器可以即刻試，改收費、改客戶量，睇吓每月、每年收益點變。
          </p>
        </div>
      </header>

      {/* 關鍵數字 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="text-3xl font-extrabold text-blue-700">¥15,000 → ¥6,000–7,000</div>
            <p className="text-sm text-gray-600 mt-2">單顆種植牙均價，集采之後。耗材差價消失，要賣技術同服務。</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <div className="text-3xl font-extrabold text-blue-700">71.9%</div>
            <p className="text-sm text-gray-600 mt-2">5 歲兒童齲患率，治療率僅 4.1%。兒童預防市場最大缺口。</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <div className="text-3xl font-extrabold text-blue-700">31.8%</div>
            <p className="text-sm text-gray-600 mt-2">瀋陽 60 歲以上人口佔比。老年修復需求穩定，而且客單價高。</p>
          </div>
        </div>
      </section>

      {/* 市場三重擠壓 */}
      <section id="market" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">點解生意越嚟越差：三重擠壓</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg">1. 集采壓價</h3>
            <p className="text-gray-600 text-sm mt-2">
              種植、正畸耗材集采，單顆種植均價由約 ¥15,000 跌到 ¥6,000–7,000。靠耗材差價賺錢嘅模式已經完。
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg">2. 機構過剩，獲客貴</h3>
            <p className="text-gray-600 text-sm mt-2">
              2024 年全國關停民營口腔機構 1.3–1.5 萬家，倒閉率逾一成；線上獲客成本 ¥1,000–2,000/人，越買越貴。
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg">3. 消費降級，但總量仍升</h3>
            <p className="text-gray-600 text-sm mt-2">
              瀋陽消費降級，病人對價格更敏感；但全國口腔市場 2024 年仍有 1,472 億元，需求冇消失，只係轉咗去高性價比同可信賴嘅診所。
            </p>
          </div>
        </div>
      </section>

      {/* 三條主線 */}
      <section id="lines" className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">三條升級主線</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="rounded-xl p-6 bg-sky-50 border border-sky-100">
              <h3 className="font-bold text-lg text-sky-900">兒童預防：吸新客</h3>
              <ul className="text-sm text-gray-700 mt-3 space-y-2 list-disc list-inside">
                <li>塗氟每半年一次，窩溝封閉鎖定 6–9 歲</li>
                <li>早矯篩查：由檢查轉化到早期矯正</li>
                <li>家長課：教刷牙、飲食，家長信你先帶小朋友返嚟</li>
                <li>可申請兒童口腔疾病綜合干預項目做執行機構</li>
              </ul>
            </div>
            <div className="rounded-xl p-6 bg-emerald-50 border border-emerald-100">
              <h3 className="font-bold text-lg text-emerald-900">年度健康管理：留舊客</h3>
              <ul className="text-sm text-gray-700 mt-3 space-y-2 list-disc list-inside">
                <li>召回系統：離店即約下次，到期前 7 日、1 日提醒</li>
                <li>口腔檔案風險分層，高風險客加密覆診</li>
                <li>會員年卡四檔：包檢查、潔牙、塗氟</li>
                <li>牙周維護每 3 個月一次，穩定返單</li>
              </ul>
            </div>
            <div className="rounded-xl p-6 bg-amber-50 border border-amber-100">
              <h3 className="font-bold text-lg text-amber-900">老年修復：做高客單</h3>
              <ul className="text-sm text-gray-700 mt-3 space-y-2 list-disc list-inside">
                <li>活動義齒、種植、All-on-4 三檔，唔同預算都有選擇</li>
                <li>賣技術唔賣耗材：講清楚方案差異，唔鬥平</li>
                <li>遼寧 60 歲以上逾三成，需求長期穩定</li>
                <li>子女代付、家庭套餐都係轉化點</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 收益計算器 */}
      <section id="calculator" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">收益計算器</h2>
        <p className="text-gray-600 mt-2">
          拉動下面每個項目嘅單價同每月客戶量，即刻睇到每月、每年收益。預設數字係示範假設，請按診所實際收費同客量修改。
        </p>

        {/* 情境按鈕 */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={
                "px-5 py-2.5 rounded-full font-semibold text-sm transition " +
                (activePreset === p.id
                  ? "bg-blue-700 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500")
              }
            >
              {p.label}
              <span className="block text-xs font-normal opacity-80">{p.desc}</span>
            </button>
          ))}
          <button
            onClick={resetAll}
            className="px-4 py-2.5 rounded-full text-sm text-gray-600 bg-white border border-gray-300 hover:border-gray-500"
          >
            重設
          </button>
        </div>

        {/* 現時基線 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-600">現時每月營收（基線，用嚟比較）：</label>
          <div className="flex items-center gap-1">
            <span className="font-semibold">¥</span>
            <input
              type="number"
              value={baseline}
              min={0}
              max={2000000}
              step={10000}
              onChange={(e) => setBaseline(clamp(parseInt(e.target.value, 10), 0, 2000000))}
              className="w-36 text-right border border-gray-300 rounded-md px-2 py-1.5 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">/月</span>
          </div>
          <span className="text-xs text-gray-400">填診所而家實際月營收，增幅先有意義。</span>
        </div>

        {/* 結果總覽 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-700 text-white rounded-xl p-5">
            <div className="text-sm text-blue-200">預計每月營收</div>
            <div className="text-2xl md:text-3xl font-extrabold mt-1">{fmt(calc.totalMonthly)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="text-sm text-gray-500">預計每年營收</div>
            <div className="text-2xl md:text-3xl font-extrabold mt-1 text-gray-900">{fmt(calc.totalAnnual)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="text-sm text-gray-500">較現時增加 /月</div>
            <div
              className={
                "text-2xl md:text-3xl font-extrabold mt-1 " +
                (calc.uplift >= 0 ? "text-emerald-600" : "text-red-600")
              }
            >
              {calc.uplift >= 0 ? "+" : ""}
              {fmt(calc.uplift)}
            </div>
            <div className="text-sm text-gray-500">
              {calc.upliftPct >= 0 ? "+" : ""}
              {calc.upliftPct.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="text-sm text-gray-500">月總人次 / 平均客單價</div>
            <div className="text-2xl md:text-3xl font-extrabold mt-1 text-gray-900">
              {calc.totalVisits.toLocaleString("zh-CN")} 人次
            </div>
            <div className="text-sm text-gray-500">平均 {fmt(calc.avgTicket)} /人次</div>
          </div>
        </div>

        {/* 各項目佔比 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6">
          <h3 className="font-bold text-gray-900">收入結構</h3>
          <div className="space-y-3 mt-4">
            {calc.lines.map((l) => {
              const share = calc.totalMonthly > 0 ? (l.monthly / calc.totalMonthly) * 100 : 0;
              return (
                <div key={l.id} className="flex items-center gap-3 text-sm">
                  <span className="w-36 shrink-0 text-gray-700">{l.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all"
                      style={{ width: share + "%" }}
                    />
                  </div>
                  <span className="w-16 text-right font-semibold shrink-0">{share.toFixed(1)}%</span>
                  <span className="w-24 text-right text-gray-600 shrink-0 hidden sm:block">{fmt(l.monthly)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 高頻項目 */}
        <h3 className="font-bold text-lg text-gray-900 mt-10">高頻項目：靠量、靠返單</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {recurring.map((item) => (
            <ServiceRow key={item.id} item={item} onPrice={setPrice} onVolume={setVolume} />
          ))}
        </div>

        {/* 高價項目 */}
        <h3 className="font-bold text-lg text-gray-900 mt-10">高價項目：靠轉化、靠信任</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {highvalue.map((item) => (
            <ServiceRow key={item.id} item={item} onPrice={setPrice} onVolume={setVolume} />
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-6 leading-relaxed">
          假設說明：種植、矯正通常分期收款，此處按簽約月一次計入；會員年卡按銷售月一次計入，實際收入應按 12 個月攤分；
          潔牙、塗氟等按實際到診人次計。以上數字係示範假設，唔係診所實際數，亦唔係收入保證，正式做預算請用診所過去 6–12 個月實際數代替。
        </p>
      </section>

      {/* 90 日計劃 */}
      <section id="plan" className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">90 日行動計劃</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="text-sm font-bold text-blue-700">P0 · 即刻做</div>
              <ul className="text-sm text-gray-700 mt-2 space-y-1.5 list-disc list-inside">
                <li>起召回系統：離店即約下次</li>
                <li>年卡四檔定價，舊客優先推</li>
                <li>家長課第一場：刷牙＋飲食</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="text-sm font-bold text-blue-700">P1 · 30 日內</div>
              <ul className="text-sm text-gray-700 mt-2 space-y-1.5 list-disc list-inside">
                <li>兒童專區：卡通診室＋安撫流程</li>
                <li>老年修復三檔套餐上架</li>
                <li>口腔檔案風險分層做起</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="text-sm font-bold text-blue-700">P2 · 60 日內</div>
              <ul className="text-sm text-gray-700 mt-2 space-y-1.5 list-disc list-inside">
                <li>學校、幼兒園合作：塗氟進校園</li>
                <li>企業團檢：周邊公司員工口腔檢查</li>
                <li>種植、矯正諮詢流程標準化</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="text-sm font-bold text-blue-700">P3 · 90 日覆盤</div>
              <ul className="text-sm text-gray-700 mt-2 space-y-1.5 list-disc list-inside">
                <li>每月睇 5 項指標：新客、召回率、會員、客單價、轉化率</li>
                <li>唔達標嘅線即刻調價或者調推廣</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 紅線 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-800">紅線：唔好踩</h2>
          <ul className="text-sm text-red-900 mt-3 space-y-1.5 list-disc list-inside">
            <li>醫療廣告內容只限法規列明嘅 8 項，唔可以保證治癒、宣傳治癒率、用患者見證或者同行比較。</li>
            <li>義診要向區縣衛健部門備案，而且唔可以出現優惠、付費內容。</li>
            <li>唔好打價格戰：集采之後鬥平只會鬥死自己，要鬥信任同服務。</li>
            <li>唔好未驗證需求先買椅旁 CAD/CAM、CBCT 等大設備，先用現有設備跑通模式。</li>
          </ul>
        </div>
        <p className="text-xs text-gray-400 mt-8">
          本頁係內部升級方案示範，數字為假設，市場數據來源見研究報告；瀋陽本地定價、醫保目錄等細節未核實，正式執行前請以診所實際情況為準。
        </p>
      </section>
    </div>
  );
}
