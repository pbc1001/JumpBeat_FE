import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import MainPage from './pages/MainPage';
import SongSelectPage from './pages/SongSelectPage';
import SyncEditorPage from './pages/SyncEditionPage';
import SongRegisterPage from './pages/SongResgisterPage';
import LoadingPage from './pages/LoadingPage';
import GameResultPage from './pages/GameResultPage';
import TypingPracticePage from './pages/TypingPracticePage';
import { GuestRoute, ProtectedRoute } from './auth/RouteGuards';



export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/main" element={<MainPage />} />
        <Route path="/selectsong" element={<SongSelectPage />} />
        <Route path="/syncedit" element={<SyncEditorPage />} />
        <Route path="/registersong" element={<SongRegisterPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/result" element={<GameResultPage />} />
        <Route path="/typing" element={<TypingPracticePage />} />
      </Route>
    </Routes>
  );
}
