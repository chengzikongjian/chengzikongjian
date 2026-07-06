import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ChevronLeft, Moon, Sun, LogOut } from 'lucide-react';

export default function Settings() {
 const navigate = useNavigate();
 const { isDark, toggleDark, logout, user } = useAuthStore();

 const handleLogout = () => { logout(); navigate('/login'); };

 return (
 <div className="max-w-md mx-auto">
 <button onClick={() => navigate('/profile')} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ChevronLeft size={16} />返回</button>
 <h2 className="text-lg font-bold mb-4">设置</h2>

 <div className="space-y-2">
 <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
 <div className="flex items-center gap-3">
 {isDark ? <Moon size={20} /> : <Sun size={20} />}
 <span className="text-sm">深色模式</span>
 </div>
 <button onClick={toggleDark}
 className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}>
 <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isDark ? 'left-6' : 'left-0.5'}`} />
 </button>
 </div>

 <button onClick={handleLogout} className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 text-red-500 hover:bg-red-50 :bg-red-900/20 transition-colors">
 <LogOut size={20} />
 <span className="text-sm">退出登录</span>
 </button>
 </div>

 <div className="text-center text-xs text-gray-400 mt-8">
 <p>陕西安全员C证刷题系统 v1.0</p>
 <p className="mt-1">专为陕西省建筑施工安全员打造</p>
 </div>
 </div>
);
}
