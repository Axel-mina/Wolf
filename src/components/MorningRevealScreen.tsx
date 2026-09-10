import React, { useEffect } from 'react';
import { Player, MorningReport } from '../types';
import { Sun, HeartHandshake, Skull, Users, ArrowLeft, ShieldCheck, Flame } from 'lucide-react';
import { sounds } from '../utils/audio';
import { AVATAR_COLORS } from '../utils/gameData';
import { motion } from 'motion/react';

interface MorningRevealScreenProps {
  roundNumber: number;
  report: MorningReport;
  players: Player[];
  onProceedToVoting: () => void;
}

export const MorningRevealScreen: React.FC<MorningRevealScreenProps> = ({
  roundNumber,
  report,
  players,
  onProceedToVoting,
}) => {
  useEffect(() => {
    sounds.playMorningChime();
  }, []);

  const attackedPlayer = players.find((p) => p.id === report.attackedPlayerId);
  const eliminatedPlayer = players.find((p) => p.id === report.eliminatedPlayerId);
  const alivePlayers = players.filter((p) => p.isAlive);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 text-right flex flex-col justify-between min-h-[80vh]">
      {/* Morning Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center justify-center p-3 mb-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-xl shadow-amber-950/40">
          <Sun className="w-8 h-8 animate-spin-slow" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          أشرقت الشمس على القرية!
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          الليلة رقم {roundNumber} انقضت... اجتمعوا الآن يا أهل القرية لسماع ما حدث!
        </p>
      </motion.div>

      {/* Night Outcome Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="my-auto"
      >
        {report.savedByDoctor ? (
          /* Case 1: Saved by Doctor */
          <div className="p-6 rounded-3xl bg-emerald-950/50 border-2 border-emerald-600/80 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl shadow-inner">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <span className="inline-block text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 mb-2">
                بطولة وإنقاذ ناجح
              </span>
              <h3 className="text-2xl font-black text-white">
                لم يمُت أحد هذه الليلة! 🎉
              </h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed max-w-md mx-auto">
              هاجم الذئب الشرير أحد المواطنين في الظلام، ولكن طبيب القرية كان متيقظاً واستطاع إسعافه وإنقاذه في اللحظات الأخيرة!
            </p>
            <div className="text-xs font-semibold text-emerald-300/90 bg-emerald-900/30 p-2.5 rounded-xl border border-emerald-800/40">
              جميع أهل القرية سالمون، وحان وقت البحث عن الذئب!
            </div>
          </div>
        ) : eliminatedPlayer ? (
          /* Case 2: Someone was killed */
          <div className="p-6 rounded-3xl bg-red-950/60 border-2 border-red-600/80 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center text-3xl shadow-inner">
              <Skull className="w-9 h-9" />
            </div>
            <div>
              <span className="inline-block text-xs font-bold text-red-400 bg-red-950 px-3 py-1 rounded-full border border-red-800 mb-2">
                فاجعة في القرية
              </span>
              <h3 className="text-2xl font-black text-white">
                لقد قُتل اللاعب: <span className="text-red-400 underline decoration-red-500/50">{eliminatedPlayer.name}</span>
              </h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed max-w-md mx-auto">
              تسلل الذئب في جنح الظلام وافترس <strong className="text-white font-bold">{eliminatedPlayer.name}</strong> قبل أن يصل إليه الطبيب. خرج اللاعب من اللعبة!
            </p>
            <div className="text-xs font-semibold text-red-300/90 bg-red-900/40 p-2.5 rounded-xl border border-red-800/50">
              ⚠️ تنبيه: اللاعب المتوفى لا يحق له الحديث أو التصويت في الصباح!
            </div>
          </div>
        ) : (
          /* Case 3: Peaceful night (rare fallback) */
          <div className="p-6 rounded-3xl bg-slate-900/80 border-2 border-slate-700 shadow-2xl text-center space-y-3">
            <div className="text-4xl">🌙</div>
            <h3 className="text-xl font-bold text-white">مرت الليلة بهدوء وسلام</h3>
            <p className="text-sm text-slate-300">لم يُصب أي لاعب بأذى خلال هذه الليلة.</p>
          </div>
        )}

        {/* Alive Players Roster */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-bold">
            <div className="flex items-center gap-1.5 text-white">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>اللاعبون الأحياء المتبقون ({alivePlayers.length})</span>
            </div>
            <span>الذئب لا يزال متخفياً بينهم!</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {players.map((p) => {
              const avatarColor = AVATAR_COLORS[p.avatarIndex % AVATAR_COLORS.length];
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                    p.isAlive
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-950/60 border-slate-800/40 text-slate-500 line-through opacity-60'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md ${avatarColor} flex items-center justify-center text-[10px] ${
                      !p.isAlive && 'grayscale opacity-50'
                    }`}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <span>{p.name}</span>
                  {!p.isAlive && <Skull className="w-3.5 h-3.5 text-red-500 ml-1 inline" />}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Button to Voting Phase */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onProceedToVoting();
          }}
          className="w-full py-4 bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-black text-base rounded-2xl shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98]"
        >
          <span>بدء مرحلة النقاش والتصويت لكشف الذئب</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
