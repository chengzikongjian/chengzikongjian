import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Filter } from 'lucide-react';

interface Question { id: number; content: string; type: string; options: Record<string, string>; answer: string; analysis: string; imageUrl?: string | null; }

export default function SpecialPractice() {
 const navigate = useNavigate();
 const [type, setType] = useState('single');
 const [questions, setQuestions] = useState<Question[]>([]);
 const [currentIdx, setCurrentIdx] = useState(0);
 const [selected, setSelected] = useState<string | null>(null);
 const [judged, setJudged] = useState(false);
 const [isCorrect, setIsCorrect] = useState(false);
 const [loading, setLoading] = useState(false);

 useEffect(() => { setQuestions([]); setCurrentIdx(0); setSelected(null); setJudged(false); setIsCorrect(false); }, [type]);

 useEffect(() => {
 setLoading(true);
 api.get(`/questions?type=${type}&page_size=100`).then((r) => setQuestions(r.data)).catch(() => {}).finally(() => setLoading(false));
 }, [type]);

 const q = questions[currentIdx];
 const isMulti = q?.type === 'multi';
 const options = q ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : {};

 const handleSelect = async (opt: string) => {
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
 };

 const submitMulti = async () => {
 if (!selected || !q || judged) return;
 setJudged(true);
 const correct = selected === q.answer;
 setIsCorrect(correct);
 try { await api.post('/answers', { question_id: q.id, selected_answer: selected, mode: 'practice' }); } catch {}
 };

 const goNext = () => { if (currentIdx < questions.length - 1) { setCurrentIdx(currentIdx + 1); setSelected(null); setJudged(false); setIsCorrect(false); } };
 const goPrev = () => { if (currentIdx > 0) { setCurrentIdx(currentIdx - 1); setSelected(null); setJudged(false); setIsCorrect(false); } };

 return (
 <div className="max-w-2xl mx-auto">
 <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"><ChevronLeft size={16} />返回</button>
 <h2 className="text-lg font-bold mb-4">专项刷题</h2>
 <div className="flex gap-2 mb-5">
 {[
 { value: 'single', label: '单选题' },
 { value: 'multi', label: '多选题' },
 { value: 'judge', label: '判断题' },
 ].map((t) => (
 <button key={t.value} onClick={() => setType(t.value)}
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${type === t.value ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 hover:bg-gray-50 :bg-slate-700'}`}>{t.label}</button>
))}
 </div>

 {loading ? (
 <div className="text-center py-16 text-gray-400">加载中...</div>
) : !q ? (
 <div className="text-center py-16 text-gray-400">暂无该类题型题目</div>
) : (
 <>
 <div className="flex items-center justify-between mb-3">
 <span className="text-sm text-gray-400 tabular-nums">{currentIdx + 1} / {questions.length}</span>
 </div>

 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-7 mb-4">
 <p className="text-base md:text-lg font-medium leading-relaxed mb-5 text-gray-900 ">{q.content}</p>
 {q.imageUrl && (
 <img src={`${import.meta.env.BASE_URL}${q.imageUrl.replace(/^\//, '')}`} alt="题目配图" className="w-full max-h-80 object-contain rounded-lg border border-gray-100 bg-gray-50 mb-5" loading="lazy" />
)}
 <div className="space-y-2.5">
 {Object.entries(options).map(([key, val]) => {
 const chosen = isMulti ? selected?.includes(key) : selected === key;
 let cls = 'border-gray-200 hover:border-blue-300 :border-blue-500 hover:bg-gray-50 :bg-slate-700/50';
 if (judged) {
 if (key === q!.answer) cls = 'border-emerald-400 bg-emerald-50 /20 ';
 else if (chosen && key !== q!.answer) cls = 'border-red-300 bg-red-50 /20 ';
 else cls = 'border-gray-100 opacity-60';
 } else if (chosen) cls = 'border-blue-400 bg-blue-50 /30 ';
 return (
 <button key={key} onClick={() => handleSelect(key)} disabled={judged && !isMulti}
 className={`w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${cls} ${judged ? 'cursor-default' : 'cursor-pointer'}`}>
 <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold shrink-0 ${
 judged && key === q!.answer ? 'bg-emerald-500 text-white border-emerald-500'
 : judged && chosen && key !== q!.answer ? 'bg-red-400 text-white border-red-400'
 : chosen ? 'bg-blue-500 text-white border-blue-500'
 : 'border-gray-300 text-gray-500 '
 }`}>{judged && key === q!.answer ? <CheckCircle size={16} /> : judged && chosen && key !== q!.answer ? <XCircle size={16} /> : key}</span>
 <span className="text-sm md:text-base leading-snug">{val}</span>
 </button>
);
 })}
 </div>
 {isMulti && !judged && <button onClick={submitMulti} disabled={!selected} className="mt-5 w-full py-3 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-40 hover:bg-blue-700 transition-colors text-sm">确认提交</button>}
 </div>

 {judged && (
 <div className={`rounded-2xl p-4 md:p-5 mb-4 border ${
 isCorrect ? 'bg-emerald-50 /15 border-emerald-200 '
 : 'bg-red-50 /15 border-red-200 '
 }`}>
 <div className="flex items-center gap-2 mb-2">
 {isCorrect ? <CheckCircle size={22} className="text-emerald-500" /> : <XCircle size={22} className="text-red-400" />}
 <span className={`font-semibold text-sm ${isCorrect ? 'text-emerald-700 ' : 'text-red-700 '}`}>
 {isCorrect ? '回答正确！' : '回答错误'}
 </span>
 {!isCorrect && <span className="text-xs ml-auto text-gray-500">正确答案：<span className="font-bold text-emerald-600">{q!.answer}</span></span>}
 </div>
 {q?.analysis && <div className="text-sm text-gray-600 leading-relaxed mt-1 bg-white/50 /50 rounded-xl p-3"><span className="font-medium">解析：</span>{q.analysis}</div>}
 </div>
)}

 <div className="flex justify-between gap-3 mt-2">
 <button onClick={goPrev} disabled={currentIdx === 0}
 className="flex items-center gap-1 px-5 py-2.5 rounded-xl border disabled:opacity-25 hover:bg-gray-50 :bg-slate-700 text-sm font-medium"><ChevronLeft size={16} />上一题</button>
 <button onClick={goNext} disabled={currentIdx >= questions.length - 1}
 className="flex items-center gap-1 px-5 py-2.5 rounded-xl border disabled:opacity-25 hover:bg-gray-50 :bg-slate-700 text-sm font-medium">下一题<ChevronRight size={16} /></button>
 </div>
 </>
)}
 </div>
);
}
