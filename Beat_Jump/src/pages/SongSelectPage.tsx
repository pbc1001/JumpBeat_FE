import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import LogoSvg from '../assets/Logo.svg';
import { ApiError, songApi } from '../api/client';
import type { SongDifficulty, SongLanguage, SongSummary } from '../api/types';
import { useAuth } from '../auth/useAuth';

const languages: Array<{ label: string; value?: SongLanguage }> = [
  { label: '전체' },
  { label: '한국어', value: 'KOREAN' },
  { label: '영어', value: 'ENGLISH' },
  { label: '일본어', value: 'JAPANESE' },
  { label: '기타', value: 'OTHER' },
];

const difficulties: Array<{ label: string; value?: SongDifficulty }> = [
  { label: '전체' },
  { label: '쉬움', value: 'EASY' },
  { label: '보통', value: 'NORMAL' },
  { label: '어려움', value: 'HARD' },
];

const difficultyLabel: Record<SongDifficulty, string> = {
  EASY: '쉬움',
  NORMAL: '보통',
  HARD: '어려움',
};

const difficultyColor: Record<SongDifficulty, string> = {
  EASY: '#3b82f6',
  NORMAL: '#10b981',
  HARD: '#ef4444',
};

const SongSelectPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<SongLanguage>();
  const [difficulty, setDifficulty] = useState<SongDifficulty>();
  const [songs, setSongs] = useState<SongSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await songApi.getSongs({
          q: searchQuery.trim() || undefined,
          language,
          difficulty,
        });
        if (active) {
          setSongs(result.items);
          setNextCursor(result.nextCursor);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof ApiError ? requestError.message : '곡을 불러오지 못했습니다.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchQuery, language, difficulty]);

  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    setError('');
    try {
      const result = await songApi.getSongs({
        q: searchQuery.trim() || undefined,
        language,
        difficulty,
        cursor: nextCursor,
      });
      setSongs((current) => [...current, ...result.items]);
      setNextCursor(result.nextCursor);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : '곡을 더 불러오지 못했습니다.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <PageWrapper>
      <Header>
        <HeaderContainer>
          <LogoButton type="button" onClick={() => navigate('/main')}>
            <LogoImage src={LogoSvg} alt="최애의 타자" />
          </LogoButton>
          <NavGroup>
            <NavButton type="button" $active>곡 목록</NavButton>
            <NavButton type="button" onClick={() => navigate('/registersong')}>곡 만들기</NavButton>
          </NavGroup>
          <HeaderAuth>
            <UserName>{user?.nickname}</UserName>
            <LogoutButton type="button" onClick={handleLogout}>로그아웃</LogoutButton>
          </HeaderAuth>
        </HeaderContainer>
      </Header>

      <MainContainer>
        <Sidebar>
          <SidebarTitle>필터</SidebarTitle>
          <SearchBox>
            <SearchInput
              aria-label="곡 검색"
              placeholder="제목 또는 가수 검색..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <SearchIcon aria-hidden="true">⌕</SearchIcon>
          </SearchBox>

          <FilterGroup>
            <FilterLabel>언어</FilterLabel>
            <ChipGroup>
              {languages.map((item) => (
                <Chip
                  type="button"
                  key={item.label}
                  $active={language === item.value}
                  onClick={() => setLanguage(item.value)}
                >
                  {item.label}
                </Chip>
              ))}
            </ChipGroup>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>난이도</FilterLabel>
            <ChipGroup>
              {difficulties.map((item) => (
                <Chip
                  type="button"
                  key={item.label}
                  $active={difficulty === item.value}
                  onClick={() => setDifficulty(item.value)}
                >
                  {item.label}
                </Chip>
              ))}
            </ChipGroup>
          </FilterGroup>
        </Sidebar>

        <ContentArea>
          <TopHeader>
            <div>
              <MainTitle>Pick Your Beat.</MainTitle>
              <SubTitle>공개된 곡을 골라 타자 연습을 시작해 보세요.</SubTitle>
            </div>
            <CreateButton type="button" onClick={() => navigate('/registersong')}>+ 곡 만들기</CreateButton>
          </TopHeader>

          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
          {isLoading ? (
            <StatusMessage role="status">곡을 불러오는 중입니다...</StatusMessage>
          ) : songs.length === 0 ? (
            <StatusMessage>조건에 맞는 공개 곡이 없습니다.</StatusMessage>
          ) : (
            <CardGrid>
              {songs.map((song) => (
                <SongCard type="button" key={song.id} onClick={() => navigate(`/typing?songId=${song.id}`)}>
                  <CoverWrapper>
                    <CoverImg
                      src={`https://i.ytimg.com/vi/${song.youtubeVideoId}/hqdefault.jpg`}
                      alt={`${song.title} YouTube 미리보기`}
                    />
                  </CoverWrapper>
                  <SongTitle>{song.title}</SongTitle>
                  <ArtistName>{song.artist}</ArtistName>
                  <CardMeta>
                    <DifficultyBadge $color={difficultyColor[song.difficulty]}>
                      ◆ {difficultyLabel[song.difficulty]}
                    </DifficultyBadge>
                    <LineCount>{song.lyricLineCount}줄</LineCount>
                  </CardMeta>
                </SongCard>
              ))}
            </CardGrid>
          )}

          {nextCursor && !isLoading && (
            <LoadMoreButton type="button" disabled={isLoadingMore} onClick={loadMore}>
              {isLoadingMore ? '불러오는 중...' : '곡 더보기'}
            </LoadMoreButton>
          )}
        </ContentArea>
      </MainContainer>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.canvas};
`;

const Header = styled.header`
  height: 64px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoButton = styled.button`display: flex;`;
const LogoImage = styled.img`width: 100px;`;
const NavGroup = styled.nav`display: flex; gap: 24px;`;

const NavButton = styled.button<{ $active?: boolean }>`
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.charcoal)};
`;

const HeaderAuth = styled.div`display: flex; align-items: center; gap: 14px;`;
const UserName = styled.span`font-size: 13px; color: ${({ theme }) => theme.colors.charcoal};`;
const LogoutButton = styled.button`font-size: 13px; color: ${({ theme }) => theme.colors.mute};`;

const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  gap: 40px;
  @media (max-width: 760px) { flex-direction: column; }
`;

const Sidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 26px;
  @media (max-width: 760px) { width: 100%; }
`;

const SidebarTitle = styled.h2`font-size: 16px; font-weight: 700;`;
const SearchBox = styled.div`position: relative;`;
const SearchInput = styled.input`
  width: 100%; height: 40px; padding: 0 34px 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceCard};
  &:focus { outline: 2px solid ${({ theme }) => theme.colors.surfaceLight}; border-color: ${({ theme }) => theme.colors.primary}; }
`;
const SearchIcon = styled.span`position: absolute; right: 12px; top: 8px; color: ${({ theme }) => theme.colors.ash};`;
const FilterGroup = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const FilterLabel = styled.span`font-size: 13px; font-weight: 700;`;
const ChipGroup = styled.div`display: flex; flex-wrap: wrap; gap: 7px;`;
const Chip = styled.button<{ $active: boolean }>`
  padding: 6px 11px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 12px;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.charcoal)};
  background: ${({ $active, theme }) => ($active ? theme.colors.surfaceLight : theme.colors.surfaceCard)};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.dividerSoft)};
`;

const ContentArea = styled.main`flex: 1; min-width: 0;`;
const TopHeader = styled.div`display: flex; justify-content: space-between; gap: 20px; margin-bottom: 30px;`;
const MainTitle = styled.h1`font-size: 40px; font-weight: 800; letter-spacing: -1px;`;
const SubTitle = styled.p`font-size: 14px; color: ${({ theme }) => theme.colors.mute}; margin-top: 6px;`;
const CreateButton = styled.button`
  align-self: center; padding: 10px 18px; border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primaryOn}; font-weight: 700;
`;

const CardGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

const SongCard = styled.button`
  text-align: left; padding: 16px; border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  border-radius: 16px; background: ${({ theme }) => theme.colors.surfaceCard};
  transition: transform .2s ease, box-shadow .2s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,.06); }
`;
const CoverWrapper = styled.div`aspect-ratio: 16 / 9; overflow: hidden; border-radius: 11px; margin-bottom: 15px; background: #eef2f7;`;
const CoverImg = styled.img`width: 100%; height: 100%; object-fit: cover;`;
const SongTitle = styled.h3`font-size: 16px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`;
const ArtistName = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.mute}; margin: 4px 0 14px;`;
const CardMeta = styled.div`display: flex; justify-content: space-between; align-items: center;`;
const DifficultyBadge = styled.span<{ $color: string }>`font-size: 11px; font-weight: 700; color: ${({ $color }) => $color};`;
const LineCount = styled.span`font-size: 11px; color: ${({ theme }) => theme.colors.ash};`;
const StatusMessage = styled.div`padding: 80px 20px; text-align: center; color: ${({ theme }) => theme.colors.mute};`;
const ErrorMessage = styled.div`padding: 12px 14px; margin-bottom: 18px; border-radius: 8px; color: #b91c1c; background: #fef2f2;`;
const LoadMoreButton = styled.button`
  display: block; margin: 36px auto 0; padding: 10px 24px;
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong}; border-radius: ${({ theme }) => theme.radii.full};
  &:disabled { opacity: .55; }
`;

export default SongSelectPage;
