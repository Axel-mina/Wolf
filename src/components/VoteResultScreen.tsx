import React, { useEffect, useState } from 'react';
import { Player, Role } from '../types';
import { ROLES_INFO } from '../utils/gameData';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Award, Skull, Moon, ArrowLeft, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface VoteResultScreenProps {
  votedPlayer: Player | null; // null if skipped
  wolfWon: boolean;
  citizensWon: boolean;
  roundNumber: number;
  onProceedToNextNight: () => void;
  onProceedToGameOver: () => void;
}

export const VoteResultScreen: React.FC<VoteResultScreenProps> = ({
  votedPlayer,
  wolfWon,
  citizensWon,
  roundNumber,
  onProceedToNextNight,
  onProceedToGameOver,
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Dramatic reveal timeout
    const timer = setTimeout(() => {
      setRevealed(true);
      if (citizensWon) {
        sounds.playVictory();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else if (votedPlayer?.role === 'CITIZEN' || votedPlayer?.role === 'DOCTOR') {
        sounds.playGong();
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [citizensWon, votedPlayer]);

  if (!votedPlayer) {
    // Vote was skipped
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-8 text-right flex flex-col justify-between min-h-[75vh]">
        <div className="my-auto text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl">
            ⚖️
          </div>
          <h2 className="text-2xl font-black text-white">لم يُعدَم أحد اليوم!</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            قررت القرية عدم إعدام أي شخص لعدم كفاية الأدلة أو التعادل.
            الذئب لا يزال بينكم حياً طليقاً!
          </p>
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-semibold max-w-md mx-auto">
            تتواصل اللعبة الآن نحو الليلة التالية...
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              sounds.playNightTransition();
              onProceedToNextNight();
            }}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-950/60 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Moon className="w-5 h-5" />
            <span>حلول الليل وبدء الليلة رقم {roundNumber + 1}</span>
          </button>
        </div>
      </div>
    );
  }

  const roleInfo = ROLES_INFO[votedPlayer.role];
  const isWolf = votedPlayer.role === 'WOLF';

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 text-right flex flex-col justify-between min-h-[80vh]">
      <div>
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            نتيجة محاكمة القرية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            قرار إعدام {votedPlayer.name}
          </h2>
        </div>

        {/* Dramatic Card */}
        {!revealed ? (
          <div className="p-8 rounded-3xl bg-slate-900 border-2 border-slate-800 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center animate-spin">
              ⚖️
            </div>
            <h3 className="text-xl font-bold text-slate-200">
              جارٍ كشف حقيقة {votedPlayer.name}...
            </h3>
            <p className="text-xs text-slate-400">
              هل كان هو الذئب الشرير أم مواطناً بريئاً؟
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 sm:p-8 rounded-3xl border-2 text-center space-y-4 shadow-2xl ${
              isWolf
                ? 'bg-emerald-950/50 border-emerald-500/80 shadow-emerald-950/50'
                : 'bg-red-950/50 border-red-600/80 shadow-red-950/50'
            }`}
          >
            {/* Reveal Icon */}
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-lg ${
                isWolf ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {isWolf ? '🐺' : votedPlayer.role === 'DOCTOR' ? '🩺' : '🧑‍🌾'}
            </div>

            <div>
              <span
                className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 ${
                  isWolf
                    ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                    : 'bg-red-950 border-red-600 text-red-300'
                }`}
              >
                {isWolf ? 'تم صيد الذئب بنجاح!' : 'خطأ فادح - إعدام بريء!'}
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                كان {votedPlayer.name}: <span className={roleInfo.color}>{roleInfo.name}</span>
              </h3>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed max-w-sm mx-auto">
              {isWolf ? (
                <>
                  <strong className="text-emerald-400">مات الذئب!</strong> استطاع أهل القرية بذكائهم كشف الذئب والقضاء عليه، وبذلك عمّ السلام في القرية ونجا المواطنون! 🎉
                </>
              ) : (
                <>
                  <strong className="text-red-400">كارثة!</strong> لقد أعدمتم شخصاً مسالماً! والذئب الحقيقي لا يزال حياً بينكم يتظاهر بالبراءة!
                </>
              )}
            </p>

            {/* Game continuity alert */}
            {!isWolf && !wolfWon && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-amber-300 font-semibold">
                ⚠️ تتواصل اللعبة حتى يصوت المواطنون ضد الذئب الحقيقي!
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      {revealed && (
        <div className="pt-6 border-t border-slate-800">
          {citizensWon || wolfWon ? (
            <button
              type="button"
              onClick={onProceedToGameOver}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span>عرض ملخص نهاية اللعبة والفائز 🏆</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playNightTransition();
                onProceedToNextNight();
              }}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-base rounded-2xl shadow-xl shadow-indigo-950/60 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Moon className="w-5 h-5" />
              <span>تتواصل اللعبة: حلول الليل {roundNumber + 1} 🌙</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
