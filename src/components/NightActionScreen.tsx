import React, { useState } from 'react';
import { Player } from '../types';
import { ROLES_INFO, AVATAR_COLORS } from '../utils/gameData';
import { sounds } from '../utils/audio';
import { ShieldCheck, Skull, CheckCircle2, Lock, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface NightActionScreenProps {
  player: Player;
  alivePlayers: Player[];
  initialWolfTargetId: string | null;
  initialDoctorTargetId: string | null;
  onCompleteAction: (wolfTargetId: string | null, doctorTargetId: string | null) => void;
}

export const NightActionScreen: React.FC<NightActionScreenProps> = ({
  player,
  alivePlayers,
  initialWolfTargetId,
  initialDoctorTargetId,
  onCompleteAction,
}) => {
  const roleInfo = ROLES_INFO[player.role];

  // If Wolf: selects from alive players EXCLUDING self
  // If Doctor: selects from alive players INCLUDING self
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(() => {
    if (player.role === 'WOLF') return initialWolfTargetId;
    if (player.role === 'DOCTOR') return initialDoctorTargetId;
    return null;
  });

  const [hasConfirmedHiding, setHasConfirmedHiding] = useState(false);

  const targets = alivePlayers.filter((p) => {
    if (player.role === 'WOLF') {
      return p.id !== player.id; // Wolf cannot kill himself
    }
    return true; // Doctor can heal anyone alive (including self)
  });

  const handleSelectTarget = (targetId: string) => {
    if (player.role === 'WOLF') {
      sounds.playWolfAction();
    } else if (player.role === 'DOCTOR') {
      sounds.playDoctorHeal();
    } else {
      sounds.playClick();
    }
    setSelectedTargetId(targetId);
  };

  const handleFinish = () => {
    sounds.playClick();
    setHasConfirmedHiding(true);

    let updatedWolf = initialWolfTargetId;
    let updatedDoctor = initialDoctorTargetId;

    if (player.role === 'WOLF') {
      updatedWolf = selectedTargetId;
    } else if (player.role === 'DOCTOR') {
      updatedDoctor = selectedTargetId;
    }

    // Small delay to clear screen before handoff
    setTimeout(() => {
      onCompleteAction(updatedWolf, updatedDoctor);
    }, 250);
  };

  const isActionRequired = player.role === 'WOLF' || player.role === 'DOCTOR';
  const canProceed = !isActionRequired || selectedTargetId !== null;

  if (hasConfirmedHiding) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 mb-3 animate-pulse">
          <EyeOff className="w-8 h-8 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">تم إخفاء هويتك بنجاح</h3>
        <p className="text-xs text-slate-400">جارٍ التجهيز للاعب التالي...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 text-right flex flex-col min-h-[85vh] justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs text-slate-400">
        <span className="font-semibold text-white">اللاعب: {player.name}</span>
        <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
          <Lock className="w-3.5 h-3.5" />
          <span>شاشة سرية خاصة</span>
        </span>
      </div>

      <div className="my-auto py-4 space-y-6">
        {/* Role Identity Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-5 rounded-3xl ${roleInfo.bgColor} border-2 ${roleInfo.borderColor} shadow-2xl relative overflow-hidden`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${roleInfo.bgColor} border ${roleInfo.borderColor} ${roleInfo.color} mb-2`}>
                {roleInfo.badge}
              </span>
              <h2 className="text-3xl font-black text-white">
                دورك: {roleInfo.name}
              </h2>
            </div>
            <div className="text-4xl">
              {player.role === 'WOLF' && '🐺'}
              {player.role === 'DOCTOR' && '🩺'}
              {player.role === 'CITIZEN' && '🧑‍🌾'}
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            {roleInfo.description}
          </p>
        </motion.div>

        {/* Action Area for Wolf or Doctor */}
        {isActionRequired ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {player.role === 'WOLF' ? (
                  <>
                    <Skull className="w-4 h-4 text-red-400" />
                    <span>{roleInfo.nightInstruction}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{roleInfo.nightInstruction}</span>
                  </>
                )}
              </h4>
              <span className="text-[11px] text-slate-400">اختر لاعباً واحداً</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {targets.map((target) => {
                const isSelected = selectedTargetId === target.id;
                const isSelf = target.id === player.id;
                const avatarColor = AVATAR_COLORS[target.avatarIndex % AVATAR_COLORS.length];

                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => handleSelectTarget(target.id)}
                    className={`p-3 rounded-2xl border text-right transition cursor-pointer relative flex flex-col justify-between min-h-[86px] ${
                      isSelected
                        ? player.role === 'WOLF'
                          ? 'bg-red-950 border-red-500 shadow-lg shadow-red-950 ring-2 ring-red-500/50'
                          : 'bg-emerald-950 border-emerald-500 shadow-lg shadow-emerald-950 ring-2 ring-emerald-500/50'
                        : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className={`w-8 h-8 rounded-xl ${avatarColor} flex items-center justify-center font-bold text-xs shadow`}>
                        {target.name.charAt(0)}
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className={`w-4 h-4 ${player.role === 'WOLF' ? 'text-red-400' : 'text-emerald-400'}`} />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-sm text-white truncate">
                        {target.name}
                      </div>
                      {isSelf && (
                        <span className="text-[10px] text-emerald-400 font-semibold block">
                          (حماية نفسك)
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Citizen View */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-3"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center text-2xl">
              🌙
            </div>
            <h4 className="text-base font-bold text-white">القرية نائمة بهدوء...</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              بصفتك مواطناً مسالماً، لا يوجد لديك أي إجراء ليلي. احفظ هويتك جيداً واستعد للتصويت بحكمة في الصباح لكشف الذئب!
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              💡 نصيحة: عندما تعيد الهاتف، تظاهر بالتفكير قليلاً حتى لا يشك الذئب في أنك مواطن بلا صلاحيات ليلية!
            </div>
          </motion.div>
        )}
      </div>

      {/* Confirmation Button */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={handleFinish}
          disabled={!canProceed}
          className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
            canProceed
              ? 'bg-slate-100 hover:bg-white text-slate-950 shadow-white/10 active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>
            {!canProceed
              ? player.role === 'WOLF'
                ? 'يرجى اختيار ضحية قبل المتابعة'
                : 'يرجى اختيار شخص لحمايته'
              : 'تأكيد، إخفاء وتمرير الهاتف للاعب التالي'}
          </span>
        </button>
      </div>
    </div>
  );
};
