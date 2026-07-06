import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { BookOpen, ClipboardList, AlertTriangle, Star, TrendingUp, Award } from 'lucide-react';

interface Stats {
 totalQuestions: number; correctCount: number; wrongCount: number;
 accuracy: number; examCount: number; avgScore: number; passCount: number; passRate: number;
}

export default function Dashboard() {
 const { user } = useAuthStore();
 const [stats, setStats] = useState<Stats | null>(null);

 useEffect(() => {
 api.get('/answers/stats').then((r) => setStats(r.data)).catch(() => {});
 }, []);

 return (
 <div className="space-y-6">
 {/* Welcome */}
 <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 md:p-6 text-white">
 <h2 className="text-xl md:text-2xl font-bold">欢迎回来，{user?.name || user?.phone}</h2>
 <p className="text-blue-100 text-sm mt-1">坚持刷题，顺利拿证！</p>
 </div>

 {/* Quick Stats */}
 {stats && (
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 <div className="bg-white rounded-xl p-4 shadow-sm">
 <div className="flex items-center gap-2 text-blue-600 mb-1"><BookOpen size={18} /> <span className="text-xs text-gray-500">刷题总数</span></div>
 <span className="text-2xl font-bold">{stats.totalQuestions}</span>
 </div>
 <div className="bg-white rounded-xl p-4 shadow-sm">
 <div className="flex items-center gap-2 text-green-600 mb-1"><TrendingUp size={18} /> <span className="text-xs text-gray-500">正确率</span></div>
 <span className="text-2xl font-bold">{stats.accuracy}%</span>
 </div>
 <div className="bg-white rounded-xl p-4 shadow-sm">
 <div className="flex items-center gap-2 text-orange-600 mb-1"><ClipboardList size={18} /> <span className="text-xs text-gray-500">模拟考试</span></div>
 <span className="text-2xl font-bold">{stats.examCount}</span>
 </div>
 <div className="bg-white rounded-xl p-4 shadow-sm">
 <div className="flex items-center gap-2 text-purple-600 mb-1"><Award size={18} /> <span className="text-xs text-gray-500">平均分</span></div>
 <span className="text-2xl font-bold">{stats.avgScore}</span>
 </div>
 </div>
)}

 {/* Quick Actions */}
 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
 <Link to="/chapters" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2"><BookOpen className="text-blue-600" size={22} /></div>
 <div className="font-medium">章节练习</div>
 <div className="text-xs text-gray-500">按章节逐题练习</div>
 </Link>
 <Link to="/practice/random" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2"><BookOpen className="text-green-600" size={22} /></div>
 <div className="font-medium">随机刷题</div>
 <div className="text-xs text-gray-500">碎片化随机练习</div>
 </Link>
 <Link to="/exam/new" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2"><ClipboardList className="text-orange-600" size={22} /></div>
 <div className="font-medium">模拟考试</div>
 <div className="text-xs text-gray-500">全真还原陕西机考</div>
 </Link>
 <Link to="/wrong-answers" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
 <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-2"><AlertTriangle className="text-red-600" size={22} /></div>
 <div className="font-medium">错题本</div>
 <div className="text-xs text-gray-500">反复巩固薄弱点</div>
 </Link>
 <Link to="/favorites" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
 <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2"><Star className="text-yellow-600" size={22} /></div>
 <div className="font-medium">收藏题目</div>
 <div className="text-xs text-gray-500">重点题目集中练</div>
 </Link>
 <Link to="/practice/special" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
 <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2"><Award className="text-purple-600" size={22} /></div>
 <div className="font-medium">专项刷题</div>
 <div className="text-xs text-gray-500">按题型专项训练</div>
 </Link>
 </div>

 {/* Certificate remind */}
 <Link to="/profile/certificate" className="block bg-yellow-50 /20 border border-yellow-200 rounded-xl p-4">
 <p className="text-sm text-yellow-800 ">证书管理：录入证书信息，获取过期提醒和换证指导 →</p>
 </Link>
 </div>
);
}
