import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { ChevronLeft, ChevronRight, Star, CheckCircle, XCircle, BookOpen } from 'lucide-react';

interface Question {
 id: number; content: string; type: string; options: Record<string, string>;
 answer: string; analysis: string; imageUrl: string | null;
 chapter?: { name: string };
}

export default function Practice() {
 const { chapterId } = useParams();
 const navigate = useNavigate();
 const [questions, setQuestions] = useState<Question[]>([]);
 const [currentIdx, setCurrentIdx] = useState(0);
 const [selected, setSelected] = useState<string | null>(null);
 const [judged, setJudged] = useState(false);
 const [isCorrect, setIsCorrect] = useState(false);
 const [loading, setLoading] = useState(true);
 const [favorites, setFavorites] = useState<Set<number>>(new Set());
 const randomLoaded = useRef(false);

 useEffect(() => {
    // Check if random questions were already loaded (useRef to survive StrictMode double-invoke)
    if (randomLoaded.current) return;
    const randomQ = sessionStorage.getItem('randomQuestions');
    if (randomQ) {
      try {
        const parsed = JSON.parse(randomQ);
        if (parsed && parsed.length > 0) {
          console.log('Practice: loaded ' + parsed.length + ' random questions');
          setQuestions(parsed);
          setLoading(false);
          randomLoaded.current = true;
          sessionStorage.removeItem('randomQuestions');
          api.get('/favorites').then((r) => {
            if (r && r.data) setFavorites(new Set(r.data.map((q) => q.id)));
          }).catch(() => {});
          return;
        }
      } catch (e) { console.error('Parse randomQuestions error:', e); }
    }

 if (true) { console.log("Practice: no randomQ, fetching ch=" + chapterId);
 api.get(`/questions?chapter_id=${chapterId}&page_size=100`).then((r) => {
 console.log("Practice: r type=" + typeof r + " keys=" + Object.keys(r).join(","));
 console.log("Practice: r.data type=" + typeof r.data + " isArray=" + Array.isArray(r.data));
 setQuestions(r.data);
 setLoading(false);
 }).catch(() => setLoading(false)); }
 api.get('/favorites').then((r) => {
      if (r && r.data) setFavorites(new Set(r.data.map((q) => q.id)));
    }).catch(() => {});
 }, [chapterId]);

 const q = questions[currentIdx];
 const isMulti = q?.type === 'multi';
 const options: Record<string, string> = q ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : {};

 // Auto-judge on selection
 const handleSelect = useCallback(async (opt: string) => {
 if (judged) return;
 let ans: string;
 if (isMulti) {
 const arr = (selected || '').split('').filter(Boolean);
 ans = arr.includes(opt) ? arr.filter((o) => o !== opt).sort().join('') : [...arr, opt].sort().join('');
 } else {
 ans = opt;
 }
 setSelected(ans);
 if (!isMulti) {
 setJudged(true);
 const correct = ans === q!.answer;
 setIsCorrect(correct);
 try { await api.post('/answers', { question_id: q!.id, selected_answer: ans, mode: 'practice' }); } catch {}
 }
 }, [judged, isMulti, selected, q]);

 // Submit multi-choice
 const submitMulti = useCallback(async () => {
 if (!selected || !q || judged) return;
 setJudged(true);
 const correct = selected === q.answer;
 setIsCorrect(correct);
 try { await api.post('/answers', { question_id: q.id, selected_answer: selected, mode: 'practice' }); } catch {}
 }, [selected, q, judged]);

 const toggleFavorite = async () => {
 if (!q) return;
 try {
 if (favorites.has(q.id)) {
 await api.delete(`/favorites/${q.id}`);
 setFavorites((prev) => { const n = new Set(prev); n.delete(q.id); return n; });
 } else {
 await api.post('/favorites', { question_id: q.id });
 setFavorites((prev) => new Set(prev).add(q.id));
 }
 } catch {}
 };

 const goNext = () => {
 if (currentIdx < questions.length - 1) {
 setCurrentIdx(currentIdx + 1);
 setSelected(null); setJudged(false); setIsCorrect(false);
 }
 };
 const goPrev = () => {
 if (currentIdx > 0) {
 setCurrentIdx(currentIdx - 1);
 setSelected(null); setJudged(false); setIsCorrect(false);
 }
 };

 if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400"><div className="text-center"><BookOpen size={40} className="mx-auto mb-3 animate-pulse opacity-50" /><p>加载题目中...</p></div></div>;
 if (!q || questions.length === 0) return <div className="text-center py-16 text-gray-400"><p>该章节暂无题目</p></div>;

 return (
 <div className="max-w-2xl mx-auto">
 {/* Header bar */}
 <div className="flex items-center justify-between mb-4">
 <button onClick={() => navigate('/chapters')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"><ChevronLeft size={16} />返回</button>
 <div className="flex items-center gap-3">
 <span className="text-sm text-gray-400 tabular-nums">{currentIdx + 1} / {questions.length}</span>
 <button onClick={toggleFavorite} className="transition-transform hover:scale-110">
 <Star size={20} className={favorites.has(q.id) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 '} />
 </button>
 </div>
 </div>

 {/* Question card */}
 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-7 mb-4">
 {/* Tags */}
 <div className="flex flex-wrap items-center gap-2 mb-4">
 <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 /40 text-blue-600 ">
 {q.type === 'single' ? '单选题' : q.type === 'multi' ? '多选题' : '判断题'}
 </span>
 {q.chapter?.name && (
 <span className="text-xs text-gray-400 ">{q.chapter.name}</span>
)}
 </div>

 {/* Question text */}
 <p className="text-base md:text-lg font-medium leading-relaxed mb-5 text-gray-900 ">{q.content}</p>

 {/* Options */}
 <div className="space-y-2.5">
 {Object.entries(options).map(([key, val]) => {
 const chosen = isMulti ? selected?.includes(key) : selected === key;
 let borderColor = 'border-gray-200 hover:border-blue-300 :border-blue-500';
 let bgColor = 'hover:bg-gray-50 :bg-slate-700/50';
 let indicator = '';
 if (judged) {
 if (key === q!.answer) {
 borderColor = 'border-emerald-400 bg-emerald-50 /20 ';
 bgColor = '';
 indicator = 'correct';
 } else if (chosen && key !== q!.answer) {
 borderColor = 'border-red-300 bg-red-50 /20 ';
 bgColor = '';
 indicator = 'wrong';
 } else {
 borderColor = 'border-gray-100 opacity-60';
 }
 } else if (chosen) {
 borderColor = 'border-blue-400 bg-blue-50 /30 ';
 bgColor = '';
 }

 return (
 <button key={key} onClick={() => handleSelect(key)}
 disabled={judged && !isMulti}
 className={`w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 ${borderColor} ${bgColor} ${judged ? 'cursor-default' : 'cursor-pointer'}`}>
 <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
 judged && key === q!.answer
 ? 'bg-emerald-500 text-white border-emerald-500'
 : judged && chosen && key !== q!.answer
 ? 'bg-red-400 text-white border-red-400'
 : chosen
 ? 'bg-blue-500 text-white border-blue-500'
 : 'border-gray-300 text-gray-500 '
 }`}>
 {judged && key === q!.answer ? <CheckCircle size={16} /> : judged && chosen && key !== q!.answer ? <XCircle size={16} /> : key}
 </span>
 <span className="text-sm md:text-base leading-snug">{val}</span>
 </button>
);
 })}
 </div>

 {/* Submit button for multi-choice */}
 {isMulti && !judged && (
 <button onClick={submitMulti} disabled={!selected}
 className="mt-5 w-full py-3 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-40 hover:bg-blue-700 transition-colors text-sm">
 确认提交多选题答案
 </button>
)}

 {/* Multi-choice hint */}
 {isMulti && !judged && selected && (
 <p className="text-xs text-gray-400 text-center mt-2">已选 {selected.length} 个选项，点击确认提交</p>
)}
 </div>

 {/* Result feedback + Analysis */}
 {judged && (
 <div className={`rounded-2xl p-4 md:p-5 mb-4 border ${
 isCorrect
 ? 'bg-emerald-50 /15 border-emerald-200 '
 : 'bg-red-50 /15 border-red-200 '
 }`}>
 <div className="flex items-center gap-2 mb-2">
 {isCorrect
 ? <CheckCircle size={22} className="text-emerald-500" />
 : <XCircle size={22} className="text-red-400" />
 }
 <span className={`font-semibold text-sm ${isCorrect ? 'text-emerald-700 ' : 'text-red-700 '}`}>
 {isCorrect ? (isMulti ? '全对！+2分' : '回答正确！+1分') : '回答错误'}
 </span>
 {!isCorrect && q?.answer && (
 <span className="text-xs ml-auto text-gray-500 ">
 正确答案：<span className="font-mono font-bold text-emerald-600 ">{q.answer}</span>
 </span>
)}
 </div>
 {q?.analysis && (
 <div className="text-sm text-gray-600 leading-relaxed mt-1 bg-white/50 /50 rounded-xl p-3">
 <span className="font-medium text-gray-700 ">解析：</span>{q.analysis}
 </div>
)}
 </div>
)}

 {/* Navigation */}
 <div className="flex items-center justify-between gap-3 mt-2">
 <button onClick={goPrev} disabled={currentIdx === 0}
 className="flex items-center gap-1 px-5 py-2.5 rounded-xl border border-gray-200 disabled:opacity-25 hover:bg-gray-50 :bg-slate-700 transition-colors text-sm font-medium">
 <ChevronLeft size={16} />上一题
 </button>
 <div className="flex gap-1">
 {questions.slice(0, Math.min(questions.length, 10)).map((_, i) => (
 <button key={i} onClick={() => { setCurrentIdx(i); setSelected(null); setJudged(false); setIsCorrect(false); }}
 className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
 i === currentIdx
 ? 'bg-blue-600 text-white'
 : 'bg-gray-100 text-gray-500 hover:bg-gray-200 :bg-slate-600'
 }`}>{i + 1}</button>
))}
 {questions.length > 10 && <span className="text-xs text-gray-400 self-center ml-1">...</span>}
 </div>
 <button onClick={goNext} disabled={currentIdx >= questions.length - 1}
 className="flex items-center gap-1 px-5 py-2.5 rounded-xl border border-gray-200 disabled:opacity-25 hover:bg-gray-50 :bg-slate-700 transition-colors text-sm font-medium">
 下一题<ChevronRight size={16} />
 </button>
 </div>
 </div>
);
}
