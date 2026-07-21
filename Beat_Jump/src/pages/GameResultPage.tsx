import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';

type ResultState = {
  songId: string;
  title: string;
  artist: string;
  difficulty: string;
  score: number;
  accuracy: number;
  correct: number;
  wrong: number;
  miss: number;
  total: number;
  elapsedMs: number;
  endedEarly: boolean;
};

const formatDuration = (milliseconds: number) => {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

const GameResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const result = state as ResultState | null;

  if (!result) {
    return <Empty><p>표시할 게임 결과가 없습니다.</p><button type="button" onClick={() => navigate('/selectsong')}>곡 목록으로</button></Empty>;
  }

  return (
    <PageWrapper>
      <ResultCard>
        <Eyebrow>{result.endedEarly ? '게임 종료' : '연습 완료'}</Eyebrow>
        <Title>{result.title}</Title>
        <Artist>{result.artist}</Artist>
        <Score>{result.score.toLocaleString()}점</Score>
        <Accuracy>정확도 {result.accuracy}%</Accuracy>

        <StatsGrid>
          <Stat $color="#0066ff"><strong>{result.correct}</strong><span>정답</span></Stat>
          <Stat $color="#f97316"><strong>{result.wrong}</strong><span>오답</span></Stat>
          <Stat $color="#ef4444"><strong>{result.miss}</strong><span>Miss</span></Stat>
          <Stat $color="#64748b"><strong>{formatDuration(result.elapsedMs)}</strong><span>플레이 시간</span></Stat>
        </StatsGrid>

        <Summary>{result.total}개 가사 중 {result.correct}개를 정확하게 입력했습니다.</Summary>
        <Actions>
          <SecondaryButton type="button" onClick={() => navigate('/selectsong')}>다른 곡 선택</SecondaryButton>
          <PrimaryButton type="button" onClick={() => navigate(`/typing?songId=${result.songId}`, { replace: true })}>다시 하기</PrimaryButton>
        </Actions>
      </ResultCard>
    </PageWrapper>
  );
};

const PageWrapper = styled.main`min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(145deg,#eff6ff,#f8fafc 50%,#fff);`;
const ResultCard = styled.section`width:min(620px,100%);padding:42px;border:1px solid #e2e8f0;border-radius:22px;background:#fff;text-align:center;box-shadow:0 24px 70px rgba(15,23,42,.09);`;
const Eyebrow = styled.p`font-size:12px;font-weight:800;letter-spacing:1.5px;color:#0066ff;text-transform:uppercase;`;
const Title = styled.h1`margin-top:10px;font-size:32px;font-weight:900;letter-spacing:-1px;`;
const Artist = styled.p`margin-top:4px;color:#64748b;font-size:14px;`;
const Score = styled.p`margin-top:30px;font-size:48px;font-weight:900;color:#0066ff;`;
const Accuracy = styled.p`margin-top:3px;font-size:14px;color:#475569;`;
const StatsGrid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:30px;@media(max-width:520px){grid-template-columns:repeat(2,1fr);}`;
const Stat = styled.div<{ $color:string }>`padding:16px 8px;border-radius:12px;background:#f8fafc;display:flex;flex-direction:column;gap:5px;strong{font-size:21px;color:${({$color})=>$color};}span{font-size:11px;color:#64748b;}`;
const Summary = styled.p`margin-top:24px;font-size:13px;color:#64748b;`;
const Actions = styled.div`display:flex;justify-content:center;gap:10px;margin-top:30px;`;
const SecondaryButton = styled.button`padding:12px 20px;border:1px solid #cbd5e1;border-radius:999px;font-weight:700;color:#475569;`;
const PrimaryButton = styled.button`padding:12px 24px;border-radius:999px;background:#0066ff;color:#fff;font-weight:800;`;
const Empty = styled.main`min-height:100vh;display:grid;place-content:center;gap:12px;text-align:center;color:#64748b;button{color:#0066ff;}`;

export default GameResultPage;
