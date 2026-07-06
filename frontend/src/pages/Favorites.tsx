import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Star, ChevronRight } from 'lucide-react';

interface Question { id: number; content: string; type: string; answer: string; chapter?: { name: string }; }

export default function Favorites() {
 const [questions, setQuestions] = useState<Question[]>([]);
 useEffect(() => { api.get('/favorites').then((r) => setQuestions(r.data)).catch(() => {}); }, []);

 return (
 <div>
 <h2 className="text-lg font-bold mb-4">收藏题目</h2>
 {questions.length === 0 ? (
 <div className="text-center py-12 text-gray-500"><Star size={40} className="mx-auto mb-2 opacity-50" /><p>暂无收藏题目</p></div>
) : (
 <div className="space-y-2">
 {questions.map((q) => (
 <div key={q.id} className="bg-white rounded-xl p-4 shadow-sm">
 <div className="flex items-center gap-2 mb-1">
 <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">收藏</span>
 <span className="text-xs text-gray-400">{q.type === 'single' ? '单选题' : q.type === 'multi' ? '多选题' : '判断题'}</span>
 </div>
 <p className="text-sm">{q.content}</p>
 <p className="text-xs text-gray-500 mt-1">答案：{q.answer}</p>
 </div>
))}
 </div>
)}
 </div>
);
}
