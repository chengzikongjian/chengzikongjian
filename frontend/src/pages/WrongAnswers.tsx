import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Trash2, AlertTriangle, ChevronRight } from 'lucide-react';

interface Question { id: number; content: string; type: string; options: Record<string, string>; answer: string; wrongCount: number; chapter?: { name: string }; }

export default function WrongAnswers() {
 const [questions, setQuestions] = useState<Question[]>([]);

 const load = () => api.get('/wrong-answers').then((r) => setQuestions(r.data)).catch(() => {});
 useEffect(() => { load(); }, []);

 const clearAll = async () => { if (window.confirm('确定清空所有错题？')) { await api.delete('/wrong-answers'); load(); } };

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
 <div className="space-y-2">
 {questions.map((q) => {
 const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
 return (
 <Link key={q.id} to={`/practice/${q.chapter?.name ? 'all' : 'all'}`} state={{ focusQuestion: q.id }}
 className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600">{q.wrongCount}次错</span>
 <span className="text-xs text-gray-400">{q.type === 'single' ? '单选题' : q.type === 'multi' ? '多选题' : '判断题'}</span>
 {q.chapter && <span className="text-xs text-gray-400">{q.chapter.name}</span>}
 </div>
 <p className="text-sm">{q.content}</p>
 <p className="text-xs text-green-600 mt-1">正确答案：{q.answer}</p>
 </div>
 <ChevronRight size={16} className="text-gray-400 shrink-0 mt-1" />
 </div>
 </Link>
);
 })}
 </div>
)}
 </div>
);
}
