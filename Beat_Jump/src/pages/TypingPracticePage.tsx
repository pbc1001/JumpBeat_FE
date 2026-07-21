import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError, songApi } from '../api/client';
import type { SongDetail } from '../api/types';
import { loadYouTubeApi, type YouTubePlayer } from '../youtubePlayer';

type GameMode = 'CONTINUE' | 'FAIL_FAST';
type GameStats = { correct: number; wrong: number; miss: number };

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');

const TypingPracticePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const songId = searchParams.get('songId');
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const indexRef = useRef(0);
  const statsRef = useRef<GameStats>({ correct: 0, wrong: 0, miss: 0 });
  const startedAtRef = useRef(0);
  const [song, setSong] = useState<SongDetail | null>(null);
  const [mode, setMode] = useState<GameMode>('CONTINUE');
  const [phase, setPhase] = useState<'SETUP' | 'PLAYING'>('SETUP');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<GameStats>({ correct: 0, wrong: 0, miss: 0 });
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(Boolean(songId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!songId) return;
    let active = true;
    songApi.getSong(songId)
      .then((data) => { if (active) setSong(data); })
      .catch((requestError) => { if (active) setError(requestError instanceof ApiError ? requestError.message : '곡을 불러오지 못했습니다.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [songId]);

  useEffect(() => {
    if (!song || !playerHostRef.current) return;
    let active = true;
    let created: YouTubePlayer | null = null;
    loadYouTubeApi().then((YT) => {
      if (!active || !playerHostRef.current) return;
      created = new YT.Player(playerHostRef.current, {
        videoId: song.youtubeVideoId,
        playerVars: { controls: 1, rel: 0 },
        events: { onReady: ({ target }) => { playerRef.current = target; } },
      });
    });
    return () => { active = false; playerRef.current = null; created?.destroy(); };
  }, [song]);

  const finish = (finalStats: GameStats, endedEarly: boolean) => {
    playerRef.current?.pauseVideo();
    const processed = finalStats.correct + finalStats.wrong + finalStats.miss;
    navigate('/result', {
      replace: true,
      state: {
        songId,
        title: song?.title,
        artist: song?.artist,
        difficulty: song?.difficulty,
        score: finalStats.correct * 100,
        accuracy: processed ? Math.round((finalStats.correct / processed) * 100) : 0,
        correct: finalStats.correct,
        wrong: finalStats.wrong,
        miss: finalStats.miss,
        total: song?.lyrics.length ?? 0,
        elapsedMs: Date.now() - startedAtRef.current,
        endedEarly,
      },
    });
  };

  const judge = (result: keyof GameStats) => {
    if (!song) return;
    const nextStats = { ...statsRef.current, [result]: statsRef.current[result] + 1 };
    statsRef.current = nextStats;
    setStats(nextStats);
    setInput('');
    setFeedback(result === 'correct' ? 'PERFECT!' : result === 'wrong' ? 'WRONG!' : 'MISS!');
    const isLast = indexRef.current >= song.lyrics.length - 1;
    if (isLast || (result !== 'correct' && mode === 'FAIL_FAST')) {
      finish(nextStats, !isLast);
      return;
    }
    indexRef.current += 1;
    setCurrentIndex(indexRef.current);
    window.setTimeout(() => setFeedback(''), 500);
  };

  useEffect(() => {
    if (phase !== 'PLAYING' || !song) return;
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      const line = song.lyrics[indexRef.current];
      if (!player || !line) return;
      const deadline = song.lyrics[indexRef.current + 1]?.startTimeMs ?? song.durationMs;
      if (deadline !== null && player.getCurrentTime() * 1000 >= deadline) judge('miss');
    }, 100);
    return () => window.clearInterval(timer);
  });

  const startGame = () => {
    if (!song || !playerRef.current) { setError('영상 플레이어가 준비될 때까지 잠시 기다려 주세요.'); return; }
    indexRef.current = 0;
    statsRef.current = { correct: 0, wrong: 0, miss: 0 };
    setCurrentIndex(0); setStats(statsRef.current); setError(''); setPhase('PLAYING');
    startedAtRef.current = Date.now();
    playerRef.current.seekTo((song.lyrics[0].startTimeMs ?? 0) / 1000, true);
    playerRef.current.playVideo();
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || !song) return;
    event.preventDefault();
    const line = song.lyrics[currentIndex];
    if (playerRef.current && playerRef.current.getCurrentTime() * 1000 < (line.startTimeMs ?? 0)) {
      setFeedback('아직 시작 전이에요');
      return;
    }
    judge(normalize(input) === normalize(line.text) ? 'correct' : 'wrong');
  };

  if (isLoading) return <Centered>게임을 준비하는 중입니다...</Centered>;
  if (!song) return <Centered><p>{error || '곡 정보가 없습니다.'}</p><button onClick={() => navigate('/selectsong')}>곡 목록으로</button></Centered>;
  const line = song.lyrics[currentIndex];
  const processed = stats.correct + stats.wrong + stats.miss;
  const accuracy = processed ? Math.round((stats.correct / processed) * 100) : 100;

  return (
    <PageWrapper onClick={() => phase === 'PLAYING' && inputRef.current?.focus()}>
      <TopBar>
        <button type="button" onClick={() => navigate('/selectsong')}>← 종료</button>
        <Track><strong>{song.title}</strong><span>{song.artist}</span></Track>
        <Stats><span>점수 <b>{stats.correct * 100}</b></span><span>정확도 <b>{accuracy}%</b></span><span>MISS <b>{stats.wrong + stats.miss}</b></span></Stats>
      </TopBar>
      <GameLayout>
        <VideoPanel><PlayerHost ref={playerHostRef} /></VideoPanel>
        {phase === 'SETUP' ? (
          <SetupCard>
            <h1>게임 모드를 선택하세요</h1>
            <ModeButton type="button" $active={mode === 'CONTINUE'} onClick={() => setMode('CONTINUE')}><strong>계속 진행</strong><span>틀리거나 놓쳐도 다음 가사로 넘어갑니다.</span></ModeButton>
            <ModeButton type="button" $active={mode === 'FAIL_FAST'} onClick={() => setMode('FAIL_FAST')}><strong>즉시 종료</strong><span>오답 또는 Miss가 한 번 나오면 게임이 끝납니다.</span></ModeButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <StartButton type="button" onClick={startGame}>게임 시작</StartButton>
          </SetupCard>
        ) : (
          <PlayArea>
            <Progress>{currentIndex + 1} / {song.lyrics.length}</Progress>
            <PreviousLine>{song.lyrics[currentIndex - 1]?.text ?? '...'}</PreviousLine>
            <CurrentLine>
              {line.text.split('').map((character, index) => <span key={index} data-state={index < input.length ? (input[index] === character ? 'correct' : 'wrong') : undefined}>{character}</span>)}
            </CurrentLine>
            <NextLine>{song.lyrics[currentIndex + 1]?.text ?? ''}</NextLine>
            <TypingInput ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder="가사를 입력하고 Enter를 누르세요" autoComplete="off" />
            <Feedback $bad={feedback !== 'PERFECT!'}>{feedback}</Feedback>
          </PlayArea>
        )}
      </GameLayout>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`min-height: 100vh; background: #f8fafc;`;
const TopBar = styled.header`min-height: 68px; padding: 10px 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; background: #fff; border-bottom: 1px solid #e2e8f0; button { color: #64748b; } @media(max-width:700px){flex-wrap:wrap;}`;
const Track = styled.div`display: flex; flex-direction: column; text-align: center; font-size: 14px; span{font-size:11px;color:#64748b;margin-top:2px;}`;
const Stats = styled.div`display:flex;gap:18px;font-size:12px;color:#64748b;b{color:#0f172a;margin-left:4px;}`;
const GameLayout = styled.main`max-width:1100px;margin:0 auto;padding:32px 24px;display:grid;grid-template-columns:minmax(300px,42%) 1fr;gap:30px;@media(max-width:800px){grid-template-columns:1fr;}`;
const VideoPanel = styled.div`aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#0f172a;`;
const PlayerHost = styled.div`width:100%;height:100%;iframe{width:100%;height:100%;}`;
const SetupCard = styled.section`padding:28px;border-radius:16px;background:#fff;border:1px solid #e2e8f0;display:flex;flex-direction:column;gap:12px;h1{font-size:22px;font-weight:800;margin-bottom:6px;}`;
const ModeButton = styled.button<{ $active:boolean }>`padding:15px;text-align:left;border:2px solid ${({$active})=>$active?'#0066ff':'#e2e8f0'};border-radius:10px;background:${({$active})=>$active?'#eff6ff':'#fff'};display:flex;flex-direction:column;gap:4px;strong{font-size:14px;}span{font-size:12px;color:#64748b;}`;
const StartButton = styled.button`margin-top:8px;padding:13px;border-radius:999px;background:#0066ff;color:#fff;font-weight:800;`;
const ErrorMessage = styled.p`font-size:12px;color:#b91c1c;background:#fef2f2;padding:10px;border-radius:7px;`;
const PlayArea = styled.section`position:relative;padding:34px 28px;border-radius:16px;background:#fff;border:1px solid #e2e8f0;text-align:center;`;
const Progress = styled.p`font-size:12px;color:#64748b;margin-bottom:28px;`;
const PreviousLine = styled.p`min-height:22px;color:#cbd5e1;font-size:14px;`;
const CurrentLine = styled.p`min-height:70px;margin:20px 0;font-size:26px;font-weight:800;line-height:1.45;word-break:keep-all;span[data-state=correct]{color:#0066ff;}span[data-state=wrong]{color:#ef4444;text-decoration:underline;}`;
const NextLine = styled.p`min-height:22px;color:#94a3b8;font-size:14px;`;
const TypingInput = styled.input`width:100%;height:50px;margin-top:30px;padding:0 16px;border:2px solid #cbd5e1;border-radius:10px;text-align:center;font-size:16px;outline:none;&:focus{border-color:#0066ff;}`;
const Feedback = styled.div<{ $bad:boolean }>`height:28px;margin-top:14px;font-size:20px;font-weight:900;color:${({$bad})=>$bad?'#ef4444':'#0066ff'};`;
const Centered = styled.main`min-height:100vh;display:grid;place-content:center;gap:12px;text-align:center;color:#64748b;button{color:#0066ff;}`;

export default TypingPracticePage;
