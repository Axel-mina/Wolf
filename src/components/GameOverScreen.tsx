import React, { useEffect } from 'react';
import { Player } from '../types';
import { ROLES_INFO, AVATAR_COLORS } from '../utils/gameData';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, Users, Skull, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface GameOverScreenProps {
  winner: 'CITIZENS' | 'WOLF';
  players: Player[];
  roundsPlayed: number;
  onPlayAgainSame: () => void;
  onResetToSetup: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  winner,
  players,
  roundsPlayed,
  onPlayAgainSame,
  onResetToSetup,
}) => {
  const isCitizens = winner === 'CITIZENS';

  useEffect(() => {
    if (isCitizens) {
      sounds.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } else {
      sounds.playGong();
    }
  }, [isCitizens]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 text-right flex flex-col justify-between min-h-[85vh]">
      <div>
        {/* Victory Header */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-6 rounded-3xl border-2 text-center space-y-3 mb-6 shadow-2xl ${
            isCitizens
              ? 'bg-gradient-to-b from-emerald-950/80 to-slate-950 border-emerald-500/80 shadow-emerald-950/60'
              : 'bg-gradient-to-b from-red-950/80 to-slate-950 border-red-600/80 shadow-red-950/60'
          }`}
        >
          <div
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-lg ${
              isCitizens ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}
          >
            {isCitizens ? '🏆' : '🐺'}
          </div>

          <div>
            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 ${
                isCitizens
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-400'
                  : 'bg-red-950 border-red-600 text-red-400'
              }`}
            >
              نهاية اللعبة
            </span>
            <h2 className="text-3xl font-black text-white">
              {isCitizens ? 'فاز المواطنون الشرفاء!' : 'فاز الذئب الماكر!'}
            </h2>
          </div>

          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {isCitizens
              ? 'تم القضاء على الذئب الشرير بفضل ذكاء وتعاون أهل القرية!'
              : 'استطاع الذئب مراوغة الجميع والتخفي ببراعة حتى سيطر على القرية بالكامل!'}
          </p>

          <div className="flex items-center justify-center gap-4 pt-2 text-xs font-mono text-slate-400">
            <span>عدد الجولات: {roundsPlayed}</span>
            <span>•</span>
            <span>عدد اللاعبين: {players.length}</span>
          </div>
        </motion.div>

        {/* Roles Revelation Roster */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>كشف جميع الأدوار الحقيقية للاعبين</span>
            </h3>
            <span className="text-[11px] text-slate-400">من كان من؟</span>
          </div>

          <div className="space-y-2 max-h-[36vh] overflow-y-auto pr-1">
            {players.map((player) => {
              const roleInfo = ROLES_INFO[player.role];
              const avatarColor = AVATAR_COLORS[player.avatarIndex % AVATAR_COLORS.length];

              return (
                <div
                  key={player.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    player.role === 'WOLF'
                      ? 'bg-red-950/40 border-red-800/60 text-white'
                      : player.role === 'DOCTOR'
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${avatarColor} flex items-center justify-center font-bold text-xs shadow`}>
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {!player.isAlive && (
                          <span className="text-[10px] text-red-400 bg-red-950/80 px-1.5 py-0.2 rounded border border-red-800/50">
                            ميت
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <span>{player.isAlive ? 'على قيد الحياة' : 'تم إقصاؤه'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${roleInfo.bgColor} border ${roleInfo.borderColor} ${roleInfo.color}`}>
                      <span>{player.role === 'WOLF' ? '🐺' : player.role === 'DOCTOR' ? '🩺' : '🧑‍🌾'}</span>
                      <span>{roleInfo.name}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Replay Actions */}
      <div className="pt-6 border-t border-slate-800 space-y-2.5">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onPlayAgainSame();
          }}
          className="w-full py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-base rounded-2xl shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98]"
        >
          <RotateCcw className="w-5 h-5" />
          <span>لعبة جديدة بنفس اللاعبين (أدوار جديدة)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onResetToSetup();
          }}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm rounded-xl border border-slate-800 transition cursor-pointer"
        >
          تغيير أسماء أو عدد اللاعبين
        </button>
      </div>
    </div>
  );
};
