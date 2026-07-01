import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, RotateCcw, BookOpen, Trophy } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { QuizQuestion } from '../../types/workspace';

interface QuizModalProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

export default function QuizModal({ questions, onClose }: QuizModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // --- Escape key to close ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // --- Derived data ---
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const score = useMemo(
    () =>
      answers.reduce<number>(
        (acc, ans, i) => acc + (ans === questions[i].correctIndex ? 1 : 0),
        0
      ),
    [answers, questions]
  );

  const wrongIndices = useMemo(
    () =>
      answers
        .map((ans, i) => (ans !== questions[i].correctIndex ? i : -1))
        .filter((i) => i !== -1),
    [answers, questions]
  );

  // Questions to display in review mode vs normal mode
  const displayQuestions = reviewMode ? wrongIndices : null;
  const reviewTotal = wrongIndices.length;

  // --- Handlers ---
  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (hasAnswered) return;
      setSelectedAnswer(optionIndex);
      setHasAnswered(true);
      setAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = optionIndex;
        return next;
      });
    },
    [hasAnswered, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (reviewMode && displayQuestions) {
      const currentReviewPos = displayQuestions.indexOf(currentIndex);
      if (currentReviewPos < displayQuestions.length - 1) {
        const nextIdx = displayQuestions[currentReviewPos + 1];
        setCurrentIndex(nextIdx);
        setSelectedAnswer(answers[nextIdx]);
        setHasAnswered(true);
      } else {
        setShowResults(true);
        setReviewMode(false);
      }
      return;
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      setShowResults(true);
    }
  }, [currentIndex, totalQuestions, reviewMode, displayQuestions, answers]);

  const handleRetake = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setReviewMode(false);
  }, [questions.length]);

  const handleReviewWrong = useCallback(() => {
    if (wrongIndices.length === 0) return;
    setReviewMode(true);
    setShowResults(false);
    const firstWrong = wrongIndices[0];
    setCurrentIndex(firstWrong);
    setSelectedAnswer(answers[firstWrong]);
    setHasAnswered(true);
  }, [wrongIndices, answers]);

  // --- Helpers ---
  const getScoreEmoji = () => {
    const pct = (score / totalQuestions) * 100;
    if (pct >= 80) return '🎉';
    if (pct >= 60) return '👏';
    return '📚';
  };

  const getOptionClasses = (optionIndex: number) => {
    const base = `liquid-glass rounded-xl p-4 text-left transition-all duration-200 w-full`;
    const textColor = isDark ? 'text-white' : 'text-zinc-900';

    if (!hasAnswered) {
      const isHover = isDark
        ? 'hover:bg-white/10 hover:border-white/20'
        : 'hover:bg-black/5 hover:border-black/15';
      return `${base} ${textColor} cursor-pointer border border-transparent ${isHover}`;
    }

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const isSelected = optionIndex === selectedAnswer;

    if (isCorrect) {
      return `${base} ${textColor} bg-emerald-500/20 border border-emerald-500/50 ring-2 ring-emerald-500`;
    }

    if (isSelected && !isCorrect) {
      return `${base} ${textColor} bg-red-500/20 border border-red-500/50 ring-2 ring-red-500`;
    }

    return `${base} ${textColor} border border-transparent opacity-50 cursor-default`;
  };

  const isLastQuestion = reviewMode
    ? displayQuestions
      ? displayQuestions.indexOf(currentIndex) === displayQuestions.length - 1
      : true
    : currentIndex === totalQuestions - 1;

  // --- Review mode progress ---
  const reviewProgress = reviewMode && displayQuestions
    ? ((displayQuestions.indexOf(currentIndex) + 1) / reviewTotal) * 100
    : progress;

  const reviewQuestionNumber = reviewMode && displayQuestions
    ? displayQuestions.indexOf(currentIndex) + 1
    : currentIndex + 1;

  const reviewQuestionTotal = reviewMode ? reviewTotal : totalQuestions;

  // --- Animation variants ---
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const contentVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="liquid-glass rounded-3xl p-8 w-full max-w-2xl pointer-events-auto relative shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-10 rounded-full p-1.5 transition-colors ${
              isDark
                ? 'text-white/50 hover:text-white hover:bg-white/10'
                : 'text-zinc-400 hover:text-zinc-900 hover:bg-black/5'
            }`}
          >
            <X size={20} />
          </button>

          <AnimatePresence mode="wait">
            {showResults ? (
              /* ============ RESULTS SCREEN ============ */
              <motion.div
                key="results"
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center text-center py-4"
              >
                {/* Score Emoji */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                  className="text-6xl mb-4"
                >
                  {getScoreEmoji()}
                </motion.div>

                {/* Trophy Icon */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`liquid-glass rounded-full p-4 mb-6 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                >
                  <Trophy size={32} />
                </motion.div>

                {/* Score */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-3xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {Math.round((score / totalQuestions) * 100)}%
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className={`text-lg mb-8 ${
                    isDark ? 'text-white/60' : 'text-zinc-500'
                  }`}
                >
                  {score} / {totalQuestions}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
                >
                  {wrongIndices.length > 0 && (
                    <button
                      onClick={handleReviewWrong}
                      className={`flex-1 flex items-center justify-center gap-2 liquid-glass rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${
                        isDark
                          ? 'text-amber-300 hover:bg-amber-500/10 border border-amber-500/30'
                          : 'text-amber-600 hover:bg-amber-50 border border-amber-300'
                      }`}
                    >
                      <BookOpen size={16} />
                      Review Wrong Answers
                    </button>
                  )}

                  <button
                    onClick={handleRetake}
                    className={`flex-1 flex items-center justify-center gap-2 liquid-glass rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${
                      isDark
                        ? 'text-white hover:bg-white/10 border border-white/15'
                        : 'text-zinc-700 hover:bg-black/5 border border-zinc-200'
                    }`}
                  >
                    <RotateCcw size={16} />
                    Retake Quiz
                  </button>

                  <button
                    onClick={onClose}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              /* ============ QUESTION SCREEN ============ */
              <motion.div
                key={`question-${currentIndex}`}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                {/* Header: Question number + Review badge */}
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      isDark ? 'text-white/40' : 'text-zinc-400'
                    }`}
                  >
                    {reviewMode ? 'Review — ' : ''}Question {reviewQuestionNumber} of{' '}
                    {reviewQuestionTotal}
                  </span>
                  {reviewMode && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      Review
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div
                  className={`w-full h-1.5 rounded-full mb-6 overflow-hidden ${
                    isDark ? 'bg-white/10' : 'bg-zinc-200'
                  }`}
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${reviewProgress}%` }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>

                {/* Question text */}
                <h3
                  className={`text-lg font-semibold leading-relaxed mb-6 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="flex flex-col gap-3 mb-6">
                  {currentQuestion.options.map((option, i) => (
                    <motion.button
                      key={i}
                      whileHover={!hasAnswered ? { scale: 1.01 } : {}}
                      whileTap={!hasAnswered ? { scale: 0.99 } : {}}
                      onClick={() => handleSelect(i)}
                      disabled={hasAnswered}
                      className={getOptionClasses(i)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Option letter badge */}
                        <span
                          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            hasAnswered && i === currentQuestion.correctIndex
                              ? 'bg-emerald-500 text-white'
                              : hasAnswered && i === selectedAnswer && i !== currentQuestion.correctIndex
                                ? 'bg-red-500 text-white'
                                : isDark
                                  ? 'bg-white/10 text-white/70'
                                  : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="pt-0.5 text-sm leading-relaxed">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Explanation + Page Ref (shown after answering) */}
                <AnimatePresence>
                  {hasAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`rounded-xl p-4 mb-6 border ${
                          isDark
                            ? 'bg-white/5 border-white/10'
                            : 'bg-zinc-50 border-zinc-200'
                        }`}
                      >
                        <p
                          className={`text-sm leading-relaxed ${
                            isDark ? 'text-white/70' : 'text-zinc-600'
                          }`}
                        >
                          {currentQuestion.explanation}
                        </p>
                        {currentQuestion.pageRef > 0 && (
                          <span
                            className={`inline-block mt-3 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              isDark
                                ? 'bg-white/10 text-white/50'
                                : 'bg-zinc-200 text-zinc-500'
                            }`}
                          >
                            📄 Page {currentQuestion.pageRef}
                          </span>
                        )}
                      </div>

                      {/* Next / See Results button */}
                      <div className="flex justify-end">
                        <motion.button
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          onClick={handleNext}
                          className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                            isDark
                              ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                        >
                          {isLastQuestion ? 'See Results' : 'Next'}
                          <ChevronRight size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
