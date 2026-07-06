import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Shield, AlertTriangle, ChevronLeft, Save } from 'lucide-react';

export default function Certificate() {
 const navigate = useNavigate();
 const [certNumber, setCertNumber] = useState('');
 const [certCategory, setCertCategory] = useState('C2');
 const [certExpireDate, setCertExpireDate] = useState('');
 const [isExpired, setIsExpired] = useState(false);
 const [saved, setSaved] = useState(false);

 useEffect(() => {
 api.get('/certificate').then((r) => {
 const u = r.data.user;
 if (u) {
 setCertNumber(u.certNumber || '');
 setCertCategory(u.certCategory || 'C2');
 setCertExpireDate(u.certExpireDate || '');
 setIsExpired(r.data.isExpired);
 }
 }).catch(() => {});
 }, []);

 const save = async () => {
 try {
 const { data } = await api.put('/certificate', { cert_number: certNumber, cert_category: certCategory, cert_expire_date: certExpireDate });
 setIsExpired(data.isExpired);
 setSaved(true);
 setTimeout(() => setSaved(false), 2000);
 } catch {}
 };

 return (
 <div className="max-w-md mx-auto">
 <button onClick={() => navigate('/profile')} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ChevronLeft size={16} />返回</button>
 <h2 className="text-lg font-bold mb-4">证书档案</h2>

 {isExpired && (
 <div className="bg-yellow-50 /20 border border-yellow-200 rounded-xl p-3 mb-4 flex items-center gap-2">
 <AlertTriangle size={18} className="text-yellow-600 shrink-0" />
 <div>
 <p className="text-sm font-medium text-yellow-800 ">证书已过期</p>
 <p className="text-xs text-yellow-600 ">建议直接报考C3综合类证书</p>
 </div>
 </div>
)}

 <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium mb-1">证书编号</label>
 <input type="text" value={certNumber} onChange={(e) => setCertNumber(e.target.value)}
 className="w-full px-3 py-2 border rounded-lg " placeholder="请输入安管证书编号" />
 </div>
 <div>
 <label className="block text-sm font-medium mb-1">证书类别</label>
 <select value={certCategory} onChange={(e) => setCertCategory(e.target.value)}
 className="w-full px-3 py-2 border rounded-lg ">
 <option value="C1">C1 - 机械类</option>
 <option value="C2">C2 - 土建类</option>
 <option value="C3">C3 - 综合类</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium mb-1">证书有效期</label>
 <input type="date" value={certExpireDate} onChange={(e) => setCertExpireDate(e.target.value)}
 className="w-full px-3 py-2 border rounded-lg " />
 </div>
 <button onClick={save}
 className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
 <Save size={16} />{saved ? '已保存' : '保存证书信息'}
 </button>
 </div>

 {isExpired && (
 <div className="mt-4 bg-blue-50 /20 rounded-xl p-4 text-sm">
 <p className="font-medium mb-2">过期证书换证建议</p>
 <p className="text-gray-600 ">持有过期C2证书的考生，可直接报考C3综合类证书。C3涵盖C1+C2全部考点，建议重点复习机械部分和陕西本地政策新增内容。</p>
 </div>
)}
 </div>
);
}
