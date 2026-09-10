import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Shuffle, Play, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { DEFAULT_ARABIC_NAMES } from '../utils/gameData';
import { sounds } from '../utils/audio';

interface SetupScreenProps {
  onStartGame: (playerNames: string[]) => void;
  onOpenRules: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, onOpenRules }) => {
  const [names, setNames] = useState<string[]>(['أحمد', 'سارة', 'كريم', 'ليلى']);
  const [error, setError] = useState<string | null>(null);

  const handleAddPlayer = () => {
    sounds.playClick();
    if (names.length >= 12) {
      setError('الحد الأقصى هو ١٢ لاعباً');
      return;
    }
    // Pick an unused default name if available
    const unusedDefault = DEFAULT_ARABIC_NAMES.find(n => !names.includes(n));
    const newName = unusedDefault || `لاعب ${names.length + 1}`;
    setNames([...names, newName]);
    setError(null);
  };

  const handleRemovePlayer = (index: number) => {
    sounds.playClick();
    if (names.length <= 3) {
      setError('الحد الأدنى لبدء اللعبة هو ٣ لاعبين (ذئب، طبيب، ومواطن)');
      return;
    }
    setNames(names.filter((_, i) => i !== index));
    setError(null);
  };

  const handleNameChange = (index: number, val: string) => {
    const updated = [...names];
    updated[index] = val;
    setNames(updated);
    if (error) setError(null);
  };

  const handleRandomizeNames = () => {
    sounds.playClick();
    const shuffled = [...DEFAULT_ARABIC_NAMES].sort(() => 0.5 - Math.random());
    const count = names.length;
    setNames(shuffled.slice(0, count));
    setError(null);
  };

  const handleCountPreset = (count: number) => {
    sounds.playClick();
    const shuffled = [...DEFAULT_ARABIC_NAMES].sort(() => 0.5 - Math.random());
    setNames(shuffled.slice(0, count));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();

    const trimmed = names.map(n => n.trim());
    if (trimmed.some(n => n === '')) {
      setError('يرجى ملء جميع أسماء اللاعبين');
      return;
    }

    const uniqueSet = new Set(trimmed);
    if (uniqueSet.size !== trimmed.length) {
      setError('يجب أن تكون جميع أسماء اللاعبين مميزة وغير مكررة');
      return;
    }

    if (trimmed.length < 3) {
      setError('الحد الأدنى لبدء اللعبة هو ٣ لاعبين');
      return;
    }

    onStartGame(trimmed);
  };

  const wolfCount = 1;
  const doctorCount = 1;
  const citizenCount = Math.max(1, names.length - 2);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 text-right">
      {/* Header Banner */}
      <div className="text-center mb-8 relative">
        <button
          type="button"
          onClick={onOpenRules}
          className="absolute left-0 top-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>القواعد</span>
        </button>

        <div className="inline-flex items-center justify-center p-3 mb-3 bg-gradient-to-tr from-rose-600/30 to-slate-800 rounded-2xl border border-rose-500/30 shadow-inner">
          <span className="text-4xl">🐺</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
          لعبة الذئب والمواطنين
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
          لعبة جماعية لتمرير الهاتف. اكشفوا من هو الذئب الشرير قبل أن يقضي على أهل القرية!
        </p>
      </div>

      {/* Role Breakdown Badge */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>توزيع الأدوار تلقائياً ({names.length} لاعبين)</span>
          <span className="text-rose-400 font-mono text-xs">١ ذئب + ١ طبيب + الباقي مواطنون</span>
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-semibold">
          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 flex flex-col items-center gap-1">
            <span className="text-lg">🐺</span>
            <span>الذئب ({wolfCount})</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 flex flex-col items-center gap-1">
            <span className="text-lg">🩺</span>
            <span>الطبيب ({doctorCount})</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 flex flex-col items-center gap-1">
            <span className="text-lg">🧑‍🌾</span>
            <span>مواطنون ({citizenCount})</span>
          </div>
        </div>
      </div>

      {/* Quick Count Selection */}
      <div className="mb-5 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-400">اختر عدد اللاعبين سريعاً:</span>
        <div className="flex gap-1.5">
          {[3, 4, 5, 6, 7, 8].map(count => (
            <button
              key={count}
              type="button"
              onClick={() => handleCountPreset(count)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                names.length === count
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Players List Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Users className="w-4 h-4 text-rose-400" />
              <span>قائمة أسماء اللاعبين ({names.length})</span>
            </div>
            <button
              type="button"
              onClick={handleRandomizeNames}
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-800/40 transition cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>أسماء عشوائية</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[38vh] overflow-y-auto pr-1">
            {names.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`اسم اللاعب ${index + 1}`}
                  maxLength={18}
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 transition outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(index)}
                  disabled={names.length <= 3}
                  title="حذف اللاعب"
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddPlayer}
            disabled={names.length >= 12}
            className="w-full py-2.5 border border-dashed border-slate-700 hover:border-slate-500 bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>إضافة لاعب جديد</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-700/60 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-base font-black rounded-2xl shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98]"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>بدء اللعبة وتوزيع الأدوار</span>
        </button>
      </form>
    </div>
  );
};
