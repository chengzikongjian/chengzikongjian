import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { ChevronLeft, Calendar } from 'lucide-react';

export default function ArticleDetail() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [article, setArticle] = useState<any>(null);

 useEffect(() => {
 api.get(`/articles/${id}`).then((r) => setArticle(r.data)).catch(() => navigate('/articles'));
 }, [id, navigate]);

 if (!article) return <div className="text-center py-12 text-gray-500">加载中...</div>;

 return (
 <div>
 <button onClick={() => navigate('/articles')} className="flex items-center gap-1 text-sm text-blue-600 mb-4"><ChevronLeft size={16} />返回</button>
 <article className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
 <h1 className="text-xl font-bold mb-2">{article.title}</h1>
 <div className="flex items-center gap-2 text-xs text-gray-400 mb-4"><Calendar size={14} /><span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span></div>
 <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed">{article.content}</div>
 </article>
 </div>
);
}
