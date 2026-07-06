import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
 const [phone, setPhone] = useState('');
 const [password, setPassword] = useState('');
 const [isRegister, setIsRegister] = useState(false);
 const [name, setName] = useState('');
 const [certCategory, setCertCategory] = useState('C3');
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const { login: storeLogin, register: storeRegister } = useAuthStore();
 const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 if (isRegister) {
    await storeRegister({ phone, password, name, certCategory });
 } else {
    await storeLogin(phone, password);
 }
 navigate('/');
 } catch (err: any) {
 setError(err.response?.data?.error || '操作失败');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
 <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
 <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">陕西安全员C证刷题</h1>
 <p className="text-center text-sm text-gray-500 mb-6">专为陕西建筑施工安全员打造</p>

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-sm font-medium mb-1">手机号</label>
 <input
 type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
 placeholder="请输入手机号" required
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-1">密码</label>
 <input
 type="password" value={password} onChange={(e) => setPassword(e.target.value)}
 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
 placeholder="请输入密码" required
 />
 </div>

 {isRegister && (
 <>
 <div>
 <label className="block text-sm font-medium mb-1">姓名</label>
 <input type="text" value={name} onChange={(e) => setName(e.target.value)}
 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
 placeholder="请输入姓名" />
 </div>
 <div>
 <label className="block text-sm font-medium mb-1">报考类别</label>
 <select value={certCategory} onChange={(e) => setCertCategory(e.target.value)}
 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
 <option value="C1">C1 - 机械</option>
 <option value="C2">C2 - 土建</option>
 <option value="C3">C3 - 综合（推荐）</option>
 </select>
 </div>
 </>
)}

 {error && <p className="text-red-500 text-sm">{error}</p>}

 <button type="submit" disabled={loading}
 className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
 {loading ? '处理中...' : isRegister ? '注册' : '登录'}
 </button>
 </form>

 <p className="text-center text-sm mt-4 text-gray-500">
 {isRegister ? '已有账号？' : '没有账号？'}
 <button onClick={() => setIsRegister(!isRegister)} className="text-blue-600 ml-1 hover:underline">
 {isRegister ? '去登录' : '立即注册'}
 </button>
 </p>
 </div>
 </div>
);
}
