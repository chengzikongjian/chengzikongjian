import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Clock, AlertTriangle } from 'lucide-react';

interface Question {
 id: number; content: string; type: string; options: Record<string, string>;
 answer?: string; selectedAnswer?: string | null; imageUrl?: string | null;
}

export default function Exam() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [questions, setQuestions] = useState<Question[]>([]);
 const [currentIdx, setCurrentIdx] = useState(0);
 const [answers, setAnswers] = useState<Record<number, string>>({});
 const [timeLeft, setTimeLeft] = useState(120 * 60);
 const [submitting, setSubmitting] = useState(false);
 const timerRef = useRef<ReturnType<typeof setInterval>>();
 const lastSaveRef = useRef(Date.now());

 const saveAnswers = useCallback(async (submit = false) => {
 const ansList = Object.entries(answers).map(([qId, answer]) => ({ questionId: Number(qId), answer }));
 try {
 const elapsed = Math.floor((Date.now() - lastSaveRef.current) / 1000);
 await api.put(`/exams/${id}`, { answers: ansList, submit, total_time: elapsed, switch_count: 0 });
 if (submit) navigate(`/exam/${id}/result`);
 } catch (err: any) {
 if (submit) alert(err.response?.data?.error || '提交失败');
 }
 }, [id, answers, navigate]);

 useEffect(() => {
 api.get(`/exams/${id}`).then((r) => {
 setQuestions(r.data.questions);
 const saved: Record<number, string> = {};
 r.data.questions.forEach((q: any) => { if (q.selectedAnswer) saved[q.id] = q.selectedAnswer; });
 setAnswers(saved);
 if (r.data.exam.status !== 'in_progress') navigate(`/exam/${id}/result`);
 }).catch(() => navigate('/exam/new'));
 }, [id, navigate]);

 useEffect(() => {
 timerRef.current = setInterval(() => setTimeLeft((t) => {
 if (t <= 1) { clearInterval(timerRef.current); saveAnswers(true); return 0; }
 return t - 1;
 }), 1000);
 return () => clearInterval(timerRef.current);
 }, [saveAnswers]);

 // Auto-save every 30s
 useEffect(() => {
 const autoSave = setInterval(() => saveAnswers(), 30000);
 return () => clearInterval(autoSave);
 }, [saveAnswers]);

 // Track tab switch
 useEffect(() => {
 const handler = () => { if (document.hidden) { api.put(`/exams/${id}`, { switch_count: 1 }).catch(() => {}); } };
 document.addEventListener('visibilitychange', handler);
 return () => document.removeEventListener('visibilitychange', handler);
 }, [id]);

 const q = questions[currentIdx];
 const isMulti = q?.type === 'multi';
 const options = q ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : {};

 const toggleChoice = (opt: string) => {
 if (isMulti) {
 const current = answers[q.id] || '';
 const arr = current ? current.split('') : [];
 setAnswers((prev) => ({...prev, [q.id]: arr.includes(opt) ? arr.filter((o) => o !== opt).sort().join('') : [...arr, opt].sort().join('') }));
 } else setAnswers((prev) => ({...prev, [q.id]: opt }));
 };

 const formatTime = (s: number) => {
 const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
 return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
 };

 const answeredCount = Object.keys(answers).length;
 const isLowTime = timeLeft < 300;

 if (questions.length === 0) return <div className="text-center py-12 text-gray-500">加载考试中...</div>;

 return (
 <div className="max-w-4xl mx-auto">
 {/* Timer & Progress Bar */}
 <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-3 shadow-sm sticky top-14 md:top-16 z-40">
 <div className={`flex items-center gap-2 font-mono font-bold ${isLowTime ? 'text-red-500 animate-pulse' : 'text-gray-700 '}`}>
 <Clock size={18} />{formatTime(timeLeft)}
 </div>
 <div className="flex items-center gap-2 text-sm">
 <span className="text-gray-500">{answeredCount}/{questions.length} 已答</span>
 <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
 <div className="h-full bg-blue-600 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
 </div>
 </div>
 <button onClick={() => { if (window.confirm('确定交卷？')) { setSubmitting(true); saveAnswers(true); } }}
 disabled={submitting} className="px-4 py-1.5 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 disabled:opacity-50">
 交卷
 </button>
 </div>

 <div className="flex gap-4">
 {/* Questions Column */}
 <div className="flex-1">
 {/* Question Type Tag */}
 <div className="flex items-center gap-2 mb-3">
 <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 ">
 {q?.type === 'single' ? '单选题' : q?.type === 'multi' ? '多选题' : '判断题'}
 </span>
 <span className="text-xs text-gray-400">第 {currentIdx + 1} 题</span>
 </div>

 <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4">
 <p className="text-base font-medium mb-4">{q?.content}</p>
 {q?.imageUrl && (
 <img src={`${import.meta.env.BASE_URL}${q.imageUrl.replace(/^\//, '')}`} alt="题目配图" className="w-full max-h-80 object-contain rounded-lg border border-gray-100 bg-gray-50 mb-4" loading="lazy" />
)}
 <div className="space-y-2">
 {(Object.entries(options) as [string, string][]).map(([key, val]) => {
 const chosen = isMulti ? answers[q.id]?.includes(key) : answers[q.id] === key;
 return (
 <button key={key} onClick={() => toggleChoice(key)}
 className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center gap-3 ${chosen ? 'border-blue-500 bg-blue-50 /30' : 'border-gray-200 hover:border-blue-300'}`}>
 <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium shrink-0 ${chosen ? 'bg-blue-600 text-white border-blue-600' : ''}`}>{key}</span>
 <span className="text-sm">{val}</span>
 </button>
);
 })}
 </div>
 </div>

 <div className="flex gap-3 justify-between">
 <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}
 className="px-4 py-2 rounded-lg border disabled:opacity-30 text-sm">上一题</button>
 <button onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))} disabled={currentIdx >= questions.length - 1}
 className="px-4 py-2 rounded-lg border disabled:opacity-30 text-sm">下一题</button>
 </div>
 </div>

 {/* Answer Sheet */}
 <div className="hidden md:block w-48 shrink-0">
 <div className="bg-white rounded-xl shadow-sm p-3 sticky top-28">
 <h3 className="text-sm font-medium mb-2">答题卡</h3>
 <div className="grid grid-cols-5 gap-1.5">
 {questions.map((_, i) => {
 const isAnswered = !!answers[questions[i].id];
 const isCurrent = i === currentIdx;
 return (
 <button key={i} onClick={() => setCurrentIdx(i)}
 className={`w-7 h-7 rounded text-xs font-medium ${isCurrent ? 'ring-2 ring-blue-500' : ''} ${isAnswered ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
 {i + 1}
 </button>
);
 })}
 </div>
 <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
 <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> 已答
 <span className="w-3 h-3 rounded bg-gray-200 inline-block ml-2" /> 未答
 </div>
 </div>
 </div>
 </div>

 {/* Mobile answer sheet button */}
 <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t p-2 flex gap-1 justify-center flex-wrap z-40 shadow-lg">
 {questions.slice(0, 20).map((_, i) => (
 <button key={i} onClick={() => setCurrentIdx(i)} className={`w-7 h-7 rounded text-xs font-medium ${answers[questions[i]?.id] ? 'bg-blue-600 text-white' : 'bg-gray-100 '}`}>{i + 1}</button>
))}
 </div>
 </div>
);
}
