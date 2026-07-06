import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { ChevronLeft, Clock, Award } from 'lucide-react';

interface ExamRecord { id: number; certType: string; status: string; score: number | null; totalTime: number | null; startedAt: string; }

export default function History() {
 const navigate = useNavigate();
 const [exams, setExams] = useState<ExamRecord[]>([]);

 useEffect(() => { api.get('/exams').then((r) => setExams(r.data.filter((e: any) => e.status !== 'in_progress'))).catch(() => {}); }, []);

 return (
 <div>
 <button onClick={() => navigate('/profile')} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ChevronLeft size={16} />返回</button>
 <h2 className="text-lg font-bold mb-4">学习记录</h2>
 {exams.length === 0 ? (
 <div className="text-center py-12 text-gray-500"><Clock size={40} className="mx-auto mb-2 opacity-50" /><p>暂无考试记录</p></div>
) : (
 <div className="space-y-2">
 {exams.map((exam) => (
 <Link key={exam.id} to={`/exam/${exam.id}/result`}
 className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md">
 <div className="flex items-center justify-between">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="text-sm font-medium">{exam.certType} 模拟考试</span>
 <span className={`text-xs px-1.5 py-0.5 rounded ${(exam.score || 0) >= 60 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
 {(exam.score || 0) >= 60 ? '及格' : '不及格'}
 </span>
 </div>
 <div className="text-xs text-gray-500">
 得分：{exam.score ?? '-'} | {exam.totalTime ? `${Math.floor(exam.totalTime / 60)}分` : '-'}
 </div>
 <div className="text-xs text-gray-400 mt-0.5">{new Date(exam.startedAt).toLocaleString('zh-CN')}</div>
 </div>
 <Award size={24} className={(exam.score || 0) >= 60 ? 'text-green-500' : 'text-gray-400'} />
 </div>
 </Link>
))}
 </div>
)}
 </div>
);
}
