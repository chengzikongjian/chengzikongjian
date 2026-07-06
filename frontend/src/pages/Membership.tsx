import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, ShieldCheck } from 'lucide-react';

const plans = [
 { type: 'monthly', label: '月度会员', price: '29.9', desc: '全部题库 + 无限模拟考', popular: false },
 { type: 'quarterly', label: '季度会员', price: '69.9', desc: '月度 × 3 + 考前押题', popular: true },
 { type: 'yearly', label: '考证年卡', price: '199', desc: '全年无忧 + VIP专属 + PDF导出', popular: false },
];

export default function Membership() {
 const navigate = useNavigate();

 return (
 <div className="max-w-md mx-auto">
 <button onClick={() => navigate('/profile')} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ChevronLeft size={16} />返回</button>
 <h2 className="text-lg font-bold text-center mb-2">会员中心</h2>
 <p className="text-sm text-gray-500 text-center mb-6">解锁全部功能，高效备考</p>

 <div className="space-y-3">
 {plans.map((p) => (
 <div key={p.type} className={`relative bg-white rounded-xl p-4 shadow-sm border-2 ${p.popular ? 'border-blue-500' : 'border-transparent'}`}>
 {p.popular && <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-xs px-3 py-0.5 rounded-full">推荐</span>}
 <div className="flex items-center justify-between">
 <div>
 <h3 className="font-bold">{p.label}</h3>
 <p className="text-sm text-gray-500">{p.desc}</p>
 </div>
 <div className="text-right">
 <span className="text-2xl font-bold text-blue-600">¥{p.price}</span>
 </div>
 </div>
 <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
 立即开通
 </button>
 </div>
))}
 </div>

 <div className="text-center text-xs text-gray-400 mt-6">
 <p className="flex items-center justify-center gap-1"><ShieldCheck size={14} />微信支付 / 支付宝</p>
 </div>
 </div>
);
}
