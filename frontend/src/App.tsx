import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chapters from './pages/Chapters';
import Practice from './pages/Practice';
import RandomPractice from './pages/RandomPractice';
import SpecialPractice from './pages/SpecialPractice';
import ExamNew from './pages/ExamNew';
import Exam from './pages/Exam';
import ExamResult from './pages/ExamResult';
import WrongAnswers from './pages/WrongAnswers';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Certificate from './pages/Certificate';
import History from './pages/History';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Membership from './pages/Membership';
import Settings from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="chapters" element={<Chapters />} />
          <Route path="practice/:chapterId" element={<Practice />} />
          <Route path="practice/random" element={<RandomPractice />} />
          <Route path="practice/special" element={<SpecialPractice />} />
          <Route path="exam/new" element={<ExamNew />} />
          <Route path="exam/:id" element={<Exam />} />
          <Route path="exam/:id/result" element={<ExamResult />} />
          <Route path="wrong-answers" element={<WrongAnswers />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/certificate" element={<Certificate />} />
          <Route path="profile/history" element={<History />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:id" element={<ArticleDetail />} />
          <Route path="membership" element={<Membership />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
