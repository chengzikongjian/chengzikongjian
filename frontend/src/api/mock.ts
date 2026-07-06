
// 本地 Mock API - 替代后端请求
import questionsData from '../data/questions.json';
import chaptersData from '../data/chapters.json';
import articlesData from '../data/articles.json';

const questions = questionsData;
const chapters = chaptersData;
const articles = articlesData;

// 模拟延迟，让界面有加载感
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟分页
function paginate(arr, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { data: arr.slice(start, end), total: arr.length, page, pageSize };
}

// 按章节筛选
function byChapter(arr, chapterId) {
  return arr.filter(q => q.chapterId === chapterId);
}

// 按题型筛选
function byType(arr, type) {
  return arr.filter(q => q.type === type);
}

// 按证书类型筛选
function byCert(arr, certType) {
  return arr.filter(q => q.certType === certType);
}

// 随机打乱
function shuffle(arr, limit) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return limit ? copy.slice(0, limit) : copy;
}

// 默认用户
const defaultUser = { id: 1, phone: "13800138000", name: "沈苍", certCategory: "C3" };
// Helper: add question to wrong answers
function addWrongAnswer(qId) {
  const wrong = JSON.parse(localStorage.getItem("wrong_answers") || "[]");
  if (!wrong.includes(qId)) { wrong.push(qId); localStorage.setItem("wrong_answers", JSON.stringify(wrong)); }
}


// ===== Mock API =====
const mockApi = {
  // Auth
  post: async (url, data) => {
    await delay();
    if (url === '/auth/login' || url === '/auth/register') {
      return { data: { token: 'mock-token', user: defaultUser } };
    }
    if (url === '/auth/send-code') {
      return { data: { message: 'code sent (dev: 888888)' } };
    }
    if (url === '/exams') {
      const pool = (data?.cert_type) ? questions.filter(q => q.certType === data.cert_type || !q.certType) : [...questions];
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const examQuestions = shuffled.slice(0, Math.min(100, shuffled.length));
      const exam = { id: Date.now(), userId: 1, certType: data?.cert_type || 'C3', status: 'in_progress', score: 0, answers: {}, questions: examQuestions, startedAt: new Date().toISOString(), finishedAt: null };
      const exams = JSON.parse(localStorage.getItem('exams') || '[]');
      exams.unshift(exam);
      localStorage.setItem('exams', JSON.stringify(exams));
      return { data: { exam } };
    }
    // 添加收藏
    if (url === '/favorites') {
      const qId = data?.question_id;
      if (qId) {
        const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (!favs.includes(qId)) {
          favs.push(qId);
          localStorage.setItem('favorites', JSON.stringify(favs));
        }
      }
      return { data: { message: 'favorited' } };
    }

    // 提交答题记录 - 自动收录错题
    if (url === '/answers') {
      const qId = data?.question_id;
      const question = questions.find(q => q.id === qId);
      if (question && data?.selected_answer) {
        const isCorrect = data.selected_answer === question.answer;
        if (!isCorrect) addWrongAnswer(qId);
      }
      return { data: { message: 'ok' } };
    }
    return { data: {} };
  },

  get: async (url, config) => {
    await delay();
    
    // 章节列表
    if (url === '/chapters') {
      return { data: chapters };
    }

    // 题目列表
    if (url.startsWith('/questions?') || url === '/questions') {
      const urlObj = new URL(url, 'http://localhost');
      const params = Object.fromEntries(urlObj.searchParams);
      const { chapter_id, type, cert_type, page = '1', page_size = '20' } = params;
      
      let result = [...questions];
      if (chapter_id) result = byChapter(result, parseInt(chapter_id));
      if (type) result = byType(result, type);
      if (cert_type) result = byCert(result, cert_type);
      
      return paginate(result, parseInt(page), parseInt(page_size));
    }

    // 随机抽题
    if (url.startsWith('/questions/random')) {
      const urlObj = new URL(url, 'http://localhost');
      const cert_type = urlObj.searchParams.get('cert_type');
      const count = parseInt(urlObj.searchParams.get('count') || '10');
      let pool = cert_type ? byCert(questions, cert_type) : questions;
      const result = shuffle(pool, Math.min(count, 50));
      console.log('[Mock] random questions result:', result?.length, 'items, first:', result?.[0]?.id);
      return { data: result };
    }

    // 单个题目
    if (url.match(/^\/questions\/\d+$/)) {
      const id = parseInt(url.split('/').pop());
      return { data: questions.find(q => q.id === id) || null };
    }

    // 错题本
    if (url === '/wrong-answers') {
      const wrong = JSON.parse(localStorage.getItem('wrong_answers') || '[]');
      const result = questions.filter(q => wrong.includes(q.id));
      return { data: result.map(q => ({ ...q, wrongCount: 1 })) };
    }

    // 收藏
    if (url === '/favorites') {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      return { data: questions.filter(q => favs.includes(q.id)) };
    }

    // 考试列表/详情
    if (url.startsWith('/exams/')) {
      const id = parseInt(url.split('/').pop());
      const exams = JSON.parse(localStorage.getItem('exams') || '[]');
      const exam = exams.find(e => e.id === id);
      if (exam) {
        return { data: { exam, questions: exam.questions || [] } };
      }
      return { data: { exam: null, questions: [] } };
    }

    if (url === '/exams') {
      const exams = JSON.parse(localStorage.getItem('exams') || '[]');
      return { data: exams };
    }

    // 学习统计
    if (url === '/answers/stats') {
      return { data: { totalQuestions: 0, correctCount: 0, wrongCount: 0, accuracy: 0, examCount: 0, avgScore: 0, passCount: 0, passRate: 0 } };
    }

    // 学习进度
    if (url === '/study/progress') {
      return { data: chapters.map(ch => ({ chapterId: ch.id, chapterName: ch.name, total: questions.filter(q => q.chapterId === ch.id).length, answered: 0, percent: 0 })) };
    }

    // 证书信息
    if (url === '/certificate') {
      const cert = JSON.parse(localStorage.getItem('certificate') || '{}');
      const user = JSON.parse(localStorage.getItem('user') || JSON.stringify(defaultUser));
      const isExpired = cert.certExpireDate ? new Date(cert.certExpireDate) < new Date() : false;
      return { data: { user: { ...user, ...cert }, isExpired } };
    }

    // 个人信息
    if (url === '/profile') {
      const user = JSON.parse(localStorage.getItem('user') || JSON.stringify(defaultUser));
      return { data: user };
    }

    // 文章
    if (url === '/articles') {
      return { data: articles };
    }

    if (url === '/faq') {
      return { data: articles.filter(a => a.category === 'faq') };
    }

    // 文章详情
    if (url.match(/^\/articles\/\d+$/)) {
      const id = parseInt(url.split('/').pop());
      return { data: articles.find(a => a.id === id) || null };
    }

    console.warn('Mock API: 未匹配的 GET', url);
    return { data: [] };
  },

  put: async (url, data) => {
    await delay();
    
    // 保存考试答案
    if (url.startsWith('/exams/')) {
      const id = parseInt(url.split('/').pop());
      const exams = JSON.parse(localStorage.getItem('exams') || '[]');
      const examIndex = exams.findIndex(e => e.id === id);
      if (examIndex === -1) return { data: { exam: null } };
      const exam = exams[examIndex];
      if (data && data.answers) {
        exam.answers = {};
        data.answers.forEach(a => { exam.answers[a.questionId] = a.answer; });
      }
      if (data && data.submit) {
        let score = 0;
        exam.questions.forEach(q => {
          const userAnswer = (exam.answers[q.id] || '');
          let correct = false;
          if (q.type === 'single' || q.type === 'judge') {
            correct = (userAnswer === q.answer);
            if (correct) score += 1;
          } else if (q.type === 'multi') {
            const correctAns = (q.answer || '').split('').sort().join('');
            const userAns = userAnswer.split('').sort().join('');
            if (userAns === correctAns) { correct = true; score += 2; }
            else if (userAns.length > 0 && [...userAns].every(a => correctAns.includes(a))) { score += 0.5; }
          }
          q.selectedAnswer = userAnswer || null;
          q.isCorrect = correct;
        });
        exam.score = Math.round(score * 10) / 10;
        exam.status = 'finished';
        exam.finishedAt = new Date().toISOString();
        // 考试错题自动收录
        exam.questions.forEach(q => { if (!q.isCorrect) addWrongAnswer(q.id); });
      }
      exams[examIndex] = exam;
      localStorage.setItem('exams', JSON.stringify(exams));
      return { data: { exam, questions: exam.questions } };
    }

    // 更新证书
    if (url === '/certificate') {
      const { cert_number, cert_category, cert_expire_date } = data || {};
      const cert = { certNumber: cert_number, certCategory: cert_category, certExpireDate: cert_expire_date };
      localStorage.setItem('certificate', JSON.stringify(cert));
      const isExpired = cert_expire_date ? new Date(cert_expire_date) < new Date() : false;
      return { data: { user: defaultUser, isExpired } };
    }

    // 更新个人信息
    if (url === '/profile') {
      const user = { ...defaultUser, ...(data || {}) };
      localStorage.setItem('user', JSON.stringify(user));
      return { data: { message: 'updated' } };
    }

    return { data: {} };
  },

  delete: async (url) => {
    await delay();
    if (url.startsWith('/wrong-answers/')) {
      const qId = parseInt(url.split('/').pop());
      const wrong = JSON.parse(localStorage.getItem('wrong_answers') || '[]');
      localStorage.setItem('wrong_answers', JSON.stringify(wrong.filter(id => id !== qId)));
      return { data: { message: 'removed' } };
    }
    if (url.startsWith('/favorites/')) {
      const qId = parseInt(url.split('/').pop());
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      localStorage.setItem('favorites', JSON.stringify(favs.filter(id => id !== qId)));
      return { data: { message: 'removed' } };
    }
    if (url === '/wrong-answers') {
      localStorage.setItem('wrong_answers', '[]');
      return { data: { message: 'cleared' } };
    }
    return { data: { message: 'deleted' } };
  }
};

export default mockApi;