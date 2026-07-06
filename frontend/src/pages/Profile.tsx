import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { User, Award, Clock, BookOpen, Shield, Settings, ChevronRight, FileText, Star, CreditCard } from 'lucide-react';

export default function Profile() {
 const { user, logout } = useAuthStore();
 return (
 <div>
 {/* User Info */}
 <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-4">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">{user?.name?.[0] || user?.phone?.[0]}</div>
 <div>
 <h2 className="font-bold text-lg">{user?.name || '未设置姓名'}</h2>
 <p className="text-sm text-gray-500">{user?.phone}</p>
 {user?.certCategory && <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">{user.certCategory}</span>}
 </div>
 </div>
 </div>

 {/* Menu Items */}
 <div className="space-y-2">
 <Link to="/profile/certificate" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
 <Shield size={20} className="text-blue-600" />
 <span className="flex-1 text-sm">证书档案</span>
 <ChevronRight size={16} className="text-gray-400" />
 </Link>
 <Link to="/profile/history" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
 <Clock size={20} className="text-green-600" />
 <span className="flex-1 text-sm">学习记录</span>
 <ChevronRight size={16} className="text-gray-400" />
 </Link>
 <Link to="/favorites" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
 <Star size={20} className="text-yellow-600" />
 <span className="flex-1 text-sm">收藏题目</span>
 <ChevronRight size={16} className="text-gray-400" />
 </Link>
 <Link to="/articles" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
 <FileText size={20} className="text-purple-600" />
 <span className="flex-1 text-sm">政策资讯</span>
 <ChevronRight size={16} className="text-gray-400" />
 </Link>
 <Link to="/membership" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
 <CreditCard size={20} className="text-orange-600" />
 <span className="flex-1 text-sm">会员中心</span>
 <ChevronRight size={16} className="text-gray-400" />
 </Link>
 <Link to="/settings" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
 <Settings size={20} className="text-gray-600" />
 <span className="flex-1 text-sm">设置</span>
 <ChevronRight size={16} className="text-gray-400" />
 </Link>
 </div>

 <button onClick={logout} className="w-full mt-6 py-3 text-red-500 rounded-xl border border-red-200 hover:bg-red-50 transition-colors text-sm">退出登录</button>
 </div>
);
}
