import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError, songApi } from '../api/client';
import type { SongDetail } from '../api/types';
import { loadYouTubeApi, type YouTubePlayer } from '../youtubePlayer';

type GameMode = 'CONTINUE' | 'FAIL_FAST';
type LyricScope = 'ALL' | 'KOREAN' | 'ENGLISH';
type GameStats = { correct: number; wrong: number; miss: number };

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
const detectLyricLanguage = (text: string) => {
  const koreanCount = (text.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g) ?? []).length;
  const englishCount = (text.match(/[A-Za-z]/g) ?? []).length;
  return koreanCount >= englishCount ? 'KOREAN' : 'ENGLISH';
};

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
  const judgedIndexRef = useRef<number | null>(null);
  const lineStartedRef = useRef(false);
  const phaseRef = useRef<'SETUP' | 'PLAYING'>('SETUP');
  const finishRef = useRef<(finalStats: GameStats, endedEarly: boolean) => void>(() => undefined);
  const hasFinishedRef = useRef(false);
  const judgeRef = useRef<(result: keyof GameStats) => void>(() => undefined);
  const [song, setSong] = useState<SongDetail | null>(null);
  const [mode, setMode] = useState<GameMode>('CONTINUE');
  const [lyricScope, setLyricScope] = useState<LyricScope>('ALL');
  const [phase, setPhase] = useState<'SETUP' | 'PLAYING'>('SETUP');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<GameStats>({ correct: 0, wrong: 0, miss: 0 });
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(Boolean(songId));
  const [error, setError] = useState('');
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const gameLyrics = useMemo(() => {
    if (!song || lyricScope === 'ALL') return song?.lyrics ?? [];
    return song.lyrics.filter((line) => detectLyricLanguage(line.text) === lyricScope);
  }, [lyricScope, song]);
  const activeLine = song?.lyrics[currentIndex];
  const isActiveLineRequired = activeLine ? lyricScope === 'ALL' || detectLyricLanguage(activeLine.text) === lyricScope : false;

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
        events: {
          onReady: ({ target }) => { playerRef.current = target; setIsPlayerReady(true); },
          onError: () => {
            setIsPlayerReady(false);
            setError('이 영상은 외부 재생이 제한되어 게임을 시작할 수 없습니다. 다른 영상으로 등록해 주세요.');
          },
          onStateChange: ({ data }) => {
            if (data === 0 && phaseRef.current === 'PLAYING') finishRef.current(statsRef.current, false);
          },
        },
      });
    });
    return () => { active = false; playerRef.current = null; setIsPlayerReady(false); created?.destroy(); };
  }, [song]);

  const finish = (finalStats: GameStats, endedEarly: boolean) => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
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
        total: gameLyrics.length,
        elapsedMs: Date.now() - startedAtRef.current,
        endedEarly,
      },
    });
  };

  useEffect(() => {
    phaseRef.current = phase;
    finishRef.current = finish;
  });

  const isRequiredLine = (text: string) => lyricScope === 'ALL' || detectLyricLanguage(text) === lyricScope;

  const advanceWithoutScore = () => {
    if (!song) return;
    const isLast = indexRef.current >= song.lyrics.length - 1;
    if (isLast) {
      finish(statsRef.current, false);
      return;
    }
    indexRef.current += 1;
    judgedIndexRef.current = null;
    lineStartedRef.current = false;
    setCurrentIndex(indexRef.current);
    setInput('');
  };

  const judge = (result: keyof GameStats, advanceImmediately = false) => {
    if (!song) return;
    if (judgedIndexRef.current === indexRef.current) return;
    judgedIndexRef.current = indexRef.current;
    const nextStats = { ...statsRef.current, [result]: statsRef.current[result] + 1 };
    statsRef.current = nextStats;
    setStats(nextStats);
    setInput('');
    setFeedback(result === 'correct' ? 'PERFECT!' : result === 'wrong' ? 'WRONG!' : 'MISS!');
    const isLast = indexRef.current >= song.lyrics.length - 1;
    if (result !== 'correct' && mode === 'FAIL_FAST') {
      finish(nextStats, true);
      return;
    }
    if (advanceImmediately) {
      if (isLast) {
        finish(nextStats, false);
        return;
      }
      indexRef.current += 1;
      judgedIndexRef.current = null;
      lineStartedRef.current = false;
      setCurrentIndex(indexRef.current);
      setInput('');
    }
    window.setTimeout(() => setFeedback(''), 500);
  };
  useEffect(() => {
    judgeRef.current = judge;
  });

  useEffect(() => {
    if (phase === 'PLAYING' && currentIndex > 0) setInput('');
  }, [currentIndex, phase]);

  useEffect(() => {
    if (phase !== 'PLAYING' || !song) return;
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      const line = song.lyrics[indexRef.current];
      if (!player || !line) return;
      const nowMs = player.getCurrentTime() * 1000;
      const videoDurationMs = player.getDuration() * 1000;
      if (videoDurationMs > 0 && nowMs >= videoDurationMs - 200) {
        finish(statsRef.current, false);
        return;
      }
      if (!lineStartedRef.current && nowMs >= (line.startTimeMs ?? 0)) {
        lineStartedRef.current = true;
        setInput('');
      }
      const deadline = song.lyrics[indexRef.current + 1]?.startTimeMs ?? song.durationMs;
      if (deadline !== null && nowMs >= deadline) {
        if (judgedIndexRef.current === indexRef.current) advanceWithoutScore();
        else if (isRequiredLine(line.text)) judge('miss', true);
        else advanceWithoutScore();
      }
    }, 100);
    return () => window.clearInterval(timer);
  });

  const startGame = () => {
    if (!song || !playerRef.current) { setError('영상 플레이어가 준비될 때까지 잠시 기다려 주세요.'); return; }
    if (gameLyrics.length === 0) { setError('선택한 언어에 해당하는 가사가 없습니다.'); return; }
    indexRef.current = 0;
    judgedIndexRef.current = null;
    lineStartedRef.current = false;
    hasFinishedRef.current = false;
    statsRef.current = { correct: 0, wrong: 0, miss: 0 };
    setCurrentIndex(0); setStats(statsRef.current); setError(''); setPhase('PLAYING');
    startedAtRef.current = Date.now();
    playerRef.current.loadVideoById(song.youtubeVideoId, 0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || !song) return;
    event.preventDefault();
    const line = song.lyrics[currentIndex];
    if (!isRequiredLine(line.text)) return;
    if (playerRef.current && playerRef.current.getCurrentTime() * 1000 < (line.startTimeMs ?? 0)) {
      setFeedback('아직 시작 전이에요');
      return;
    }
    judge(normalize(event.currentTarget.value) === normalize(line.text) ? 'correct' : 'wrong');
  };

  useEffect(() => {
    if (phase !== 'PLAYING' || !isActiveLineRequired) return;
    inputRef.current?.focus();

    const captureTyping = (event: globalThis.KeyboardEvent) => {
      const inputElement = inputRef.current;
      if (!inputElement || event.target === inputElement || event.ctrlKey || event.metaKey || event.altKey) return;
      inputElement.focus();

      if (event.key === 'Enter') {
        event.preventDefault();
        if (activeLine) judgeRef.current(normalize(input) === normalize(activeLine.text) ? 'correct' : 'wrong');
        return;
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        setInput((current) => current.slice(0, -1));
        return;
      }
      if (event.key.length === 1) {
        event.preventDefault();
        setInput((current) => current + event.key);
      }
    };

    window.addEventListener('keydown', captureTyping, true);
    return () => window.removeEventListener('keydown', captureTyping, true);
  }, [activeLine, input, isActiveLineRequired, phase]);

  if (isLoading) return <Centered>게임을 준비하는 중입니다...</Centered>;
  if (!song) return <Centered><p>{error || '곡 정보가 없습니다.'}</p><button onClick={() => navigate('/selectsong')}>곡 목록으로</button></Centered>;
  const line = song.lyrics[currentIndex];
  const isCurrentLineRequired = isRequiredLine(line.text);
  const processed = stats.correct + stats.wrong + stats.miss;
  const accuracy = processed ? Math.round((stats.correct / processed) * 100) : 100;

  return (
    <PageWrapper onClick={() => phase === 'PLAYING' && inputRef.current?.focus()}>
      <TopBar>
        <button type="button" onClick={() => navigate('/selectsong')}>← 종료</button>
        <Track><strong>{song.title}</strong><span>{song.artist}</span></Track>
        <Stats><span>점수 <b>{stats.correct * 100}</b></span><span>정확도 <b>{accuracy}%</b></span><span>MISS <b>{stats.wrong + stats.miss}</b></span></Stats>
      </TopBar>
      <GameStage>
        <BackgroundVideo><PlayerHost ref={playerHostRef} /></BackgroundVideo>
        <BackgroundShade />
        {phase === 'SETUP' ? (
          <SetupCard>
            <h1>게임 모드를 선택하세요</h1>
            <ModeButton type="button" $active={mode === 'CONTINUE'} onClick={() => setMode('CONTINUE')}><strong>계속 진행</strong><span>틀리거나 놓쳐도 다음 가사로 넘어갑니다.</span></ModeButton>
            <ModeButton type="button" $active={mode === 'FAIL_FAST'} onClick={() => setMode('FAIL_FAST')}><strong>즉시 종료</strong><span>오답 또는 Miss가 한 번 나오면 게임이 끝납니다.</span></ModeButton>
            <ScopeTitle>입력할 가사</ScopeTitle>
            <ScopeGroup>
              <ScopeButton type="button" $active={lyricScope === 'ALL'} onClick={() => setLyricScope('ALL')}>전체 <span>{song.lyrics.length}</span></ScopeButton>
              <ScopeButton type="button" $active={lyricScope === 'KOREAN'} onClick={() => setLyricScope('KOREAN')}>한글 <span>{song.lyrics.filter((line) => detectLyricLanguage(line.text) === 'KOREAN').length}</span></ScopeButton>
              <ScopeButton type="button" $active={lyricScope === 'ENGLISH'} onClick={() => setLyricScope('ENGLISH')}>영어 <span>{song.lyrics.filter((line) => detectLyricLanguage(line.text) === 'ENGLISH').length}</span></ScopeButton>
            </ScopeGroup>
            {gameLyrics.length === 0 && <ScopeWarning>선택한 언어에 해당하는 가사가 없습니다.</ScopeWarning>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <StartButton type="button" disabled={!isPlayerReady || gameLyrics.length === 0} onClick={startGame}>{isPlayerReady ? '게임 시작' : '영상 준비 중...'}</StartButton>
          </SetupCard>
        ) : (
          <PlayArea>
            <Progress>{currentIndex + 1} / {song.lyrics.length} · 입력 대상 {gameLyrics.length}줄</Progress>
            <PreviousLine>{song.lyrics[currentIndex - 1]?.text ?? '...'}</PreviousLine>
            <LineMode $required={isCurrentLineRequired}>{isCurrentLineRequired ? '입력할 가사' : '듣는 구간 · 입력하지 않아도 됩니다'}</LineMode>
            <CurrentLine $required={isCurrentLineRequired}>
              {line.text.split('').map((character, index) => <span key={index} data-state={index < input.length ? (input[index] === character ? 'correct' : 'wrong') : undefined}>{character}</span>)}
            </CurrentLine>
            <NextLine>{song.lyrics[currentIndex + 1]?.text ?? ''}</NextLine>
            <TypingInput key={currentIndex} ref={inputRef} disabled={!isCurrentLineRequired} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} onBlur={() => { if (phase === 'PLAYING' && isCurrentLineRequired) window.setTimeout(() => inputRef.current?.focus(), 0); }} placeholder={isCurrentLineRequired ? '페이지 어디서든 가사를 입력하고 Enter를 누르세요' : '이 가사는 입력하지 않아도 됩니다'} autoComplete="off" />
            <Feedback $bad={feedback !== 'PERFECT!'}>{feedback}</Feedback>
          </PlayArea>
        )}
      </GameStage>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`min-height:100vh;background:#020617;color:#fff;overflow:hidden;`;
const TopBar = styled.header`min-height:68px;padding:10px 28px;position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:20px;background:rgba(2,6,23,.76);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.14);button{color:#cbd5e1;}@media(max-width:700px){flex-wrap:wrap;}`;
const Track = styled.div`display:flex;flex-direction:column;text-align:center;font-size:14px;span{font-size:11px;color:#cbd5e1;margin-top:2px;}`;
const Stats = styled.div`display:flex;gap:18px;font-size:12px;color:#cbd5e1;b{color:#fff;margin-left:4px;}`;
const GameStage = styled.main`position:relative;min-height:calc(100vh - 68px);padding:42px 24px;display:grid;place-items:center;isolation:isolate;`;
const BackgroundVideo = styled.div`position:absolute;inset:0;z-index:-2;overflow:hidden;background:#020617;pointer-events:none;iframe{position:absolute;top:50%;left:50%;width:100vw;height:56.25vw;min-width:177.78vh;min-height:100vh;transform:translate(-50%,-50%);border:0;}`;
const BackgroundShade = styled.div`position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(2,6,23,.52),rgba(2,6,23,.76)),radial-gradient(circle at center,transparent 0%,rgba(2,6,23,.35) 75%);`;
const PlayerHost = styled.div`position:absolute;inset:0;width:100%;height:100%;`;
const SetupCard = styled.section`width:min(520px,100%);padding:32px;border-radius:20px;background:rgba(15,23,42,.78);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(18px);box-shadow:0 24px 70px rgba(0,0,0,.35);display:flex;flex-direction:column;gap:12px;h1{font-size:22px;font-weight:800;margin-bottom:6px;color:#fff;}`;
const ModeButton = styled.button<{ $active:boolean }>`padding:15px;text-align:left;border:2px solid ${({$active})=>$active?'#0066ff':'#e2e8f0'};border-radius:10px;background:${({$active})=>$active?'#eff6ff':'#fff'};display:flex;flex-direction:column;gap:4px;strong{font-size:14px;}span{font-size:12px;color:#64748b;}`;
const ScopeTitle = styled.h2`margin-top:8px;font-size:13px;font-weight:800;color:#fff;`;
const ScopeGroup = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px;`;
const ScopeButton = styled.button<{ $active:boolean }>`padding:10px 6px;border:1px solid ${({$active})=>$active?'#60a5fa':'rgba(255,255,255,.25)'};border-radius:9px;background:${({$active})=>$active?'rgba(37,99,235,.35)':'rgba(255,255,255,.08)'};color:#fff;font-size:12px;font-weight:700;span{margin-left:3px;color:#bfdbfe;font-size:10px;}`;
const ScopeWarning = styled.p`padding:9px;border-radius:7px;background:rgba(239,68,68,.18);color:#fecaca;font-size:11px;`;
const StartButton = styled.button`margin-top:8px;padding:13px;border-radius:999px;background:#0066ff;color:#fff;font-weight:800;&:disabled{opacity:.5;cursor:not-allowed;}`;
const ErrorMessage = styled.p`font-size:12px;color:#b91c1c;background:#fef2f2;padding:10px;border-radius:7px;`;
const PlayArea = styled.section`width:min(760px,100%);position:relative;padding:42px 38px;border-radius:22px;background:rgba(15,23,42,.72);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(16px);box-shadow:0 24px 80px rgba(0,0,0,.38);text-align:center;@media(max-width:600px){padding:30px 20px;}`;
const Progress = styled.p`font-size:12px;color:#cbd5e1;margin-bottom:28px;`;
const PreviousLine = styled.p`min-height:22px;color:rgba(255,255,255,.42);font-size:14px;`;
const LineMode = styled.p<{ $required:boolean }>`display:inline-block;margin-top:16px;padding:5px 10px;border-radius:999px;background:${({$required})=>$required?'rgba(37,99,235,.35)':'rgba(255,255,255,.1)'};color:${({$required})=>$required?'#bfdbfe':'#94a3b8'};font-size:11px;font-weight:700;`;
const CurrentLine = styled.p<{ $required:boolean }>`min-height:70px;margin:14px 0 20px;color:${({$required})=>$required?'#fff':'rgba(255,255,255,.48)'};font-size:${({$required})=>$required?'30px':'24px'};font-weight:${({$required})=>$required?800:500};line-height:1.45;word-break:keep-all;text-shadow:0 2px 12px rgba(0,0,0,.7);transition:.2s;span[data-state=correct]{color:#60a5fa;}span[data-state=wrong]{color:#f87171;text-decoration:underline;}`;
const NextLine = styled.p`min-height:22px;color:rgba(255,255,255,.62);font-size:14px;`;
const TypingInput = styled.input`width:100%;height:52px;margin-top:30px;padding:0 16px;border:2px solid rgba(255,255,255,.34);border-radius:11px;background:rgba(255,255,255,.94);color:#0f172a;text-align:center;font-size:16px;outline:none;&:focus{border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.2);}&:disabled{background:rgba(148,163,184,.25);border-color:rgba(255,255,255,.12);color:#cbd5e1;cursor:not-allowed;}`;
const Feedback = styled.div<{ $bad:boolean }>`height:28px;margin-top:14px;font-size:20px;font-weight:900;color:${({$bad})=>$bad?'#ef4444':'#0066ff'};`;
const Centered = styled.main`min-height:100vh;display:grid;place-content:center;gap:12px;text-align:center;color:#64748b;button{color:#0066ff;}`;

export default TypingPracticePage;
