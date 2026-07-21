import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LogoSvg from '../assets/Logo.svg';
import { ApiError, songApi } from '../api/client';
import type { SongDetail } from '../api/types';
import { loadYouTubeApi, type YouTubePlayer } from '../youtubePlayer';

const formatTime = (milliseconds: number | null) => {
  if (milliseconds === null) return '--:--.---';
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millis = milliseconds % 1000;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
};

const SyncEditorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const songId = searchParams.get('songId');
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const [song, setSong] = useState<SongDetail | null>(null);
  const [times, setTimes] = useState<Record<string, number | null>>({});
  const [durationMs, setDurationMs] = useState(0);
  const [isLoading, setIsLoading] = useState(Boolean(songId));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!songId) {
      return;
    }
    let active = true;
    songApi.getDraft(songId)
      .then((draft) => {
        if (!active) return;
        setSong(draft);
        setDurationMs(draft.durationMs ?? 0);
        setTimes(Object.fromEntries(draft.lyrics.map((line) => [line.id, line.startTimeMs])));
        const firstEmptyIndex = draft.lyrics.findIndex((line) => line.startTimeMs === null);
        setActiveIndex(firstEmptyIndex < 0 ? Math.max(0, draft.lyrics.length - 1) : firstEmptyIndex);
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof ApiError ? requestError.message : '곡 초안을 불러오지 못했습니다.');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [songId]);

  useEffect(() => {
    if (!song || !playerHostRef.current) return;
    let active = true;
    let createdPlayer: YouTubePlayer | null = null;
    loadYouTubeApi().then((YT) => {
      if (!active || !playerHostRef.current) return;
      createdPlayer = new YT.Player(playerHostRef.current, {
        videoId: song.youtubeVideoId,
        playerVars: { controls: 1, rel: 0 },
        events: {
          onReady: ({ target }) => {
            playerRef.current = target;
            const videoDuration = Math.round(target.getDuration() * 1000);
            if (videoDuration > 0) setDurationMs(videoDuration);
          },
          onError: () => setError('이 영상은 외부 재생이 제한되어 있습니다. YouTube에서 시간을 확인한 뒤 아래에 직접 입력할 수 있습니다.'),
        },
      });
    });
    return () => {
      active = false;
      playerRef.current = null;
      createdPlayer?.destroy();
    };
  }, [song]);

  const setCurrentTime = (lineId: string) => {
    const player = playerRef.current;
    if (!player) {
      setError('영상 플레이어가 준비될 때까지 잠시 기다려 주세요.');
      return;
    }
    setError('');
    setSavedMessage('');
    setTimes((current) => ({ ...current, [lineId]: Math.round(player.getCurrentTime() * 1000) }));
  };

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeIndex]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select')) return;
      const player = playerRef.current;
      if (!song || !player) return;

      if (event.code === 'Space') {
        event.preventDefault();
        const line = song.lyrics[activeIndex];
        if (!line) return;
        const currentTimeMs = Math.round(player.getCurrentTime() * 1000);
        const previousTime = activeIndex > 0 ? times[song.lyrics[activeIndex - 1].id] : null;
        if (previousTime !== null && previousTime !== undefined && currentTimeMs <= previousTime) {
          setError('현재 시간은 이전 가사 시간보다 뒤여야 합니다.');
          return;
        }
        setError('');
        setSavedMessage('');
        setTimes((current) => ({ ...current, [line.id]: currentTimeMs }));
        setActiveIndex((current) => Math.min(current + 1, song.lyrics.length - 1));
      }

      if (event.code === 'Backspace' && activeIndex > 0) {
        event.preventDefault();
        const previousIndex = activeIndex - 1;
        const previousLine = song.lyrics[previousIndex];
        setTimes((current) => ({ ...current, [previousLine.id]: null }));
        setActiveIndex(previousIndex);
      }

      if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        event.preventDefault();
        const offset = event.code === 'ArrowLeft' ? -3 : 3;
        player.seekTo(Math.max(0, player.getCurrentTime() + offset), true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [activeIndex, song, times]);

  const validateTimeline = () => {
    if (!song || durationMs <= 0) return '영상이 준비되지 않았습니다.';
    const orderedTimes = song.lyrics.map((line) => times[line.id]);
    if (orderedTimes.some((time) => time === null || time === undefined)) return '모든 가사 줄의 시작 시간을 지정해 주세요.';
    const completeTimes = orderedTimes as number[];
    if (completeTimes.some((time) => time < 0 || time >= durationMs)) return '시작 시간은 영상 길이 안에 있어야 합니다.';
    if (completeTimes.some((time, index) => index > 0 && completeTimes[index - 1] >= time)) return '가사 시작 시간은 위에서 아래로 갈수록 커야 합니다.';
    return null;
  };

  const saveTimeline = async () => {
    if (!songId || !song) return false;
    const validationError = validateTimeline();
    if (validationError) {
      setError(validationError);
      return false;
    }
    setIsSaving(true);
    setError('');
    setSavedMessage('');
    try {
      const updated = await songApi.saveSync(songId, {
        durationMs,
        lyrics: song.lyrics.map((line) => ({ id: line.id, startTimeMs: times[line.id] as number })),
      });
      setSong(updated);
      setSavedMessage('싱크를 저장했습니다.');
      return true;
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : '싱크를 저장하지 못했습니다.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishSong = async () => {
    if (!songId || !(await saveTimeline())) return;
    setIsSaving(true);
    try {
      await songApi.publish(songId);
      navigate('/selectsong', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : '곡을 공개하지 못했습니다.');
      setIsSaving(false);
    }
  };

  if (isLoading) return <Centered role="status">곡 정보를 불러오는 중입니다...</Centered>;
  if (!song) return <Centered><p>{error || '곡 정보가 없습니다. 곡 등록부터 다시 진행해 주세요.'}</p><button type="button" onClick={() => navigate('/registersong')}>곡 등록으로 돌아가기</button></Centered>;

  return (
    <PageWrapper>
      <Header>
        <LogoButton type="button" onClick={() => navigate('/main')}><LogoImage src={LogoSvg} alt="최애의 타자" /></LogoButton>
        <HeaderTitle>수동 싱크 편집기</HeaderTitle>
        <HeaderButton type="button" onClick={() => navigate('/selectsong')}>나중에 계속하기</HeaderButton>
      </Header>

      <EditorLayout>
        <LeftPane>
          <Title>{song.title}</Title>
          <Subtitle>{song.artist}</Subtitle>
          <VideoContainer><PlayerHost ref={playerHostRef} /></VideoContainer>
          <Guide>
            영상을 재생하고 가사가 시작되는 순간 <strong>Space</strong>를 누르세요. 기록 후 다음 줄로 자동 이동합니다.<br />
            <strong>Backspace</strong> 직전 기록 취소 · <strong>← / →</strong> 영상 3초 이동
          </Guide>
          <DurationControl>
            <label htmlFor="video-duration">영상 길이(초)</label>
            <input
              id="video-duration"
              type="number"
              min="1"
              step="0.001"
              value={durationMs > 0 ? durationMs / 1000 : ''}
              placeholder="자동 확인 실패 시 직접 입력"
              onChange={(event) => setDurationMs(event.target.value === '' ? 0 : Math.round(Number(event.target.value) * 1000))}
            />
            <span>{durationMs > 0 ? formatTime(durationMs) : '영상 재생이 제한되면 직접 입력해 주세요.'}</span>
          </DurationControl>
        </LeftPane>

        <RightPane>
          <TimelineHeader>
            <div><TimelineTitle>가사 타임라인</TimelineTitle><TimelineCount>{song.lyrics.length}줄</TimelineCount></div>
            <SaveButton type="button" disabled={isSaving} onClick={saveTimeline}>임시 저장</SaveButton>
          </TimelineHeader>

          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
          {savedMessage && <SuccessMessage role="status">{savedMessage}</SuccessMessage>}

          <TimelineList>
            {song.lyrics.map((line, index) => {
              const time = times[line.id] ?? null;
              return (
                <TimelineItem
                  key={line.id}
                  ref={index === activeIndex ? activeLineRef : undefined}
                  $synced={time !== null}
                  $active={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                >
                  <LineNumber>{index + 1}</LineNumber>
                  <LineContent>
                    <LyricText>{line.text}</LyricText>
                    <TimeControls>
                      <TimeButton type="button" disabled={time === null} onClick={() => time !== null && playerRef.current?.seekTo(time / 1000, true)}>{formatTime(time)}</TimeButton>
                      <SecondsInput
                        aria-label={`${index + 1}번째 가사 시작 초`}
                        type="number"
                        min="0"
                        step="0.001"
                        placeholder="초"
                        value={time === null ? '' : time / 1000}
                        onChange={(event) => setTimes((current) => ({ ...current, [line.id]: event.target.value === '' ? null : Math.round(Number(event.target.value) * 1000) }))}
                      />
                      <RecordButton type="button" onClick={() => { setCurrentTime(line.id); setActiveIndex(Math.min(index + 1, song.lyrics.length - 1)); }}>현재 시간 기록</RecordButton>
                    </TimeControls>
                  </LineContent>
                </TimelineItem>
              );
            })}
          </TimelineList>

          <BottomActions>
            <SecondaryButton type="button" onClick={() => navigate('/registersong')}>곡 정보로 돌아가기</SecondaryButton>
            <PublishButton type="button" disabled={isSaving} onClick={publishSong}>{isSaving ? '처리 중...' : '저장하고 공개하기'}</PublishButton>
          </BottomActions>
        </RightPane>
      </EditorLayout>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`min-height: 100vh; background: ${({ theme }) => theme.colors.canvas};`;
const Header = styled.header`height: 64px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid ${({ theme }) => theme.colors.dividerSoft};`;
const LogoButton = styled.button`display: flex;`;
const LogoImage = styled.img`width: 100px;`;
const HeaderTitle = styled.span`font-size: 14px; font-weight: 700;`;
const HeaderButton = styled.button`font-size: 13px; color: ${({ theme }) => theme.colors.mute};`;
const EditorLayout = styled.main`min-height: calc(100vh - 64px); display: grid; grid-template-columns: minmax(360px, 46%) 1fr; @media (max-width: 900px) { grid-template-columns: 1fr; }`;
const LeftPane = styled.section`padding: 42px; background: #f8fafc; border-right: 1px solid ${({ theme }) => theme.colors.dividerSoft}; @media (max-width: 600px) { padding: 24px; }`;
const Title = styled.h1`font-size: 30px; font-weight: 800;`;
const Subtitle = styled.p`margin: 5px 0 24px; color: ${({ theme }) => theme.colors.mute};`;
const VideoContainer = styled.div`aspect-ratio: 16 / 9; overflow: hidden; border-radius: 14px; background: #0f172a; box-shadow: 0 14px 34px rgba(0,0,0,.14);`;
const PlayerHost = styled.div`width: 100%; height: 100%; iframe { width: 100%; height: 100%; }`;
const Guide = styled.p`margin-top: 22px; padding: 15px; border-radius: 10px; background: #eff6ff; color: #334155; font-size: 13px; line-height: 1.65;`;
const DurationControl = styled.div`margin-top:14px;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:7px 10px;font-size:12px;color:${({theme})=>theme.colors.mute};input{height:34px;padding:0 9px;border:1px solid #cbd5e1;border-radius:7px;}span{grid-column:1/-1;font-size:11px;color:#94a3b8;}`;
const RightPane = styled.section`padding: 34px; min-width: 0; @media (max-width: 600px) { padding: 22px; }`;
const TimelineHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;`;
const TimelineTitle = styled.h2`font-size: 21px; font-weight: 800;`;
const TimelineCount = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.ash}; margin-top: 3px;`;
const SaveButton = styled.button`padding: 9px 15px; border: 1px solid ${({ theme }) => theme.colors.hairlineStrong}; border-radius: ${({ theme }) => theme.radii.full}; font-size: 12px; font-weight: 700;`;
const ErrorMessage = styled.div`padding: 11px 13px; margin-bottom: 14px; border-radius: 8px; color: #b91c1c; background: #fef2f2; font-size: 12px;`;
const SuccessMessage = styled.div`padding: 11px 13px; margin-bottom: 14px; border-radius: 8px; color: #15803d; background: #f0fdf4; font-size: 12px;`;
const TimelineList = styled.div`display: flex; flex-direction: column; gap: 9px; max-height: calc(100vh - 230px); overflow: auto; padding-right: 4px;`;
const TimelineItem = styled.div<{ $synced: boolean; $active: boolean }>`display:flex;gap:12px;padding:14px;border:2px solid ${({$active,$synced})=>$active?'#0066ff':$synced?'#bfdbfe':'#e2e8f0'};border-radius:11px;background:${({$active,$synced})=>$active?'#eff6ff':$synced?'#f8fbff':'#fff'};cursor:pointer;transition:.15s;`;
const LineNumber = styled.span`width: 24px; height: 24px; display: grid; place-items: center; flex-shrink: 0; border-radius: 50%; background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 700;`;
const LineContent = styled.div`flex: 1; min-width: 0;`;
const LyricText = styled.p`font-size: 14px; line-height: 1.45; word-break: break-word;`;
const TimeControls = styled.div`display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-top: 10px;`;
const TimeButton = styled.button`min-width: 78px; text-align: left; font-family: monospace; font-size: 12px; color: ${({ theme }) => theme.colors.primary}; &:disabled { color: #94a3b8; }`;
const SecondsInput = styled.input`width: 76px; height: 30px; padding: 0 7px; border: 1px solid #dbe2ea; border-radius: 6px; font-size: 12px;`;
const RecordButton = styled.button`padding: 7px 10px; border-radius: 7px; background: ${({ theme }) => theme.colors.primary}; color: white; font-size: 11px; font-weight: 700;`;
const BottomActions = styled.div`display: flex; justify-content: space-between; gap: 12px; margin-top: 22px;`;
const SecondaryButton = styled.button`padding: 11px 14px; color: ${({ theme }) => theme.colors.mute}; font-size: 13px;`;
const PublishButton = styled.button`padding: 12px 22px; border-radius: ${({ theme }) => theme.radii.full}; background: ${({ theme }) => theme.colors.primary}; color: white; font-size: 13px; font-weight: 800; &:disabled { opacity: .55; }`;
const Centered = styled.main`min-height: 100vh; display: grid; place-content: center; gap: 16px; text-align: center; color: #64748b; button { color: #0066ff; }`;

export default SyncEditorPage;
