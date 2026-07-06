import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { ClipboardList, ChevronLeft } from 'lucide-react';

export default function ExamNew() {
 const navigate = useNavigate();
 const [certType, setCertType] = useState('C3');
 const [loading, setLoading] = useState(false);

 const startExam = async () => {
 setLoading(true);
 try {
 const { data } = await api.post('/exams', { cert_type: certType });
 navigate(`/exam/${data.exam.id}`);
 } catch (err: any) {
 alert(err.response?.data?.error || '创建考试失败');
 }
 setLoading(false);
 };

 return (
 <div className="max-w-md mx-auto text-center">
 <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-blue-600 mb-6"><ChevronLeft size={16} />返回首页</button>
 <div className="bg-white rounded-xl shadow-sm p-6">
 <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"><ClipboardList size={28} className="text-orange-600" /></div>
 <h2 className="text-lg font-bold mb-2">模拟考试</h2>
 <p className="text-sm text-gray-500 mb-6">全真还原陕西安全员C证机考</p>

 <div className="bg-blue-50 /20 rounded-lg p-3 mb-6 text-left text-sm space-y-1">
 <p>题型：单选70题 + 多选20题 + 判断10题</p>
 <p>时长：120分钟</p>
 <p>满分：100分 | 及格：60分</p>
 <p>计分：单选1分/题，多选2分/题（少选得0.5分，错选0分），判断1分/题</p>
 <p className="text-red-500">考试期间请勿切换页面，切屏将被记录</p>
 </div>

 <div className="mb-6">
 <label className="block text-sm font-medium mb-2">选择考试类别</label>
 <div className="flex gap-2 justify-center">
 {[
 { value: 'C1', label: 'C1 - 机械', desc: '机械类' },
 { value: 'C2', label: 'C2 - 土建', desc: '土建类' },
 { value: 'C3', label: 'C3 - 综合', desc: '综合类（推荐）' },
 ].map((t) => (
 <button key={t.value} onClick={() => setCertType(t.value)}
 className={`px-4 py-3 rounded-lg border text-sm ${certType === t.value ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50 :bg-slate-700'}`}>
 <div className="font-medium">{t.value}</div>
 <div className="text-xs opacity-80">{t.desc}</div>
 </button>
))}
 </div>
 </div>

 <button onClick={startExam} disabled={loading}
 className="w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 disabled:opacity-50">
 {loading ? '创建中...' : '开始模拟考试'}
 </button>
 </div>
 </div>
);
}
