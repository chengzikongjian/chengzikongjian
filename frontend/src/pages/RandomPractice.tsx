import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Shuffle, ChevronLeft } from 'lucide-react';

export default function RandomPractice() {
 const navigate = useNavigate();
 const [count, setCount] = useState(10);
 const [loading, setLoading] = useState(false);

 const start = async () => {
 console.log("Start button clicked, count:", count);
 setLoading(true);
 try {
 const response = await api.get(`/questions/random?count=${count}`);
 const questionsList = response && Array.isArray(response) ? response : (response?.data || []);
 if (!questionsList || !Array.isArray(questionsList) || questionsList.length === 0) {
   alert('暂无随机题目，response=' + JSON.stringify(response).substring(0, 100));
   return;
 }
 // Store questions in session and navigate to practice view
 sessionStorage.setItem('randomQuestions', JSON.stringify(questionsList));
 sessionStorage.setItem('practiceMode', 'random');
    console.log('Navigating to /practice/0 with', questionsList.length, 'questions');
    navigate('/practice/0');
 
 } catch (e) { console.error("Random practice error:", e); alert("加载随机题目失败：" + e.message); }
 setLoading(false);
 };

 return (
 <div className="max-w-md mx-auto text-center">
 <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-blue-600 mb-6"><ChevronLeft size={16} />返回首页</button>
 <div className="bg-white rounded-xl shadow-sm p-6">
 <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Shuffle size={28} className="text-green-600" /></div>
 <h2 className="text-lg font-bold mb-2">随机刷题</h2>
 <p className="text-sm text-gray-500 mb-6">不限章节，随机抽取题目进行练习</p>
 <div className="mb-6">
 <label className="block text-sm mb-2">题目数量</label>
 <div className="flex gap-2 justify-center">
 {[5, 10, 20, 30].map((n) => (
 <button key={n} onClick={() => setCount(n)}
 className={`px-4 py-2 rounded-lg border ${count === n ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50 :bg-slate-700'}`}>{n}</button>
))}
 </div>
 </div>
 <button onClick={start} disabled={loading}
 className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50">
 {loading ? '加载中...' : '开始随机练习'}
 </button>
 </div>
 </div>
);
}
