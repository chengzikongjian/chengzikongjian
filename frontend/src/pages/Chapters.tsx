import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, BookOpen } from "lucide-react";
import api from "../api/client";

interface Chapter {
  id: number;
  name: string;
  parentId: number | null;
  sortOrder: number;
}

export default function Chapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/chapters")
      .then((r) => setChapters(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">章节练习</h2>
      {loading ? (
        <div className="text-center py-10 text-gray-400">加载中...</div>
      ) : (
        <div className="space-y-3">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => navigate(`/practice/${ch.id}`)}
              className="w-full flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-700 leading-relaxed">
                {ch.name}
              </span>
              <ChevronRight size={18} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
