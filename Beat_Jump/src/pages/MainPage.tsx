import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import LogoSvg from '../assets/Logo.svg';
import { ApiError, songApi } from '../api/client';
import type { SongSummary } from '../api/types';
import { useAuth } from '../auth/useAuth';

const MainPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<SongSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    songApi.getSongs({ limit: 6 })
      .then((result) => { if (active) setSongs(result.items); })
      .catch((requestError) => { if (active) setError(requestError instanceof ApiError ? requestError.message : '곡을 불러오지 못했습니다.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const search = () => navigate(`/selectsong${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  const handleLogout = async () => { await logout(); navigate('/', { replace: true }); };

  return (
    <PageWrapper>
      <Header>
        <HeaderInner>
          <LogoImage src={LogoSvg} alt="최애의 타자" />
          <Nav>
            <button type="button" onClick={() => navigate('/selectsong')}>곡 목록</button>
            <button type="button" onClick={() => navigate('/registersong')}>곡 만들기</button>
          </Nav>
          <Account><span>{user?.nickname}</span><button type="button" onClick={handleLogout}>로그아웃</button></Account>
        </HeaderInner>
      </Header>

      <Hero>
        <Eyebrow>YOUTUBE LYRIC TYPING</Eyebrow>
        <HeroTitle>좋아하는 노래로<br /><em>타자 연습을 즐겨보세요.</em></HeroTitle>
        <HeroText>영상의 리듬에 맞춰 가사를 입력하고, 원하는 곡이 없다면 직접 만들어 모두와 공유할 수 있어요.</HeroText>
        <SearchForm onSubmit={(event) => { event.preventDefault(); search(); }}>
          <SearchInput aria-label="곡 검색" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="노래 제목 또는 아티스트 검색" />
          <SearchButton type="submit">곡 찾기</SearchButton>
        </SearchForm>
        <HeroActions>
          <PrimaryButton type="button" onClick={() => navigate('/selectsong')}>타자 연습 시작</PrimaryButton>
          <SecondaryButton type="button" onClick={() => navigate('/registersong')}>내 곡 만들기</SecondaryButton>
        </HeroActions>
      </Hero>

      <SongSection>
        <SectionHeader><div><SectionTitle>최근 공개된 곡</SectionTitle><SectionText>다른 사용자가 만든 곡을 바로 플레이해 보세요.</SectionText></div><MoreButton type="button" onClick={() => navigate('/selectsong')}>전체 곡 보기 →</MoreButton></SectionHeader>
        {error && <Message $error>{error}</Message>}
        {isLoading ? <Message>곡을 불러오는 중입니다...</Message> : songs.length === 0 ? (
          <EmptyState><strong>아직 공개된 곡이 없어요.</strong><span>첫 번째 타자 연습 곡을 만들어 보세요.</span><PrimaryButton type="button" onClick={() => navigate('/registersong')}>첫 곡 만들기</PrimaryButton></EmptyState>
        ) : (
          <SongGrid>{songs.map((song) => (
            <SongCard type="button" key={song.id} onClick={() => navigate(`/typing?songId=${song.id}`)}>
              <Thumbnail src={`https://i.ytimg.com/vi/${song.youtubeVideoId}/hqdefault.jpg`} alt="" />
              <CardBody><SongTitle>{song.title}</SongTitle><Artist>{song.artist}</Artist><Meta>{song.lyricLineCount}줄 · {song.creator.nickname}</Meta></CardBody>
            </SongCard>
          ))}</SongGrid>
        )}
      </SongSection>

      <HowSection>
        <SectionTitle>플레이 방법</SectionTitle>
        <StepGrid><Step><b>1</b><strong>곡 선택</strong><span>공개된 곡을 고르거나 직접 등록합니다.</span></Step><Step><b>2</b><strong>모드 선택</strong><span>계속 진행 또는 즉시 종료 모드를 선택합니다.</span></Step><Step><b>3</b><strong>Enter 판정</strong><span>가사를 입력하고 Enter를 눌러 점수를 얻습니다.</span></Step></StepGrid>
      </HowSection>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`min-height:100vh;background:#fff;color:#0f172a;`;
const Header = styled.header`height:64px;position:sticky;top:0;z-index:20;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid #e2e8f0;`;
const HeaderInner = styled.div`max-width:1120px;height:100%;margin:auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;`;
const LogoImage = styled.img`width:100px;`;
const Nav = styled.nav`display:flex;gap:24px;button{font-size:14px;font-weight:600;color:#334155;}`;
const Account = styled.div`display:flex;align-items:center;gap:12px;font-size:12px;color:#64748b;button{color:#475569;}`;
const Hero = styled.section`max-width:850px;margin:auto;padding:100px 24px 80px;text-align:center;display:flex;flex-direction:column;align-items:center;`;
const Eyebrow = styled.p`font-size:11px;font-weight:900;letter-spacing:2px;color:#0066ff;`;
const HeroTitle = styled.h1`margin-top:16px;font-size:54px;line-height:1.15;letter-spacing:-2px;font-weight:900;em{font-style:normal;color:#0066ff;}@media(max-width:600px){font-size:38px;}`;
const HeroText = styled.p`max-width:620px;margin-top:20px;color:#64748b;font-size:15px;line-height:1.7;`;
const SearchForm = styled.form`width:min(600px,100%);margin-top:32px;display:flex;padding:5px;border:1px solid #cbd5e1;border-radius:14px;box-shadow:0 10px 30px rgba(15,23,42,.06);`;
const SearchInput = styled.input`flex:1;min-width:0;height:46px;padding:0 14px;outline:none;`;
const SearchButton = styled.button`padding:0 20px;border-radius:10px;background:#0f172a;color:#fff;font-weight:700;`;
const HeroActions = styled.div`display:flex;gap:10px;margin-top:18px;`;
const PrimaryButton = styled.button`padding:12px 21px;border-radius:999px;background:#0066ff;color:#fff;font-weight:800;font-size:13px;`;
const SecondaryButton = styled.button`padding:12px 21px;border:1px solid #cbd5e1;border-radius:999px;color:#334155;font-weight:700;font-size:13px;`;
const SongSection = styled.section`max-width:1120px;margin:auto;padding:60px 24px;`;
const SectionHeader = styled.div`display:flex;justify-content:space-between;align-items:end;margin-bottom:24px;`;
const SectionTitle = styled.h2`font-size:26px;font-weight:900;letter-spacing:-.5px;`;
const SectionText = styled.p`margin-top:5px;font-size:13px;color:#64748b;`;
const MoreButton = styled.button`font-size:13px;font-weight:700;color:#0066ff;`;
const SongGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:18px;@media(max-width:760px){grid-template-columns:repeat(2,1fr);}@media(max-width:480px){grid-template-columns:1fr;}`;
const SongCard = styled.button`overflow:hidden;text-align:left;border:1px solid #e2e8f0;border-radius:14px;background:#fff;transition:.2s;&:hover{transform:translateY(-3px);box-shadow:0 12px 25px rgba(15,23,42,.07);}`;
const Thumbnail = styled.img`width:100%;aspect-ratio:16/9;object-fit:cover;background:#f1f5f9;`;
const CardBody = styled.div`padding:15px;`;
const SongTitle = styled.h3`font-size:15px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
const Artist = styled.p`margin-top:3px;font-size:12px;color:#64748b;`;
const Meta = styled.p`margin-top:12px;font-size:10px;color:#94a3b8;`;
const Message = styled.div<{ $error?:boolean }>`padding:50px;text-align:center;color:${({$error})=>$error?'#b91c1c':'#64748b'};`;
const EmptyState = styled.div`padding:55px 20px;border:1px dashed #cbd5e1;border-radius:16px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;span{font-size:13px;color:#64748b;margin-bottom:10px;}`;
const HowSection = styled.section`max-width:1120px;margin:40px auto 0;padding:60px 24px 100px;border-top:1px solid #e2e8f0;`;
const StepGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:24px;@media(max-width:650px){grid-template-columns:1fr;}`;
const Step = styled.div`padding:22px;border-radius:14px;background:#f8fafc;display:flex;flex-direction:column;gap:7px;b{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:#0066ff;color:#fff;font-size:12px;}strong{margin-top:5px;}span{font-size:12px;line-height:1.5;color:#64748b;}`;

export default MainPage;
