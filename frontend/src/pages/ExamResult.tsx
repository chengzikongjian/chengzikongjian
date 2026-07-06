import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { CheckCircle, XCircle, Award, ArrowLeft, Download } from 'lucide-react';

interface Question { id: number; content: string; type: string; options: Record<string, string>; answer: string; analysis: string; selectedAnswer?: string; isCorrect?: boolean; imageUrl?: string | null; chapter?: { name: string }; }

export default function ExamResult() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [exam, setExam] = useState<any>(null);
 const [questions, setQuestions] = useState<Question[]>([]);

 useEffect(() => {
 api.get(`/exams/${id}`).then((r) => { setExam(r.data.exam); setQuestions(r.data.questions); }).catch(() => navigate('/'));
 }, [id, navigate]);

 if (!exam) return <div className="text-center py-12 text-gray-500">加载中...</div>;

 const score = exam.score || 0;
 const passed = score >= 60;
 const correctCount = questions.filter((q) => q.isCorrect).length;

 return (
 <div className="max-w-2xl mx-auto">
 <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ArrowLeft size={16} />返回首页</button>

 {/* Score Card */}
 <div className={`rounded-xl p-6 text-center mb-6 ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-orange-600'} text-white`}>
 <Award size={48} className="mx-auto mb-2" />
 <h2 className="text-2xl font-bold">{passed ? '恭喜通过！' : '未通过'}</h2>
 <div className="text-5xl font-bold my-3">{score}</div>
 <p className="text-white/80">满分 100 分 | 及格线 60 分</p>
 <div className="flex justify-center gap-6 mt-4">
 <div><div className="text-2xl font-bold">{correctCount}</div><div className="text-xs text-white/80">正确</div></div>
 <div><div className="text-2xl font-bold">{questions.length - correctCount}</div><div className="text-xs text-white/80">错误</div></div>
 <div><div className="text-2xl font-bold">{questions.filter((q) => q.type === 'single').length > 0 ? questions.filter((q) => q.type === 'single' && q.isCorrect).length : '-'}</div><div className="text-xs text-white/80">单选得分</div></div>
 <div><div className="text-2xl font-bold">{questions.filter((q) => q.type === 'multi').length > 0 ? questions.filter((q) => q.type === 'multi' && q.isCorrect).length * 2 : '-'}</div><div className="text-xs text-white/80">多选得分</div></div>
 </div>
 </div>

 {/* Answer Review */}
 <h3 className="font-bold mb-3">答题详情</h3>
 <div className="space-y-3">
 {questions.map((q, i) => {
 const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
 const isCorrect = q.isCorrect || q.selectedAnswer === q.answer;
 return (
 <div key={q.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
 <div className="flex items-start gap-2">
 <span className="mt-0.5">{isCorrect ? <CheckCircle size={18} className="text-green-500 shrink-0" /> : <XCircle size={18} className="text-red-500 shrink-0" />}</span>
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 ">{i + 1}</span>
 <span className="text-xs text-gray-500">{q.type === 'single' ? '单选' : q.type === 'multi' ? '多选' : '判断'}</span>
 </div>
 <p className="text-sm">{q.content}</p>
 {q.imageUrl && (
 <img src={`${import.meta.env.BASE_URL}${q.imageUrl.replace(/^\//, '')}`} alt="题目配图" className="w-full max-h-64 object-contain rounded-lg border border-gray-100 bg-gray-50 mt-2" loading="lazy" />
)}
 <div className="mt-2 text-xs space-y-0.5">
 <p>你的答案：<span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{q.selectedAnswer || '未作答'}</span></p>
 {!isCorrect && <p>正确答案：<span className="text-green-600">{q.answer}</span></p>}
 {q.analysis && <p className="text-gray-500 mt-1">{q.analysis}</p>}
 </div>
 </div>
 </div>
 </div>
);
 })}
 </div>
 </div>
);
}
