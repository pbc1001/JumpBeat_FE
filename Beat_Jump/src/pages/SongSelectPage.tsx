// 1. Import 문
import { useState } from 'react';
import styled from '@emotion/styled';
import LogoSvg from '../assets/Logo.svg';

// 2. 컴포넌트 로직
const SongSelectPage = () => {
  const [selectedLang, setSelectedLang] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const dummySongs = [
    { id: 1, title: 'Electric Love', artist: 'Synth Wave Project', level: '보통', color: '#10b981' },
    { id: 2, title: 'Late Night City', artist: 'Haze Collective', level: '어려움', color: '#ef4444' },
    { id: 3, title: 'Morning Dew', artist: 'Vocal Aura', level: '쉬움', color: '#3b82f6' },
    { id: 4, title: 'After Image', artist: 'The Glitch', level: '보통', color: '#10b981' },
    { id: 5, title: 'Vibrate', artist: 'Freq Master', level: '어려움', color: '#ef4444' },
  ];

  return (
    <PageWrapper>
      {/* 상단 네비게이션 헤더 */}
      <Header>
        <HeaderContainer>
          <LogoImage src={LogoSvg} alt="최애의 타자" />
          <NavGroup>
            <NavLink href="#play" active>플레이</NavLink>
            <NavLink href="#create">제작</NavLink>
            <NavLink href="#leaderboard">리더보드</NavLink>
          </NavGroup>
          <HeaderAuth>
            <LoginButton href="#login">로그인</LoginButton>
            <StartHeaderButton >시작하기</StartHeaderButton>
          </HeaderAuth>
        </HeaderContainer>
      </Header>

      <MainContainer>
        {/* 좌측 필터 사이드바 */}
        <Sidebar>
          <SidebarTitle>필터</SidebarTitle>

          {/* 검색 */}
          <SearchBox>
            <SearchInput
              placeholder="곡 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </SearchIcon>
          </SearchBox>

          {/* 언어 */}
          <FilterGroup>
            <FilterLabel>언어</FilterLabel>
            <ChipGroup>
              {['전체', '영어', '한국어', '일본어'].map((lang) => (
                <Chip
                  key={lang}
                  active={selectedLang === lang}
                  onClick={() => setSelectedLang(lang)}
                >
                  {lang}
                </Chip>
              ))}
            </ChipGroup>
          </FilterGroup>

          {/* 난이도 */}
          <FilterGroup>
            <FilterLabel>난이도</FilterLabel>
            <CheckboxList>
              <CheckboxItem><input type="checkbox" /> 쉬움</CheckboxItem>
              <CheckboxItem><input type="checkbox" defaultChecked /> 보통</CheckboxItem>
              <CheckboxItem><input type="checkbox" /> 어려움</CheckboxItem>
            </CheckboxList>
          </FilterGroup>

          {/* 보컬 파트 */}
          <FilterGroup>
            <FilterLabel>보컬 파트</FilterLabel>
            <RadioList>
              <RadioItem><input type="radio" name="vocal" defaultChecked /> 전체 앙상블</RadioItem>
              <RadioItem><input type="radio" name="vocal" /> 솔로 포커스</RadioItem>
            </RadioList>
          </FilterGroup>
        </Sidebar>

        {/* 우측 중앙 메인 라이브러리 */}
        <ContentArea>
          <TopHeader>
            <div>
              <MainTitle>Pick Your Beat.</MainTitle>
              <SubTitle>당신의 리듬 도전을 위한 라이브러리를 탐색하세요.</SubTitle>
            </div>
            <ViewToggle>
              <IconButton active>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
                </svg>
              </IconButton>
              <IconButton>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z" />
                </svg>
              </IconButton>
            </ViewToggle>
          </TopHeader>

          {/* 곡 카드 그리드 */}
          <CardGrid>
            {dummySongs.map((song) => (
              <SongCard key={song.id}>
                <CoverWrapper>
                  <CoverImg src={LogoSvg} alt={song.title} />
                </CoverWrapper>
                <SongTitle>{song.title}</SongTitle>
                <ArtistName>{song.artist}</ArtistName>
                <DifficultyBadge color={song.color}>
                  ◆ {song.level}
                </DifficultyBadge>
              </SongCard>
            ))}

            {/* 세기의 비트 특수 배너 카드 */}
            <FeaturedCard>
              <FeaturedBadge>위클리 픽</FeaturedBadge>
              <FeaturedTitle>세기의 비트</FeaturedTitle>
              <FeaturedDesc>리듬 엘리트를 위한 궁극의 타이핑 베스트</FeaturedDesc>
              <FeaturedFooter>
                <BpmBadge>★ 180 BPM</BpmBadge>
                <ChallengeButton>도전하기</ChallengeButton>
              </FeaturedFooter>
            </FeaturedCard>
          </CardGrid>

          <LoadMoreWrapper>
            <CountText>124개 중 6개 표시 중</CountText>
            <LoadMoreButton>곡 더보기 ∨</LoadMoreButton>
          </LoadMoreWrapper>
        </ContentArea>
      </MainContainer>

      {/* 푸터 */}
      <Footer>
        <FooterContainer>
          <FooterLogo src={LogoSvg} alt="최애의 타자" />
          <FooterLinks>
            <a href="#terms">이용약관</a>
            <a href="#privacy">개인정보 처리방침</a>
            <a href="#discord">디스코드</a>
            <a href="#support">고객지원</a>
          </FooterLinks>
        </FooterContainer>
      </Footer>
    </PageWrapper>
  );
};

// 3. Emotion Styled 정의
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.canvas};
`;

const Header = styled.header`
  width: 100%;
  height: 64px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  z-index: 100;
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 100px;
`;

const NavGroup = styled.nav`
  display: flex;
  gap: 24px;
`;

const NavLink = styled.a<{ active?: boolean }>`
  font-size: 14px;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.charcoal)};
`;

const HeaderAuth = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LoginButton = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.charcoal};
`;

const StartHeaderButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryOn};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 13px;
  font-weight: 600;
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  gap: 40px;

  @media (max-width: 868px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const SidebarTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 32px 0 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.ash};
  display: flex;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 12px;
  background-color: ${({ active, theme }) => (active ? theme.colors.surfaceLight : theme.colors.surfaceCard)};
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.charcoal)};
  border: 1px solid ${({ active, theme }) => (active ? theme.colors.hairlineStrong : 'transparent')};
  font-weight: ${({ active }) => (active ? '600' : '400')};
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxItem = styled.label`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.charcoal};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const RadioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioItem = styled.label`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.charcoal};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ContentArea = styled.main`
  flex: 1;
`;

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const MainTitle = styled.h1`
  font-size: 40px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
  letter-spacing: -1px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mute};
  margin-top: 6px;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const IconButton = styled.button<{ active?: boolean }>`
  padding: 6px;
  border-radius: 4px;
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.ash)};
  background-color: ${({ active, theme }) => (active ? theme.colors.canvas : 'transparent')};
  box-shadow: ${({ active }) => (active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none')};
  display: flex;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SongCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  }
`;

const CoverWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const SongTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const ArtistName = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mute};
  margin-top: 4px;
  margin-bottom: 16px;
`;

const DifficultyBadge = styled.span<{ color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FeaturedCard = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 16px;
  padding: 24px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FeaturedBadge = styled.span`
  align-self: flex-start;
  padding: 4px 8px;
  background-color: #0066ff;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
`;

const FeaturedTitle = styled.h3`
  font-size: 24px;
  font-weight: 800;
  margin-top: 16px;
`;

const FeaturedDesc = styled.p`
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
  line-height: 1.4;
`;

const FeaturedFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`;

const BpmBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #38bdf8;
`;

const ChallengeButton = styled.button`
  padding: 8px 16px;
  background-color: #ffffff;
  color: #0f172a;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 12px;
  font-weight: 700;
`;

const LoadMoreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 48px;
`;

const CountText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ash};
`;

const LoadMoreButton = styled.button`
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  background-color: ${({ theme }) => theme.colors.canvas};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
`;

const Footer = styled.footer`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  padding: 32px 0;
  margin-top: 60px;
`;

const FooterContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const FooterLogo = styled.img`
  height: 20px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.ash};

    &:hover {
      color: ${({ theme }) => theme.colors.ink};
    }
  }
`;

// 4. Export Default
export default SongSelectPage;