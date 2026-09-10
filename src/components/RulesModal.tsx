import { X, Moon, Sun, Shield, Skull, Gavel, Award, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal = ({ isOpen, onClose }: RulesModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <HelpCircleIcon />
                </div>
                <h3 className="text-xl font-bold text-white">قواعد اللعبة وطريقة اللعب</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              {/* Step 1 */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">١. البداية وتوزيع الأدوار</h4>
                  <p>
                    أدخل أسماء اللاعبين (٣ لاعبين على الأقل). يقوم النظام بتوزيع الأدوار سراً وبشكل عشوائي:
                    <span className="text-red-400 font-semibold"> ذئب واحد</span>،
                    <span className="text-emerald-400 font-semibold"> طبيب واحد</span>،
                    والباقي <span className="text-amber-400 font-semibold">مواطنون صالحون</span>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">٢. مرحلة الليل (تمرير الهاتف)</h4>
                  <p>
                    يمر الهاتف بالترتيب لكل لاعب بمفرده سراً:
                  </p>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-xs text-slate-300">
                    <li><strong className="text-red-400">الذئب 🐺:</strong> يرى دوره ويختار ضحية واحدة من أهل القرية لقتلها.</li>
                    <li><strong className="text-emerald-400">الطبيب 🩺:</strong> يرى دوره ويختار شخصاً لحمايته وإنقاذه (يمكنه إنقاذ نفسه).</li>
                    <li><strong className="text-amber-400">المواطن 🧑‍🌾:</strong> يرى دوره وينام بسلام دون إجراء ليلي.</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">٣. مرحلة الصباح</h4>
                  <p>
                    يجتمع كل اللاعبين معاً. يكشف التطبيق أحداث الليلة:
                    إذا اختار الذئب شخصاً وأنقذه الطبيب، فلن يموت أحد! وإلا فإن الضحية تُقتل وتُقصى من اللعبة.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                  <Gavel className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">٤. النقاش والتصويت</h4>
                  <p>
                    يتناقش اللاعبون لمحاولة معرفة من هو الذئب الشرير، ثم يتم التصويت علناً أو عبر الهاتف ضد المشتبه به.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">٥. نهاية اللعبة والفوز</h4>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                    <li><strong className="text-emerald-400">فوز المواطنين:</strong> إذا صوّتت القرية ضد الذئب ومات، تنتهي اللعبة فوراً بفوز أهل القرية!</li>
                    <li><strong className="text-red-400">فوز الذئب:</strong> إذا لم يمُت الذئب تتواصل اللعبة ليلة بعد ليلة حتى يصوتوا ضده، أو حتى يقضي الذئب على أغلبية القرية!</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition shadow-lg shadow-rose-950/40 cursor-pointer"
            >
              فهمت القواعد، فلنبدأ!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

function HelpCircleIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" />
    </svg>
  );
}
