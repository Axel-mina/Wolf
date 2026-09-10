import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { Gavel, Clock, Users, AlertCircle, CheckCircle, ShieldAlert, Play, Pause, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';
import { AVATAR_COLORS } from '../utils/gameData';
import { motion } from 'motion/react';

interface VotingScreenProps {
  alivePlayers: Player[];
  allPlayers: Player[];
  roundNumber: number;
  onConfirmElimination: (votedPlayerId: string | null) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  alivePlayers,
  roundNumber,
  onConfirmElimination,
}) => {
  // Vote tally: playerId -> number of votes
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    alivePlayers.forEach((p) => {
      initial[p.id] = 0;
    });
    return initial;
  });

  // Discussion timer
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sounds.playGong();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  const handleAddVote = (playerId: string) => {
    sounds.playClick();
    setVotes((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));
  };

  const handleRemoveVote = (playerId: string) => {
    sounds.playClick();
    setVotes((prev) => ({
      ...prev,
      [playerId]: Math.max(0, (prev[playerId] || 0) - 1),
    }));
  };

  const handleResetVotes = () => {
    sounds.playClick();
    const reset: Record<string, number> = {};
    alivePlayers.forEach((p) => {
      reset[p.id] = 0;
    });
    setVotes(reset);
  };

  // Find candidate with most votes
  let maxVotes = 0;
  let topCandidates: Player[] = [];
  const totalVotesCast = (Object.values(votes) as number[]).reduce((sum, v) => sum + v, 0);

  alivePlayers.forEach((p) => {
    const v = votes[p.id] || 0;
    if (v > maxVotes) {
      maxVotes = v;
      topCandidates = [p];
    } else if (v === maxVotes && v > 0) {
      topCandidates.push(p);
    }
  });

  const isTie = topCandidates.length > 1;
  const hasConsensus = maxVotes > 0 && !isTie;
  const condemnedPlayer = hasConsensus ? topCandidates[0] : null;

  const handleConfirmVote = () => {
    if (!condemnedPlayer) return;
    sounds.playGong();
    onConfirmElimination(condemnedPlayer.id);
  };

  const handleSkipVote = () => {
    sounds.playClick();
    onConfirmElimination(null); // No one eliminated
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 text-right flex flex-col justify-between min-h-[85vh]">
      <div>
        {/* Header with Title and Round */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Gavel className="w-4 h-4 text-amber-400" />
            <span>محاكمة القرية والتصويت (اليوم {roundNumber})</span>
          </div>
          <span className="bg-amber-950/40 text-amber-300 border border-amber-800/40 px-2.5 py-0.5 rounded-full font-semibold">
            {alivePlayers.length} ناخبين أحياء
          </span>
        </div>

        {/* Discussion Timer Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${timeLeft <= 10 && timeLeft > 0 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-xs text-slate-300 font-semibold">وقت النقاش والاتهامات:</span>
            <span className={`font-mono text-sm font-bold ${timeLeft <= 10 && timeLeft > 0 ? 'text-red-400' : 'text-amber-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsTimerRunning(!isTimerRunning);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTimerRunning ? 'إيقاف' : 'تشغيل'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsTimerRunning(false);
                setTimeLeft(90);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition cursor-pointer"
              title="إعادة ضبط الموقت"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Instruction Message */}
        <div className="mb-4 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
          💡 <strong className="text-white">طريقة التصويت:</strong> ارفعوا الأيدي أو اتفقوا في النقاش، ثم اضغط على زر <strong className="text-amber-400">(+)</strong> لتسجيل الأصوات ضد المشتبه بهم. صاحب أعلى أصوات سيُعدم وتُكشف هويته!
        </div>

        {/* Candidates Voting Cards */}
        <div className="space-y-2.5 max-h-[44vh] overflow-y-auto pr-1">
          {alivePlayers.map((player) => {
            const count = votes[player.id] || 0;
            const isLeader = hasConsensus && condemnedPlayer?.id === player.id;
            const isTied = isTie && topCandidates.some((c) => c.id === player.id);
            const avatarColor = AVATAR_COLORS[player.avatarIndex % AVATAR_COLORS.length];

            return (
              <motion.div
                key={player.id}
                layout
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isLeader
                    ? 'bg-rose-950/60 border-rose-500/80 shadow-lg shadow-rose-950/40'
                    : isTied
                    ? 'bg-amber-950/40 border-amber-600/70'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                {/* Player Profile */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${avatarColor} flex items-center justify-center font-bold text-sm shadow`}>
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {isLeader && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-600 text-white shadow">
                          المرشح للإعدام
                        </span>
                      )}
                      {isTied && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white">
                          تعادل في الأصوات
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      عدد الأصوات: <span className="text-white font-mono font-bold text-sm">{count}</span>
                    </div>
                  </div>
                </div>

                {/* Vote Counter Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveVote(player.id)}
                    disabled={count === 0}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold flex items-center justify-center transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-base text-white">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddVote(player.id)}
                    className="w-8 h-8 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold flex items-center justify-center transition shadow cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Voting Status / Guidance Box */}
        <div className="mt-4">
          {isTie && maxVotes > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-600/70 text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                يوجد تعادل بين {topCandidates.map((c) => c.name).join(' و ')} ({maxVotes} أصوات). يُرجى حسم التعادل أو تخطي التصويت لليوم.
              </span>
            </div>
          )}

          {hasConsensus && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/70 text-rose-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                أهل القرية قرروا إعدام: <strong className="text-white underline">{condemnedPlayer.name}</strong> ({maxVotes} أصوات).
              </span>
            </div>
          )}

          {maxVotes === 0 && (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs text-center">
              لم يتم الإدلاء بأي أصوات حتى الآن. ناقشوا وصوتوا ضد الذئب!
            </div>
          )}
        </div>
      </div>

      {/* Execution / Skip Actions */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2 mt-4">
        <button
          type="button"
          onClick={handleConfirmVote}
          disabled={!hasConsensus}
          className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
            hasConsensus
              ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/60 active:scale-[0.98]'
              : 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Gavel className="w-5 h-5" />
          <span>
            {hasConsensus
              ? `تنفيذ حكم الإعدام بحق ${condemnedPlayer.name} ⚖️`
              : 'صوتوا لاختيار المشتبه به أولاً'}
          </span>
        </button>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={handleSkipVote}
            className="text-xs text-slate-400 hover:text-white underline p-1 transition cursor-pointer"
          >
            تخطي التصويت لليوم (لم تتفق القرية على إعدام أحد)
          </button>

          {totalVotesCast > 0 && (
            <button
              type="button"
              onClick={handleResetVotes}
              className="text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer"
            >
              تصفير جميع الأصوات
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
