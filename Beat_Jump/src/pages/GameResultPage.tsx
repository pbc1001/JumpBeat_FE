// 1. Import 문
import React from 'react';
import styled from '@emotion/styled';
import LogoSvg from '../assets/Logo.svg';

// 2. 컴포넌트 로직
const GameResultPage = () => {
  const resultData = {
    title: '너의 모든 가능성이 되어줄게',
    artist: 'TWS(투어스)',
    difficulty: 'HARD',
    accuracy: 99.4,
    wpm: 124,
    typos: 3,
    playTime: '02:45',
    rank: 'S',
    score: '2,485,900',
    judgement: {
      perfect: 1245,
      great: 142,
      good: 24,
      miss: 3,
    },
  };

  return (
    <PageWrapper>
      {/* 상단 네비게이션 헤더 */}
      <Header>
        <HeaderContainer>
          <LogoImage src={LogoSvg} alt="최애의 타자" />
          <NavGroup>
            <NavLink href="#play" active>
              Play
            </NavLink>
            <NavLink href="#create">Create</NavLink>
            <NavLink href="#leaderboard">Leaderboard</NavLink>
          </NavGroup>
          <HeaderAuth>
            <LoginButton href="#login">Sign In</LoginButton>
            <StartHeaderButton >Get Started</StartHeaderButton>
          </HeaderAuth>
        </HeaderContainer>
      </Header>

      <MainContainer>
        {/* 상단 축하 타이틀 */}
        <HeaderSection>
          <MainTitle>{resultData.title} 성공!</MainTitle>
          <SubTitle>정말 대단한 연주였어요!</SubTitle>
        </HeaderSection>

        {/* 결과 그리드 레이아웃 */}
        <ContentGrid>
          {/* 좌측: 트랙 커버 카드 */}
          <CoverCard>
            <CoverImageWrapper>
              <CoverLogo src={LogoSvg} alt="Track Cover" />
            </CoverImageWrapper>
            <TrackTitle>{resultData.title}</TrackTitle>
            <TrackArtist>{resultData.artist}</TrackArtist>
            <DifficultyTag>🎵 {resultData.difficulty}</DifficultyTag>
          </CoverCard>

          {/* 우측 영역 (상단 통계 & 랭크 카드 + 하단 판정 요약) */}
          <RightSection>
            <StatsGrid>
              {/* 통계 지표 카드 */}
              <StatCard>
                <StatItem>
                  <StatLabel>정확도</StatLabel>
                  <StatValue color="#0066ff">{resultData.accuracy}%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>타수 (WPM)</StatLabel>
                  <StatValue>{resultData.wpm}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>오타 수</StatLabel>
                  <StatValue color="#ef4444">{resultData.typos}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>소요 시간</StatLabel>
                  <StatValue>{resultData.playTime}</StatValue>
                </StatItem>
              </StatCard>

              {/* 랭크 & 점수 카드 */}
              <RankCard>
                <RankBadgeWrapper>
                  <RankText>{resultData.rank}</RankText>
                  <BadgeRibbon>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </BadgeRibbon>
                </RankBadgeWrapper>
                <ScoreGroup>
                  <ScoreLabel>최종 점수</ScoreLabel>
                  <ScoreValue>{resultData.score}</ScoreValue>
                </ScoreGroup>
              </RankCard>
            </StatsGrid>

            {/* 하단: 판정 요약 카드 */}
            <JudgementCard>
              <JudgementTitle>판정 요약</JudgementTitle>

              {/* 판정 비율 프로그레스 바 */}
              <BarContainer>
                <BarSegment width={85} bg="#0066ff" />
                <BarSegment width={10} bg="#06b6d4" />
                <BarSegment width={3} bg="#22c55e" />
                <BarSegment width={2} bg="#ef4444" />
              </BarContainer>

              {/* 판정 범주 지표 */}
              <JudgementLegend>
                <LegendItem>
                  <Dot bg="#0066ff" />
                  <LegendLabel>Perfect</LegendLabel>
                  <LegendValue>{resultData.judgement.perfect.toLocaleString()}</LegendValue>
                </LegendItem>
                <LegendItem>
                  <Dot bg="#06b6d4" />
                  <LegendLabel>Great</LegendLabel>
                  <LegendValue>{resultData.judgement.great.toLocaleString()}</LegendValue>
                </LegendItem>
                <LegendItem>
                  <Dot bg="#22c55e" />
                  <LegendLabel>Good</LegendLabel>
                  <LegendValue>{resultData.judgement.good.toLocaleString()}</LegendValue>
                </LegendItem>
                <LegendItem>
                  <Dot bg="#ef4444" />
                  <LegendLabel>Miss</LegendLabel>
                  <LegendValue>{resultData.judgement.miss.toLocaleString()}</LegendValue>
                </LegendItem>
              </JudgementLegend>
            </JudgementCard>
          </RightSection>
        </ContentGrid>

        {/* 하단 버턴 영역 */}
        <ActionRow>
          <RetryButton>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            다시 하기
          </RetryButton>
          <SelectSongButton>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            다른 곡 선택
          </SelectSongButton>
        </ActionRow>
      </MainContainer>

      {/* 푸터 */}
      <Footer>
        <FooterContainer>
          <FooterLogo src={LogoSvg} alt="최애의 타자" />
          <FooterLinks>
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
            <a href="#discord">Discord</a>
            <a href="#support">Support</a>
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
  background-color: #f8fafc;
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
  max-width: 1120px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 24px;
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const MainTitle = styled.h1`
  font-size: 48px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.ink};
  letter-spacing: -1px;
  font-family: 'serif', sans-serif;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.mute};
  margin-top: 8px;
  font-weight: 500;
`;

const ContentGrid = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;

  @media (max-width: 840px) {
    flex-direction: column;
  }
`;

const CoverCard = styled.div`
  width: 280px;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  flex-shrink: 0;

  @media (max-width: 840px) {
    width: 100%;
  }
`;

const CoverImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 30px;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.6);
`;

const CoverLogo = styled.img`
  width: 100%;
  max-height: 80px;
  object-fit: contain;
  opacity: 0.8;
`;

const TrackTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
  text-align: center;
`;

const TrackArtist = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.mute};
  margin-top: 4px;
  margin-bottom: 16px;
  text-align: center;
`;

const DifficultyTag = styled.span`
  padding: 6px 14px;
  background-color: #f1f5f9;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.charcoal};
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatsGrid = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const StatCard = styled.div`
  flex: 1.4;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  border-radius: 20px;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ash};
`;

const StatValue = styled.span<{ color?: string }>`
  font-size: 22px;
  font-weight: 800;
  color: ${({ color, theme }) => color || theme.colors.ink};
`;

const RankCard = styled.div`
  flex: 1;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
`;

const RankBadgeWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const RankText = styled.span`
  font-size: 56px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
`;

const BadgeRibbon = styled.div`
  position: absolute;
  top: -6px;
  right: -24px;
`;

const ScoreGroup = styled.div`
  text-align: center;
`;

const ScoreLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ash};
  display: block;
`;

const ScoreValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
`;

const JudgementCard = styled.div`
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
`;

const JudgementTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: 16px;
`;

const BarContainer = styled.div`
  width: 100%;
  height: 12px;
  background-color: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  margin-bottom: 20px;
`;

const BarSegment = styled.div<{ width: number; bg: string }>`
  width: ${({ width }) => width}%;
  height: 100%;
  background-color: ${({ bg }) => bg};
`;

const JudgementLegend = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 500px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.span<{ bg: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ bg }) => bg};
`;

const LegendLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.charcoal};
`;

const LegendValue = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
  margin-left: 8px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 40px;
`;

const RetryButton = styled.button`
  padding: 14px 32px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(0, 102, 255, 0.3);
`;

const SelectSongButton = styled.button`
  padding: 14px 28px;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  color: ${({ theme }) => theme.colors.ink};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #f8fafc;
  }
`;

const Footer = styled.footer`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  padding: 32px 0;
  margin-top: auto;
`;

const FooterContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export default GameResultPage;