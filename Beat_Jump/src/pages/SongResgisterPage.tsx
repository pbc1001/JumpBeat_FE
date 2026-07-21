import { useState, type FormEvent } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import LogoSvg from '../assets/Logo.svg';
import { ApiError, songApi } from '../api/client';
import type { DuplicateSong, SongDifficulty, SongLanguage } from '../api/types';

const getYouTubeVideoId = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.split('/')[1] || null;
    if (parsed.hostname.endsWith('youtube.com')) {
      return parsed.searchParams.get('v') ?? parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ?? null;
    }
  } catch {
    return null;
  }
  return null;
};

const SongRegisterPage = () => {
  const navigate = useNavigate();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lyricsText, setLyricsText] = useState('');
  const [language, setLanguage] = useState<SongLanguage>('KO');
  const [difficulty, setDifficulty] = useState<SongDifficulty>('NORMAL');
  const [duplicates, setDuplicates] = useState<DuplicateSong[]>([]);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const videoId = getYouTubeVideoId(youtubeUrl);

  const createDraft = async (confirmedDuplicate: boolean) => {
    setIsSubmitting(true);
    setError('');
    try {
      const draft = await songApi.createDraft({
        title: title.trim(),
        artist: artist.trim(),
        youtubeUrl: youtubeUrl.trim(),
        language,
        difficulty,
        lyricsText: lyricsText.trim(),
        confirmedDuplicate,
      });
      navigate(`/syncedit?songId=${draft.id}`);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : '곡 초안을 만들지 못했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!videoId) {
      setError('올바른 YouTube 영상 URL을 입력해 주세요.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const result = await songApi.getDuplicates(title.trim(), artist.trim());
      if (result.hasDuplicates) {
        setDuplicates(result.items);
        setIsDuplicateModalOpen(true);
        setIsSubmitting(false);
        return;
      }
      await createDraft(false);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : '중복 곡을 확인하지 못했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <HeaderContainer>
          <LogoButton type="button" onClick={() => navigate('/main')}><LogoImage src={LogoSvg} alt="최애의 타자" /></LogoButton>
          <NavGroup>
            <NavButton type="button" onClick={() => navigate('/selectsong')}>곡 목록</NavButton>
            <NavButton type="button" $active>곡 만들기</NavButton>
          </NavGroup>
          <BackToList type="button" onClick={() => navigate('/selectsong')}>목록으로</BackToList>
        </HeaderContainer>
      </Header>

      <MainContainer>
        <FormSection>
          <PageTitle>새 곡 등록</PageTitle>
          <PageSubtitle>영상 정보와 가사를 입력하면 줄별 시작 시간을 설정할 수 있는 싱크 편집기로 이동합니다.</PageSubtitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input id="youtube-url" type="url" required placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
              <HelperText>일반 영상, 단축 URL, Shorts URL을 사용할 수 있습니다.</HelperText>
            </FormGroup>

            <RowGrid>
              <FormGroup>
                <Label htmlFor="song-title">곡 제목</Label>
                <Input id="song-title" required maxLength={150} placeholder="곡 제목" value={title} onChange={(e) => setTitle(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="artist">아티스트</Label>
                <Input id="artist" required maxLength={100} placeholder="아티스트" value={artist} onChange={(e) => setArtist(e.target.value)} />
              </FormGroup>
            </RowGrid>

            <RowGrid>
              <FormGroup>
                <Label htmlFor="language">가사 언어</Label>
                <Select id="language" value={language} onChange={(e) => setLanguage(e.target.value as SongLanguage)}>
                  <option value="KO">한국어</option><option value="EN">영어</option><option value="JA">일본어</option><option value="OTHER">기타</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="difficulty">난이도</Label>
                <Select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as SongDifficulty)}>
                  <option value="EASY">쉬움</option><option value="NORMAL">보통</option><option value="HARD">어려움</option>
                </Select>
              </FormGroup>
            </RowGrid>

            <FormGroup>
              <Label htmlFor="lyrics">가사</Label>
              <TextArea id="lyrics" required maxLength={100000} placeholder="한 줄에 하나의 가사 구간을 입력해 주세요." value={lyricsText} onChange={(e) => setLyricsText(e.target.value)} />
              <HelperText>빈 줄은 제외되며, 줄마다 하나의 타이핑 문제가 만들어집니다.</HelperText>
            </FormGroup>

            <InfoBanner>ⓘ 등록을 완료한 곡은 모든 사용자에게 공개됩니다. 사용할 권리가 있는 가사와 영상을 등록해 주세요.</InfoBanner>
            {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
            <ActionRow>
              <CancelButton type="button" onClick={() => navigate('/selectsong')}>취소</CancelButton>
              <SubmitButton type="submit" disabled={isSubmitting}>{isSubmitting ? '확인 중...' : '싱크 작업 시작 →'}</SubmitButton>
            </ActionRow>
          </Form>
        </FormSection>

        <PreviewAside>
          <PreviewCard>
            {videoId ? (
              <PreviewIframe src={`https://www.youtube.com/embed/${videoId}`} title="등록할 YouTube 영상 미리보기" allowFullScreen />
            ) : (
              <PreviewPlaceholder>유효한 YouTube URL을 입력하면 영상이 표시됩니다.</PreviewPlaceholder>
            )}
            <PreviewBody>
              <PreviewTitle>{title.trim() || '곡 제목'}</PreviewTitle>
              <PreviewArtist>{artist.trim() || '아티스트'}</PreviewArtist>
              <PreviewStatus $valid={Boolean(videoId)}>{videoId ? 'URL 확인됨' : 'URL 대기 중'}</PreviewStatus>
            </PreviewBody>
          </PreviewCard>
        </PreviewAside>
      </MainContainer>

      {isDuplicateModalOpen && (
        <ModalBackdrop role="presentation">
          <Modal role="dialog" aria-modal="true" aria-labelledby="duplicate-title">
            <ModalTitle id="duplicate-title">같은 제목의 곡이 있어요</ModalTitle>
            <ModalText>아래 곡과 동일한 곡인지 확인해 주세요. 다른 버전이거나 직접 등록하려는 곡이라면 계속할 수 있습니다.</ModalText>
            <DuplicateList>
              {duplicates.map((song) => <DuplicateItem key={song.id}><strong>{song.title}</strong><span>{song.artist}</span></DuplicateItem>)}
            </DuplicateList>
            <ModalActions>
              <CancelButton type="button" onClick={() => setIsDuplicateModalOpen(false)}>내용 수정하기</CancelButton>
              <SubmitButton type="button" disabled={isSubmitting} onClick={() => createDraft(true)}>{isSubmitting ? '등록 중...' : '그래도 등록하기'}</SubmitButton>
            </ModalActions>
          </Modal>
        </ModalBackdrop>
      )}
    </PageWrapper>
  );
};

const PageWrapper = styled.div`min-height: 100vh; background: ${({ theme }) => theme.colors.canvas};`;
const Header = styled.header`height: 64px; border-bottom: 1px solid ${({ theme }) => theme.colors.dividerSoft};`;
const HeaderContainer = styled.div`max-width: 1120px; height: 100%; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;`;
const LogoButton = styled.button`display: flex;`;
const LogoImage = styled.img`width: 100px;`;
const NavGroup = styled.nav`display: flex; gap: 24px;`;
const NavButton = styled.button<{ $active?: boolean }>`font-size: 14px; font-weight: ${({ $active }) => $active ? 700 : 500}; color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.charcoal};`;
const BackToList = styled.button`font-size: 13px; color: ${({ theme }) => theme.colors.mute};`;
const MainContainer = styled.main`max-width: 1120px; margin: 0 auto; padding: 48px 24px 80px; display: flex; gap: 48px; @media (max-width: 860px) { flex-direction: column; }`;
const FormSection = styled.section`flex: 1; min-width: 0;`;
const PageTitle = styled.h1`font-size: 38px; font-weight: 800; letter-spacing: -1px;`;
const PageSubtitle = styled.p`font-size: 14px; color: ${({ theme }) => theme.colors.mute}; margin: 10px 0 34px; line-height: 1.6;`;
const Form = styled.form`display: flex; flex-direction: column; gap: 22px;`;
const FormGroup = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const Label = styled.label`font-size: 13px; font-weight: 700;`;
const fieldStyle = (props: { theme: { colors: { surfaceCard: string; hairlineStrong: string; primary: string }; radii: { md: string } } }) => `background:${props.theme.colors.surfaceCard};border:1px solid ${props.theme.colors.hairlineStrong};border-radius:${props.theme.radii.md};outline:none;&:focus{border-color:${props.theme.colors.primary};}`;
const Input = styled.input`height: 44px; padding: 0 14px; font-size: 14px; ${fieldStyle}`;
const Select = styled.select`height: 44px; padding: 0 12px; font-size: 14px; ${fieldStyle}`;
const TextArea = styled.textarea`min-height: 210px; padding: 14px; resize: vertical; line-height: 1.6; ${fieldStyle}`;
const HelperText = styled.span`font-size: 11px; color: ${({ theme }) => theme.colors.ash};`;
const RowGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 16px; @media (max-width: 560px) { grid-template-columns: 1fr; }`;
const InfoBanner = styled.div`padding: 13px 15px; border-radius: ${({ theme }) => theme.radii.md}; background: #f0f6ff; color: ${({ theme }) => theme.colors.charcoal}; font-size: 12px;`;
const ErrorMessage = styled.div`padding: 12px 14px; border-radius: 8px; color: #b91c1c; background: #fef2f2; font-size: 13px;`;
const ActionRow = styled.div`display: flex; justify-content: space-between; align-items: center;`;
const CancelButton = styled.button`padding: 10px 14px; color: ${({ theme }) => theme.colors.mute}; font-size: 13px;`;
const SubmitButton = styled.button`padding: 12px 24px; border-radius: ${({ theme }) => theme.radii.full}; background: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primaryOn}; font-size: 14px; font-weight: 700; &:disabled { opacity: .55; }`;
const PreviewAside = styled.aside`width: 310px; flex-shrink: 0; @media (max-width: 860px) { width: 100%; }`;
const PreviewCard = styled.div`overflow: hidden; border: 1px solid ${({ theme }) => theme.colors.dividerSoft}; border-radius: 16px; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,.04);`;
const PreviewIframe = styled.iframe`display: block; width: 100%; aspect-ratio: 16 / 9; border: 0;`;
const PreviewPlaceholder = styled.div`aspect-ratio: 16 / 9; display: grid; place-items: center; padding: 24px; text-align: center; color: #94a3b8; background: #0f172a; font-size: 12px;`;
const PreviewBody = styled.div`padding: 18px;`;
const PreviewTitle = styled.h3`font-size: 16px; font-weight: 700;`;
const PreviewArtist = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.mute}; margin-top: 4px;`;
const PreviewStatus = styled.p<{ $valid: boolean }>`font-size: 11px; margin-top: 18px; font-weight: 700; color: ${({ $valid }) => $valid ? '#15803d' : '#64748b'};`;
const ModalBackdrop = styled.div`position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(15,23,42,.55);`;
const Modal = styled.div`width: min(480px, 100%); max-height: 80vh; overflow: auto; padding: 28px; border-radius: 18px; background: #fff; box-shadow: 0 24px 70px rgba(0,0,0,.2);`;
const ModalTitle = styled.h2`font-size: 22px; font-weight: 800;`;
const ModalText = styled.p`font-size: 13px; line-height: 1.6; color: ${({ theme }) => theme.colors.mute}; margin-top: 8px;`;
const DuplicateList = styled.div`display: flex; flex-direction: column; gap: 8px; margin: 20px 0;`;
const DuplicateItem = styled.div`display: flex; justify-content: space-between; gap: 12px; padding: 12px; border-radius: 9px; background: #f8fafc; font-size: 13px; span { color: #64748b; }`;
const ModalActions = styled.div`display: flex; justify-content: flex-end; gap: 8px;`;

export default SongRegisterPage;
