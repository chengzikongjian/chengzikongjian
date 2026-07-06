import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Home, BookOpen, ClipboardList, AlertTriangle, User,
  Menu, X, LogOut
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';

const navItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/chapters', label: '章节练习', icon: BookOpen },
  { to: '/practice/random', label: '随机刷题', icon: BookOpen },
  { to: '/exam/new', label: '模拟考试', icon: ClipboardList },
  { to: '/wrong-answers', label: '错题本', icon: AlertTriangle },
  { to: '/profile', label: '我的', icon: User },
];

const mobileNavItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/chapters', label: '练习', icon: BookOpen },
  { to: '/exam/new', label: '考试', icon: ClipboardList },
  { to: '/wrong-answers', label: '错题', icon: AlertTriangle },
  { to: '/profile', label: '我的', icon: User },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between bg-white shadow-sm px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold text-blue-700">陕西安全员C证刷题</h1>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user?.name || user?.phone}</span>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100" title="退出登录">
            <LogOut size={18} className="text-gray-500" />
          </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white shadow-sm px-4 py-3 sticky top-0 z-50">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-base font-bold text-blue-700">安全员C证刷题</h1>
      </div>

      {/* Mobile Side Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <span className="font-semibold">{user?.name || user?.phone}</span>
              <button onClick={handleLogout} className="text-red-500 text-sm">退出</button>
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg mb-1 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-4 md:py-6 pb-20 md:pb-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
