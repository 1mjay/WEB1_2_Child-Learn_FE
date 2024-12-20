import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import ArticlePage from '../../features/article/pages/articlepage';
import QuizPage from '../../features/beginner_chat/ui/quiz-widget/quizpage';
import { LoginPage } from '@/pages/auth/login/LoginPage';
import { SignUpPage } from '@/pages/auth/signup/SignUpPage';
import GraphExplanationPage from '../../features/beginner_chat/ui/fast-navgation/fast-navigation';
import IntermediatePage from '../../pages/TradePages/IntermediateTradePage/IntermediatePage';
import MainPage from '@/pages/mainpage/MainPage';
import MiniGamePage from '../../pages/MiniGamePage/MiniGamePage';
import FlipCardGamePage from '../../pages/MiniGamePage/FlipCardGamePage/FlipCardGamePage';
import WordQuizGamePage from '../../pages/MiniGamePage/WordQuizGamePage/WordQuizGamePage';
import WordQuizResultPage from '../../pages/MiniGamePage/WordQuizGamePage/WordQuizResultPage';
import CharacterPage from '../../pages/characterPage/CharacterPage';
import ExchangePage from '../../pages/exchangePage/ExchangePage';
import AccountRecoveryPage from '../../pages/auth/find-id-password/AccountRecoveryPage';
import showToast from '@/shared/lib/toast';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// 인증이 필요하지 않은 페이지 경로들
const PUBLIC_PATHS = ['/auth/login', '/auth/signup', '/', '/auth/find-id'];

export default function Router() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  useEffect(() => {
    // 현재 경로가 public path가 아니고, 인증되지 않은 경우에만 토스트 표시
    if (!PUBLIC_PATHS.includes(location.pathname) && !isAuthenticated) {
      showToast.error('로그인이 필요한 서비스입니다.');
    }
  }, [location.pathname, isAuthenticated]);

  // 리다이렉트 로직
  if (!PUBLIC_PATHS.includes(location.pathname) && !isAuthenticated) {
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );
  }
  return (
    <Routes>
      <Route path="/article" element={<ArticlePage />} />
      <Route path="/fast-navigation" element={<GraphExplanationPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/minigame" element={<MiniGamePage />} />
      <Route path="/flip-card/:level" element={<FlipCardGamePage />} />
      <Route path="/word-quiz/:level" element={<WordQuizGamePage />} />
      <Route path="/word-quiz/result/:level" element={<WordQuizResultPage />} />
      <Route path="/character" element={<CharacterPage />} />
      <Route path="/exchange" element={<ExchangePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/intermediate" element={<IntermediatePage />} />
      <Route path="*" element={<div>Page not found</div>} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="/auth/find-id" element={<AccountRecoveryPage />} />
    </Routes>
  );
}
