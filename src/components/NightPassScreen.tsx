import React from 'react';
import { Player } from '../types';
import { Moon, Eye, Shield, Lock } from 'lucide-react';
import { sounds } from '../utils/audio';
import { AVATAR_COLORS } from '../utils/gameData';
import { motion } from 'motion/react';

interface NightPassScreenProps {
  player: Player;
  roundNumber: number;
  playerIndex: number;
  totalPlayers: number;
  onReadyToReveal: () => void;
}

export const NightPassScreen: React.FC<NightPassScreenProps> = ({
  player,
  roundNumber,
  playerIndex,
  totalPlayers,
  onReadyToReveal,
}) => {
  const avatarClass = AVATAR_COLORS[player.avatarIndex % AVATAR_COLORS.length];

  const handleReveal = () => {
    sounds.playClick();
    onReadyToReveal();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 text-center flex flex-col items-center justify-between min-h-[75vh]">
      {/* Night header indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2"
      >
        <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
          <Moon className="w-4 h-4" />
          <span>الليلة {roundNumber}</span>
        </div>
        <div className="text-slate-400 font-mono font-semibold">
          لاعب {playerIndex + 1} من {totalPlayers}
        </div>
      </motion.div>

      {/* Main Pass Prompt */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="my-auto w-full flex flex-col items-center"
      >
        {/* Animated Moon / Night Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600/30 to-slate-950 border border-indigo-500/30 flex items-center justify-center shadow-2xl shadow-indigo-950">
            <Moon className="w-12 h-12 text-indigo-300 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-400 mb-2">
          الرجاء تمرير الهاتف بحذر وسرية إلى:
        </p>

        {/* Player Spotlight Card */}
        <div className="w-full p-6 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/30 shadow-2xl relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
          
          <div className={`w-16 h-16 mx-auto rounded-2xl ${avatarClass} flex items-center justify-center text-2xl font-black mb-3 shadow-lg`}>
            {player.name.charAt(0)}
          </div>

          <h2 className="text-3xl font-black text-white tracking-wide mb-1">
            {player.name}
          </h2>

          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300/90 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full mt-2">
            <Shield className="w-3.5 h-3.5" />
            <span>لا تنظر للشاشة إلا إذا كنت {player.name}</span>
          </div>
        </div>

        {/* Warning Note */}
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
          احرص على ألا يرى أي لاعب آخر الشاشة عند الضغط حتى لا تُكشف هويتك أو تخسر ميزتك!
        </p>

        {/* Reveal Button */}
        <button
          type="button"
          onClick={handleReveal}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-950/60 flex items-center justify-center gap-2.5 transition cursor-pointer"
        >
          <Eye className="w-5 h-5" />
          <span>أنا {player.name}، اكشف دوري سرًا</span>
        </button>
      </motion.div>

      {/* Footer hint */}
      <div className="text-[11px] text-slate-500">
        القرية نائمة الآن... فقط أصحاب الأدوار يتحركون
      </div>
    </div>
  );
};
