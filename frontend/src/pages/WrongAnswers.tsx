import { useEffect, useState } from 'react';
import api from '../api/client';
import { Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Question {
 id: number; content: string; type: string; options: Record<string, string>;
 answer: string; analysis?: string | null; wrongCount: number;
 imageUrl?: string | null; chapter?: { name: string };
}

export default function WrongAnswers() {
 const [questions, setQuestions] = useState<Question[]>([]);
 const [selected, setSelected] = useState<Record<number, string>>({});
 const [judged, setJudged] = useState<Record<number, boolean>>({});
 const [correct, setCorrect] = useState<Record<number, boolean>>({});

 const load = () => api.get('/wrong-answers').then((r) => setQuestions(r.data)).catch(() => {});
 useEffect(() => { load(); }, []);

 const clearAll = async () => { if (window.confirm('确定清空所有错题？')) { await api.delete('/wrong-answers'); setQuestions([]); setSelected({}); setJudged({}); setCorrect({}); } };

 const choose = (q: Question, opt: string) => {
  if (judged[q.id]) return;
  if (q.type === 'multi') {
   const arr = (selected[q.id] || '').split('').filter(Boolean);
   const next = arr.includes(opt) ? arr.filter((o) => o !== opt).sort().join('') : [...arr, opt].sort().join('');
   setSelected((prev) => ({ ...prev, [q.id]: next }));
  } else {
   const next = opt;
   setSelected((prev) => ({ ...prev, [q.id]: next }));
   judge(q, next);
  }
 };

 const judge = async (q: Question, answer = selected[q.id]) => {
  if (!answer || judged[q.id]) return;
  const isCorrect = answer === q.answer;
  setJudged((prev) => ({ ...prev, [q.id]: true }));
  setCorrect((prev) => ({ ...prev, [q.id]: isCorrect }));
  if (isCorrect) {
   await api.delete(`/wrong-answers/${q.id}`).catch(() => {});
   setTimeout(() => {
    setQuestions((prev) => prev.filter((item) => item.id !== q.id));
    setSelected((prev) => { const next = { ...prev }; delete next[q.id]; return next; });
    setJudged((prev) => { const next = { ...prev }; delete next[q.id]; return next; });
    setCorrect((prev) => { const next = { ...prev }; delete next[q.id]; return next; });
   }, 700);
  }
 };

 return (
 <div>
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold">错题本</h2>
 {questions.length > 0 && <button onClick={clearAll} className="text-sm text-red-500 flex items-center gap-1"><Trash2 size={14} />清空</button>}
 </div>
 {questions.length === 0 ? (
 <div className="text-center py-12 text-gray-500">
 <AlertTriangle size={40} className="mx-auto mb-2 opacity-50" />
 <p>暂无错题，继续加油！</p>
 </div>
) : (
 <div className="space-y-3">
 {questions.map((q) => {
 const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
 const isMulti = q.type === 'multi';
 const current = selected[q.id] || '';
 const done = judged[q.id];
 const isRight = correct[q.id];
 return (
 <div key={q.id} className="bg-white rounded-xl p-4 shadow-sm">
 <div className="flex items-center gap-2 mb-2">
 <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600">{q.wrongCount}次错</span>
 <span className="text-xs text-gray-400">{q.type === 'single' ? '单选题' : q.type === 'multi' ? '多选题' : '判断题'}</span>
 {q.chapter && <span className="text-xs text-gray-400">{q.chapter.name}</span>}
 </div>
 <p className="text-sm font-medium leading-relaxed">{q.content}</p>
 {q.imageUrl && (
 <img src={`${import.meta.env.BASE_URL}${q.imageUrl.replace(/^\//, '')}`} alt="题目配图" className="w-full max-h-56 object-contain rounded-lg border border-gray-100 bg-gray-50 mt-2" loading="lazy" />
)}
 <div className="mt-3 space-y-2">
 {Object.entries(opts).map(([key, val]) => {
 const chosen = isMulti ? current.includes(key) : current === key;
 const rightKey = done && q.answer.includes(key);
 const wrongChosen = done && chosen && !q.answer.includes(key);
 return (
 <button key={key} onClick={() => choose(q, key)} disabled={done && !isMulti}
 className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 transition-colors ${rightKey ? 'border-emerald-400 bg-emerald-50' : wrongChosen ? 'border-red-300 bg-red-50' : chosen ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
 <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium shrink-0 ${rightKey ? 'bg-emerald-500 text-white border-emerald-500' : wrongChosen ? 'bg-red-400 text-white border-red-400' : chosen ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500'}`}>{key}</span>
 <span className="text-sm leading-snug">{val}</span>
 </button>
);
 })}
 </div>
 {isMulti && !done && (
 <button onClick={() => judge(q)} disabled={!current} className="mt-3 w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-40">确认提交多选题答案</button>
)}
 {done && (
 <div className={`mt-3 rounded-lg p-3 border ${isRight ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
 <div className="flex items-center gap-2 text-sm font-medium">
 {isRight ? <CheckCircle size={18} className="text-emerald-600" /> : <XCircle size={18} className="text-red-500" />}
 <span className={isRight ? 'text-emerald-700' : 'text-red-700'}>{isRight ? '回答正确，已移出错题本' : '回答错误，请重点复习'}</span>
 {!isRight && <span className="ml-auto text-xs text-gray-600">正确答案：<b className="text-emerald-600">{q.answer}</b></span>}
 </div>
 <div className="text-sm text-gray-600 leading-relaxed mt-2 bg-white/60 rounded-md p-2">
 <span className="font-medium text-gray-700">解析：</span>{q.analysis || '暂无解析，请结合题干、选项及相关安全规范复习。'}
 </div>
 </div>
)}
 </div>
);
 })}
 </div>
)}
 </div>
);
}
