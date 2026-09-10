import { useState } from 'react';
import { Player, GamePhase, Role, MorningReport } from './types';
import { SetupScreen } from './components/SetupScreen';
import { NightPassScreen } from './components/NightPassScreen';
import { NightActionScreen } from './components/NightActionScreen';
import { MorningRevealScreen } from './components/MorningRevealScreen';
import { VotingScreen } from './components/VotingScreen';
import { VoteResultScreen } from './components/VoteResultScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { RulesModal } from './components/RulesModal';
import { sounds } from './utils/audio';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Download } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [players, setPlayers] = useState<Player[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Night State
  const [nightPlayerIndex, setNightPlayerIndex] = useState(0);
  const [wolfTargetId, setWolfTargetId] = useState<string | null>(null);
  const [doctorTargetId, setDoctorTargetId] = useState<string | null>(null);

  // Morning State
  const [morningReport, setMorningReport] = useState<MorningReport>({
    attackedPlayerId: null,
    savedByDoctor: false,
    eliminatedPlayerId: null,
  });

  // Vote Result State
  const [lastVotedPlayer, setLastVotedPlayer] = useState<Player | null>(null);
  const [winner, setWinner] = useState<'CITIZENS' | 'WOLF' | null>(null);

  // Helpers
  const alivePlayers = players.filter((p) => p.isAlive);

  const toggleSound = () => {
    const newState = sounds.toggleSound();
    setIsSoundOn(newState);
  };

  // Start new game with given names
  const handleStartGame = (names: string[]) => {
    // 1 Wolf, 1 Doctor, and rest Citizens
    const roles: Role[] = ['WOLF', 'DOCTOR'];
    while (roles.length < names.length) {
      roles.push('CITIZEN');
    }

    // Shuffle roles randomly
    const shuffledRoles = [...roles].sort(() => 0.5 - Math.random());

    const newPlayers: Player[] = names.map((name, idx) => ({
      id: `player_${idx}_${Date.now()}`,
      name,
      role: shuffledRoles[idx],
      isAlive: true,
      avatarIndex: idx,
    }));

    setPlayers(newPlayers);
    setRoundNumber(1);
    setWolfTargetId(null);
    setDoctorTargetId(null);
    setNightPlayerIndex(0);
    setWinner(null);
    setLastVotedPlayer(null);

    sounds.playNightTransition();
    setPhase('NIGHT_PASS');
  };

  // Play again with same names
  const handlePlayAgainSame = () => {
    const names = players.map((p) => p.name);
    handleStartGame(names);
  };

  // Reset to initial setup
  const handleResetToSetup = () => {
    setShowResetConfirm(false);
    setPhase('SETUP');
    setWinner(null);
  };

  // Night: player ready to see their role
  const handleReadyToRevealNight = () => {
    setPhase('NIGHT_ACTION');
  };

  // Night: player finished seeing role and taking action
  const handleCompleteNightAction = (newWolfTarget: string | null, newDoctorTarget: string | null) => {
    if (newWolfTarget !== null) setWolfTargetId(newWolfTarget);
    if (newDoctorTarget !== null) setDoctorTargetId(newDoctorTarget);

    const nextIndex = nightPlayerIndex + 1;
    if (nextIndex < alivePlayers.length) {
      // More players need to see their role
      setNightPlayerIndex(nextIndex);
      setPhase('NIGHT_PASS');
    } else {
      // All alive players passed phone!
      // Resolve night outcome
      const attacked = newWolfTarget !== null ? newWolfTarget : wolfTargetId;
      const protectedTarget = newDoctorTarget !== null ? newDoctorTarget : doctorTargetId;

      let saved = false;
      let eliminatedId: string | null = null;

      if (attacked) {
        if (attacked === protectedTarget) {
          saved = true;
          eliminatedId = null;
        } else {
          saved = false;
          eliminatedId = attacked;
        }
      }

      setMorningReport({
        attackedPlayerId: attacked,
        savedByDoctor: saved,
        eliminatedPlayerId: eliminatedId,
      });

      // Update alive state if someone was eliminated
      if (eliminatedId) {
        setPlayers((prev) =>
          prev.map((p) => (p.id === eliminatedId ? { ...p, isAlive: false } : p))
        );
      }

      setPhase('MORNING_REVEAL');
    }
  };

  // Morning reveal -> Proceed to voting
  const handleProceedToVoting = () => {
    setPhase('VOTING');
  };

  // Voting complete -> Process voted out player
  const handleConfirmElimination = (votedId: string | null) => {
    if (votedId) {
      const target = players.find((p) => p.id === votedId) || null;
      setLastVotedPlayer(target);

      const updatedPlayers = players.map((p) =>
        p.id === votedId ? { ...p, isAlive: false } : p
      );
      setPlayers(updatedPlayers);

      // Check win conditions according to prompt:
      // "اذا مات الذئب تنتهي اللعبة و اذا لم يمت تتواصل اللعبة حتى يصوتوا المواطنون ضد الذئب"
      if (target?.role === 'WOLF') {
        setWinner('CITIZENS');
      } else {
        // Wolf is still alive. Did wolf eliminate enough citizens to dominate?
        const remainingAlive = updatedPlayers.filter((p) => p.isAlive);
        const wolfAlive = remainingAlive.some((p) => p.role === 'WOLF');
        const citizensAliveCount = remainingAlive.filter((p) => p.role !== 'WOLF').length;

        if (wolfAlive && citizensAliveCount <= 1) {
          // Wolf equals or outnumbers remaining citizens (1 wolf vs 1 citizen)
          setWinner('WOLF');
        } else {
          setWinner(null);
        }
      }
    } else {
      // Voting was skipped
      setLastVotedPlayer(null);
      setWinner(null);
    }

    setPhase('VOTE_RESULT');
  };

  // Next night
  const handleProceedToNextNight = () => {
    setRoundNumber((r) => r + 1);
    setNightPlayerIndex(0);
    setWolfTargetId(null);
    setDoctorTargetId(null);
    setPhase('NIGHT_PASS');
  };

  // Final game over screen
  const handleProceedToGameOver = () => {
    setPhase('GAME_OVER');
  };

  // Current night player (from alive players list)
  const currentNightPlayer = alivePlayers[nightPlayerIndex] || alivePlayers[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white" dir="rtl">
      {/* Universal Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐺</span>
            <span className="font-black text-sm sm:text-base tracking-wide text-white">
              لعبة الذئب والمواطنين
            </span>
          </div>

          <div className="flex items-center gap-2">
            {phase !== 'SETUP' && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                title="إعادة بدء اللعبة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <a
              href="/wolf-game-project.zip"
              download="wolf-game-project.zip"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition cursor-pointer flex items-center gap-1 text-xs"
              title="تحميل المشروع بصيغة ملف ZIP (Download ZIP)"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline font-mono font-semibold">ZIP</span>
            </a>

            <button
              type="button"
              onClick={() => setIsRulesOpen(true)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="قواعد اللعبة"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title={isSoundOn ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {isSoundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Screen Content */}
      <main className="flex-1 flex flex-col justify-center py-4">
        {phase === 'SETUP' && (
          <SetupScreen
            onStartGame={handleStartGame}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}

        {phase === 'NIGHT_PASS' && currentNightPlayer && (
          <NightPassScreen
            player={currentNightPlayer}
            roundNumber={roundNumber}
            playerIndex={nightPlayerIndex}
            totalPlayers={alivePlayers.length}
            onReadyToReveal={handleReadyToRevealNight}
          />
        )}

        {phase === 'NIGHT_ACTION' && currentNightPlayer && (
          <NightActionScreen
            player={currentNightPlayer}
            alivePlayers={alivePlayers}
            initialWolfTargetId={wolfTargetId}
            initialDoctorTargetId={doctorTargetId}
            onCompleteAction={handleCompleteNightAction}
          />
        )}

        {phase === 'MORNING_REVEAL' && (
          <MorningRevealScreen
            roundNumber={roundNumber}
            report={morningReport}
            players={players}
            onProceedToVoting={handleProceedToVoting}
          />
        )}

        {phase === 'VOTING' && (
          <VotingScreen
            alivePlayers={alivePlayers}
            allPlayers={players}
            roundNumber={roundNumber}
            onConfirmElimination={handleConfirmElimination}
          />
        )}

        {phase === 'VOTE_RESULT' && (
          <VoteResultScreen
            votedPlayer={lastVotedPlayer}
            wolfWon={winner === 'WOLF'}
            citizensWon={winner === 'CITIZENS'}
            roundNumber={roundNumber}
            onProceedToNextNight={handleProceedToNextNight}
            onProceedToGameOver={handleProceedToGameOver}
          />
        )}

        {phase === 'GAME_OVER' && winner && (
          <GameOverScreen
            winner={winner}
            players={players}
            roundsPlayed={roundNumber}
            onPlayAgainSame={handlePlayAgainSame}
            onResetToSetup={handleResetToSetup}
          />
        )}
      </main>

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-5 text-right shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">هل تود إنهاء اللعبة الحالية؟</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              سيتم إعادة تعيين جميع الأدوار والعودة إلى شاشة إدخال أسماء اللاعبين.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetToSetup}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                نعم، إنهاء اللعبة
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="py-2.5 border-t border-slate-900 text-center text-[11px] text-slate-600">
        لعبة الذئب والمواطنين • تمرير الهاتف بين الأصدقاء
      </footer>
    </div>
  );
}
