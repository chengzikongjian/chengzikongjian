import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { FileText, ChevronRight, ChevronLeft } from 'lucide-react';

interface Article { id: number; title: string; category: string; createdAt: string; }

export default function Articles() {
 const navigate = useNavigate();
 const [articles, setArticles] = useState<Article[]>([]);
 const [category, setCategory] = useState('');

 useEffect(() => {
 const params = category ? `?category=${category}` : '';
 api.get(`/articles${params}`).then((r) => setArticles(r.data)).catch(() => {});
 }, [category]);

 return (
 <div>
 <button onClick={() => navigate('/profile')} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ChevronLeft size={16} />返回</button>
 <h2 className="text-lg font-bold mb-4">政策资讯</h2>
 <div className="flex gap-2 mb-4">
 <button onClick={() => setCategory('')} className={`px-3 py-1.5 rounded-lg text-sm ${!category ? 'bg-blue-600 text-white' : 'bg-white border'}`}>全部</button>
 <button onClick={() => setCategory('policy')} className={`px-3 py-1.5 rounded-lg text-sm ${category === 'policy' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>政策</button>
 <button onClick={() => setCategory('faq')} className={`px-3 py-1.5 rounded-lg text-sm ${category === 'faq' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>FAQ</button>
 </div>
 <div className="space-y-2">
 {articles.map((a) => (
 <Link key={a.id} to={`/articles/${a.id}`}
 className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md">
 <FileText size={20} className="text-blue-500 shrink-0" />
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium truncate">{a.title}</p>
 <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString('zh-CN')}</p>
 </div>
 <ChevronRight size={16} className="text-gray-400 shrink-0" />
 </Link>
))}
 </div>
 </div>
);
}
