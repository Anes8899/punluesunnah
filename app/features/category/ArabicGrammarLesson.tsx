"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen, Check, Star, X } from "lucide-react";

type LessonStatus = "done" | "active" | "open";

interface LessonDef {
  title: string;
  subtitle: string;
  status: LessonStatus;
}

interface QuestionOption {
  ar: string;
  tr: string;
}

interface QuestionDef {
  prompt: string;
  correct: number;
  options: QuestionOption[];
}

interface ExampleDef {
  english: string;
  plainAr: string;
  plainTr: string;
  definiteAr: string;
  definiteTr: string;
}

type View = "path" | "intro" | "explain" | "practice" | "complete";

const INITIAL_LESSONS: LessonDef[] = [
  { title: "Nouns & Gender", subtitle: "Masculine and feminine nouns", status: "done" },
  { title: 'The Definite Article "ال"', subtitle: 'Turning "a" into "the"', status: "active" },
  { title: "Personal Pronouns", subtitle: "أنا، أنتَ، هو — I, you, he", status: "open" },
  { title: "Simple Sentences", subtitle: "Building your first phrases", status: "open" },
  { title: "Adjectives & Agreement", subtitle: "Matching gender and number", status: "open" },
  { title: "Plural Basics", subtitle: "Sound and broken plurals", status: "open" },
];

const QUESTIONS: QuestionDef[] = [
  {
    prompt: 'How do you say "the book"?',
    correct: 0,
    options: [
      { ar: "الكتاب", tr: "al-kitāb" },
      { ar: "كتاب", tr: "kitāb" },
      { ar: "البيت", tr: "al-bayt" },
      { ar: "القلم", tr: "al-qalam" },
    ],
  },
  {
    prompt: 'Which word means "the pen"?',
    correct: 1,
    options: [
      { ar: "قلم", tr: "qalam" },
      { ar: "القلم", tr: "al-qalam" },
      { ar: "البيت", tr: "al-bayt" },
      { ar: "الكتاب", tr: "al-kitāb" },
    ],
  },
  {
    prompt: "What does البيت mean?",
    correct: 1,
    options: [
      { ar: "", tr: "a house" },
      { ar: "", tr: "the house" },
      { ar: "", tr: "the book" },
      { ar: "", tr: "the pen" },
    ],
  },
  {
    prompt: "Add ال to make بيت (house) definite:",
    correct: 0,
    options: [
      { ar: "البيت", tr: "al-bayt" },
      { ar: "بيتال", tr: "bayt-al" },
      { ar: "الابيت", tr: "ala-bayt" },
      { ar: "بيت لا", tr: "bayt la" },
    ],
  },
];

const EXAMPLES: ExampleDef[] = [
  { english: "book", plainAr: "كتاب", plainTr: "kitāb", definiteAr: "الكتاب", definiteTr: "al-kitāb" },
  { english: "house", plainAr: "بيت", plainTr: "bayt", definiteAr: "البيت", definiteTr: "al-bayt" },
  { english: "pen", plainAr: "قلم", plainTr: "qalam", definiteAr: "القلم", definiteTr: "al-qalam" },
];

const NODE_SIZE = 56;

export default function ArabicGrammarLesson() {
  const [view, setView] = useState<View>("path");
  const [lessons, setLessons] = useState<LessonDef[]>(INITIAL_LESSONS);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);

  const goPath = () => setView("path");
  const toExplain = () => setView("explain");
  const toPractice = () => {
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setView("practice");
  };

  const openLesson = (idx: number) => {
    setView(lessons[idx].status === "done" ? "explain" : "intro");
  };

  const selectOption = (i: number) => {
    if (selected !== null) return;
    const correct = i === QUESTIONS[qIndex].correct;
    setSelected(i);
    if (correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    const last = qIndex >= QUESTIONS.length - 1;
    if (last) {
      setLessons((prev) =>
        prev.map((l, i) => {
          if (i === 1) return { ...l, status: "done" };
          if (i === 2) return { ...l, status: "active" };
          return l;
        }),
      );
      setXp((x) => x + score * 10);
      setView("complete");
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const doneCount = lessons.filter((l) => l.status === "done").length;
  const progressPercent = Math.round((doneCount / lessons.length) * 100);
  const question = QUESTIONS[qIndex];
  const answered = selected !== null;
  const questionProgress = Math.round(((qIndex + (answered ? 1 : 0)) / QUESTIONS.length) * 100);
  const completeHeadline =
    score === QUESTIONS.length
      ? "Perfect! نجاح"
      : score >= QUESTIONS.length / 2
        ? "Nice work!"
        : "Good start — try again anytime";

  return (
    <div className="min-h-screen overflow-hidden rounded-lg bg-[#f5ead8] text-[#201e1d]">
      {/* Nav */}
      <nav className="flex items-center gap-4 border-b border-[#201e1d]/16 px-4 py-3 sm:px-6">
        <span className="mr-auto flex items-center gap-2 text-lg font-bold">
          <BookOpen size={22} strokeWidth={2.75} className="text-[#c67139]" />
          Marhaba
        </span>
        {view !== "path" && (
          <button
            type="button"
            onClick={goPath}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-[#c67139] hover:bg-[#c67139]/10"
          >
            <ArrowLeft size={16} strokeWidth={2.75} />
            Path
          </button>
        )}
        <span className="ml-3 inline-flex items-center rounded-full bg-[#f0fae1] px-3 py-1 text-xs text-[#3d472b]">
          {xp} XP
        </span>
      </nav>

      {/* PATH VIEW */}
      {view === "path" && (
        <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
          <h6 className="text-xs font-semibold tracking-[0.08em] text-[#8c491a] uppercase">
            Beginner · Modern Standard Arabic
          </h6>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your path to Arabic</h1>
          <p className="mt-2 max-w-[48ch] text-[#201e1d]/55">
            Short grammar lessons, one idea at a time. Jump into any lesson, in any order.
          </p>

          <div className="mt-4 mb-8 flex items-center gap-2.5">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#eee7db]">
              <div
                className="h-full rounded-full bg-[#7a8a5e] transition-[width]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs whitespace-nowrap text-[#201e1d]/55">
              {doneCount} / {lessons.length} done
            </span>
          </div>

          <div className="flex flex-col gap-0">
            {lessons.map((lesson, i) => {
              const isDone = lesson.status === "done";
              const isActive = lesson.status === "active";
              const isLast = i === lessons.length - 1;
              return (
                <div key={lesson.title} className="relative flex gap-3 pb-6">
                  <div className="flex flex-none flex-col items-center">
                    <button
                      type="button"
                      onClick={() => openLesson(i)}
                      style={{ width: NODE_SIZE, height: NODE_SIZE }}
                      className={`flex flex-none cursor-pointer items-center justify-center rounded-full shadow-[0_1px_2px_rgba(46,43,37,0.14)] ${
                        isDone
                          ? "bg-[#7a8a5e] text-[#f5ead8]"
                          : isActive
                            ? "animate-[pulse-ring_2.2s_ease-in-out_infinite] bg-[#c67139] text-[#f5ead8]"
                            : "border-[1.5px] border-[#ffc6a5] bg-[#ebddc5] text-[#8c491a]"
                      }`}
                    >
                      {isDone ? (
                        <Check size={22} strokeWidth={2.75} />
                      ) : (
                        <span className="text-lg font-bold">{i + 1}</span>
                      )}
                    </button>
                    {!isLast && (
                      <div
                        className={`mt-1 min-h-6 w-0.5 flex-1 ${isDone ? "bg-[#7a8a5e]" : "bg-[#201e1d]/16"}`}
                      />
                    )}
                  </div>
                  <div
                    className={`flex flex-1 cursor-pointer flex-col gap-2 rounded-[32px] bg-[#ebddc5] p-3.5 shadow-[0_1px_2px_rgba(46,43,37,0.14)] ${
                      isActive ? "border-[1.5px] border-[#c67139]" : ""
                    }`}
                  >
                    <span className="text-[10px] tracking-[0.1em] text-[#c67139] uppercase">
                      Lesson {i + 1}
                    </span>
                    <h4 className="-mt-1 text-lg font-bold">{lesson.title}</h4>
                    <p className="text-sm text-[#201e1d]/80">{lesson.subtitle}</p>
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => openLesson(i)}
                        className="w-fit self-start rounded-full bg-[#c67139] px-4 py-2 text-sm font-bold text-[#f5ead8] hover:bg-[#b2622d]"
                      >
                        Continue
                      </button>
                    )}
                    {isDone && (
                      <span className="w-fit self-start rounded-full bg-[#f0fae1] px-3 py-1 text-xs text-[#3d472b]">
                        Completed
                      </span>
                    )}
                    {!isDone && !isActive && (
                      <button
                        type="button"
                        onClick={() => openLesson(i)}
                        className="w-fit self-start rounded-full border border-[#201e1d]/16 px-4 py-2 text-sm font-bold hover:bg-[#201e1d]/7"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* INTRO VIEW */}
      {view === "intro" && (
        <main className="mx-auto flex w-full max-w-xl flex-col items-start gap-4 px-4 py-8 sm:px-6">
          <span className="inline-flex items-center rounded-full bg-[#fff2eb] px-3 py-1 text-xs text-[#8c491a]">
            Grammar · Lesson 2
          </span>
          <h1 className="text-4xl font-bold" dir="rtl">
            <span className="font-arabic">الـ</span>{" "}
            <span className="text-[0.55em]" dir="ltr">
              — The Definite Article
            </span>
          </h1>
          <p className="text-[#201e1d]/55">
            In Arabic, you make a noun definite — &quot;the book&quot; instead of &quot;a book&quot; — by
            attaching <b className="font-arabic not-italic">ال</b> (al-) directly to the front of it. No
            separate word, just a prefix.
          </p>
          <div className="flex w-full flex-col gap-2 rounded-[32px] bg-[#ebddc5] p-3.5 shadow-[0_1px_2px_rgba(46,43,37,0.14)]">
            <span className="text-[10px] tracking-[0.1em] text-[#c67139] uppercase">You&apos;ll learn to</span>
            <div className="flex flex-col gap-2 text-sm">
              <span>· Attach ال to a noun to mean &quot;the&quot;</span>
              <span>· Recognize definite nouns in Arabic script</span>
              <span>· Read them with transliteration support</span>
            </div>
          </div>
          <button
            type="button"
            onClick={toExplain}
            className="mt-2 w-full rounded-full bg-[#c67139] py-2.5 text-sm font-bold text-[#f5ead8] hover:bg-[#b2622d]"
          >
            Begin lesson
          </button>
        </main>
      )}

      {/* EXPLAIN VIEW */}
      {view === "explain" && (
        <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-8 sm:px-6">
          <h2 className="text-2xl font-bold">ال makes it &quot;the&quot;</h2>
          <p>
            Add <b className="font-arabic font-bold text-[#8c491a]">ال</b> to the start of any noun to turn
            &quot;a ___&quot; into &quot;the ___&quot;. The rest of the word doesn&apos;t change.
          </p>

          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <div
                key={ex.english}
                className="flex flex-row items-center justify-between gap-3 rounded-[32px] bg-[#ebddc5] p-3.5 shadow-[0_1px_2px_rgba(46,43,37,0.14)]"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-[#201e1d]/55">{ex.english}</span>
                  <span className="text-[13px] text-[#8c491a]">
                    {ex.plainTr} → {ex.definiteTr}
                  </span>
                </div>
                <div className="font-arabic flex items-center gap-2.5 text-2xl" dir="rtl">
                  <span className="text-base text-[#201e1d]/55 opacity-55">{ex.plainAr}</span>
                  <span className="font-sans">←</span>
                  <span className="text-[#8c491a]">{ex.definiteAr}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 rounded-[32px] bg-[#f0fae1] p-3.5 shadow-[0_1px_2px_rgba(46,43,37,0.14)]">
            <span className="text-[10px] tracking-[0.1em] text-[#3d472b] uppercase">Good to know</span>
            <p className="text-sm text-[#272e1b]">
              ال never changes form and is never written as a separate word — it&apos;s always fused to the
              noun that follows it.
            </p>
          </div>

          <button
            type="button"
            onClick={toPractice}
            className="mt-2 w-full rounded-full bg-[#c67139] py-2.5 text-sm font-bold text-[#f5ead8] hover:bg-[#b2622d]"
          >
            Practice this
          </button>
        </main>
      )}

      {/* PRACTICE VIEW */}
      {view === "practice" && (
        <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eee7db]">
              <div
                className="h-full rounded-full bg-[#c67139] transition-[width]"
                style={{ width: `${questionProgress}%` }}
              />
            </div>
            <span className="text-xs whitespace-nowrap text-[#201e1d]/55">
              {qIndex + 1} / {QUESTIONS.length}
            </span>
          </div>

          <h3 className="text-xl font-bold">{question.prompt}</h3>

          <div className="flex flex-col gap-2.5">
            {question.options.map((opt, i) => {
              const isCorrectReveal = answered && i === question.correct;
              const isWrongReveal = answered && i === selected && i !== question.correct;
              return (
                <button
                  key={opt.tr}
                  type="button"
                  onClick={() => selectOption(i)}
                  disabled={answered}
                  className={`flex flex-row items-center gap-3 rounded-[32px] bg-[#ebddc5] p-3.5 text-left shadow-[0_1px_2px_rgba(46,43,37,0.14)] ${
                    answered ? "cursor-default" : "cursor-pointer"
                  } ${
                    isCorrectReveal
                      ? "border-[1.5px] border-[#56633f] bg-[#f0fae1]"
                      : isWrongReveal
                        ? "border-[1.5px] border-[#8c491a] bg-[#fff2eb]"
                        : answered
                          ? "opacity-60"
                          : ""
                  }`}
                >
                  {opt.ar && (
                    <span className="font-arabic text-lg" dir="rtl">
                      {opt.ar}
                    </span>
                  )}
                  <span className="text-[13px] text-[#201e1d]/55">{opt.tr}</span>
                  {isCorrectReveal && (
                    <Check size={18} strokeWidth={2.75} className="ml-auto text-[#3d472b]" />
                  )}
                  {isWrongReveal && <X size={18} strokeWidth={2.75} className="ml-auto text-[#8c491a]" />}
                </button>
              );
            })}
          </div>

          {answered && (
            <button
              type="button"
              onClick={nextQuestion}
              className="w-full rounded-full bg-[#c67139] py-2.5 text-sm font-bold text-[#f5ead8] hover:bg-[#b2622d]"
            >
              {qIndex >= QUESTIONS.length - 1 ? "See results" : "Next question"}
            </button>
          )}
        </main>
      )}

      {/* COMPLETE VIEW */}
      {view === "complete" && (
        <main className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 px-4 py-8 text-center sm:px-6">
          <div className="flex size-[88px] items-center justify-center rounded-full bg-[#f0fae1]">
            <Star size={42} strokeWidth={2.75} className="text-[#56633f]" />
          </div>
          <h2 className="text-2xl font-bold">{completeHeadline}</h2>
          <p className="text-[#201e1d]/55">
            You scored {score} out of {QUESTIONS.length} on ال — the definite article.
          </p>
          <div className="flex gap-2.5">
            <span className="inline-flex items-center rounded-full bg-[#f0fae1] px-3 py-1 text-xs text-[#3d472b]">
              +{score * 10} XP
            </span>
            <span className="inline-flex items-center rounded-full bg-[#fff2eb] px-3 py-1 text-xs text-[#8c491a]">
              Lesson 2 complete
            </span>
          </div>
          <div className="mt-2 flex gap-2.5">
            <button
              type="button"
              onClick={toPractice}
              className="rounded-full border border-[#201e1d]/16 px-4 py-2 text-sm font-bold hover:bg-[#201e1d]/7"
            >
              Practice again
            </button>
            <button
              type="button"
              onClick={goPath}
              className="rounded-full bg-[#c67139] px-4 py-2 text-sm font-bold text-[#f5ead8] hover:bg-[#b2622d]"
            >
              Back to path
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
