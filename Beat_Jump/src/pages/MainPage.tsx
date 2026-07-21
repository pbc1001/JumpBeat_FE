import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import LogoSvg from "../assets/Logo.svg";
import { useAuth } from "../auth/useAuth";

const MainPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <PageWrapper>
      <Header>
        <HeaderContainer>
          <LogoImage src={LogoSvg} alt="최애의 타자" />
          <NavGroup>
            <NavLink href="#play" active>
              플레이
            </NavLink>
            <NavLink href="/selectsong">곡 목록</NavLink>
          </NavGroup>
          <HeaderAuth>
            <UserName>{user?.nickname}</UserName>
            <LogoutButton type="button" onClick={handleLogout}>로그아웃</LogoutButton>
            <StartHeaderButton type="button" onClick={() => navigate("/selectsong")}>시작하기</StartHeaderButton>
          </HeaderAuth>
        </HeaderContainer>
      </Header>

      <MainContent>
        {/* 히어로 섹션 */}
        <HeroSection>
          <HeroTitle>
            비트에 맞춰{" "}
            <span>
              타이핑하세
              <br />
              요.
            </span>
          </HeroTitle>

          <HeroSubtitle>
            좋아하는 음악의 리듬에 맞춰 키보드를 마스터하세요. 고성능 타이핑과
            리듬이 있는 명쾌한
            <br />이 만남! 새로운 에디토리얼 환경입니다.
          </HeroSubtitle>

          <SearchWrapper>
            <SearchIcon>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </SearchIcon>
            <SearchInput placeholder="트랙, 아티스트 또는 장르 검색..." />
            <SearchButton>지금 플레이</SearchButton>
          </SearchWrapper>
        </HeroSection>

        {/* 추천 트랙 섹션 */}
        <SectionContainer>
          <SectionHeader>
            <div>
              <SectionTitle>추천 트랙</SectionTitle>
              <SectionSubtitle>
                타자 연습을 시작할 곡을 골라보세요.
              </SectionSubtitle>
            </div>
            <MoreLink href="/selectsong">전체 곡 보기 →</MoreLink>
          </SectionHeader>

          <TrackGrid>
            {/* 대형 트랙 카드 1 */}
            <BigTrackCard>
              <div>
                <BadgeGroup>
                  <Badge>K-POP</Badge>
                  <SubBadge>추천</SubBadge>
                </BadgeGroup>
                <TrackName>Ditto</TrackName>
                <ArtistName>NewJeans</ArtistName>
              </div>
              <BarGraphic>
                <Bar height="30%" />
                <Bar height="70%" />
                <Bar height="50%" />
              </BarGraphic>
            </BigTrackCard>

            {/* 대형 트랙 카드 2 (커버 이미지 포함) */}
            <CoverTrackCard>
              <CoverImage src={LogoSvg} alt="Ditto Cover" />
              <CoverTrackInfo>
                <BadgeGroup>
                  <Badge>K-POP</Badge>
                </BadgeGroup>
                <TrackNameSm>Idol</TrackNameSm>
                <ArtistNameSm>YOASOBI</ArtistNameSm>
                <BpmTag>160 BPM</BpmTag>
              </CoverTrackInfo>
            </CoverTrackCard>
          </TrackGrid>

          {/* 소형 트랙 리스트 */}
          <SmallTrackGrid>
            <SmallTrackCard>
              <SmallTrackLogo src={LogoSvg} alt="Track logo" />
              <div>
                <SmallTrackName>Super Shy</SmallTrackName>
                <SmallArtistName>NewJeans</SmallArtistName>
              </div>
              <ArrowIcon>›</ArrowIcon>
            </SmallTrackCard>

            <SmallTrackCard>
              <SmallTrackLogo src={LogoSvg} alt="Track logo" />
              <div>
                <SmallTrackName>Seven</SmallTrackName>
                <SmallArtistName>Jung Kook</SmallArtistName>
              </div>
              <ArrowIcon>›</ArrowIcon>
            </SmallTrackCard>

            <SmallTrackCard>
              <SmallTrackLogo src={LogoSvg} alt="Track logo" />
              <div>
                <SmallTrackName>Spicy</SmallTrackName>
                <SmallArtistName>aespa</SmallArtistName>
              </div>
              <ArrowIcon>›</ArrowIcon>
            </SmallTrackCard>
          </SmallTrackGrid>
        </SectionContainer>

        {/* 플레이 화면 데모 프리뷰 */}
        <PreviewSection>
          <DemoWindow>
            <DemoHeader>
              <WindowButtons>
                <Dot bg="#ff5f56" />
                <Dot bg="#ffbd2e" />
                <Dot bg="#27c93f" />
              </WindowButtons>
              <DemoHeaderTitle>BEATTYPING 연습 모드</DemoHeaderTitle>
            </DemoHeader>

            <DemoBody>
              <DemoTrackInfo>현재 재생 중: NEWJEANS - DITTO</DemoTrackInfo>
              <ProgressBar>
                <ProgressFill />
              </ProgressBar>

              <LyricDisplay>
                <LyricRow>
                  Hoxy <ActiveWord>naega</ActiveWord>
                </LyricRow>
                <LyricRowDimmed>byeonhaessda haedo</LyricRowDimmed>
              </LyricDisplay>

              <StatsRow>
                <StatItem>
                  <StatLabel>정확도</StatLabel>
                  <StatValue>98.4%</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>WPM</StatLabel>
                  <StatValue>112</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>콤보</StatLabel>
                  <StatValueHighlight>247X</StatValueHighlight>
                </StatItem>
              </StatsRow>
            </DemoBody>
          </DemoWindow>
        </PreviewSection>

        {/* 하단 CTA 섹션 */}
        <CtaSection>
          <CtaTitle>싱크를 맞출 준비가 되셨나요?</CtaTitle>
          <CtaButtonGroup>
            <PrimaryCtaButton>무료 계정 만들기</PrimaryCtaButton>
            <SecondaryCtaButton>게스트로 플레이하기</SecondaryCtaButton>
          </CtaButtonGroup>
        </CtaSection>
      </MainContent>

      {/* 푸터 (로그인 화면과 동일) */}
      <Footer>
        <div>
          © 2024 <strong style={{ color: "#0066ff" }}>최애의 타자</strong>.
          Precision in every keystroke.
        </div>
        <FooterLinks>
          <a href="#terms">Terms</a>
          <a href="#privacy">Privacy</a>
          <a href="#support">Support</a>
          <a href="#discord">Discord</a>
        </FooterLinks>
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
  background-color: rgba(255, 255, 255, 0.85);
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
  width: 100px;
`;

const NavGroup = styled.nav`
  display: flex;
  gap: 24px;
`;

const NavLink = styled.a<{ active?: boolean }>`
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.charcoal};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeaderAuth = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.charcoal};
`;

const LogoutButton = styled.button`
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

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroSection = styled.section`
  width: 100%;
  max-width: 800px;
  padding: 80px 24px 60px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroTitle = styled.h1`
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -1.5px;
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: 20px;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeroSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.mute};
  line-height: 1.6;
  margin-bottom: 36px;
`;

const SearchWrapper = styled.div`
  width: 100%;
  max-width: 520px;
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 18px;
  color: ${({ theme }) => theme.colors.ash};
  display: flex;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 120px 0 48px;
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surfaceLight};
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 6px;
  height: 40px;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryOn};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 13px;
  font-weight: 600;
`;

const SectionContainer = styled.section`
  width: 100%;
  max-width: 1040px;
  padding: 40px 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
`;

const SectionSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.mute};
  margin-top: 4px;
`;

const MoreLink = styled.a`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const TrackGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BigTrackCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e0edff 100%);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  min-height: 220px;
`;

const BadgeGroup = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
`;

const Badge = styled.span`
  padding: 4px 8px;
  background-color: rgba(0, 102, 255, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
`;

const SubBadge = styled.span`
  padding: 4px 8px;
  background-color: rgba(15, 23, 42, 0.06);
  color: ${({ theme }) => theme.colors.charcoal};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

const TrackName = styled.h3`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
`;

const ArtistName = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mute};
  margin-top: 4px;
`;

const BarGraphic = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  height: 80px;
  width: 60px;
`;

const Bar = styled.div<{ height: string }>`
  flex: 1;
  height: ${({ height }) => height};
  background-color: rgba(0, 102, 255, 0.2);
  border-radius: 4px;
`;

const CoverTrackCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: contain;
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 20px;
`;

const CoverTrackInfo = styled.div`
  width: 100%;
  margin-top: 16px;
  position: relative;
`;

const TrackNameSm = styled.h4`
  font-size: 18px;
  font-weight: 700;
`;

const ArtistNameSm = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mute};
`;

const BpmTag = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 11px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  padding: 4px 8px;
  border-radius: 4px;
`;

const SmallTrackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SmallTrackCard = styled.div`
  background-color: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const SmallTrackLogo = styled.img`
  width: 36px;
  height: 36px;
  padding: 6px;
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  border-radius: 50%;
`;

const SmallTrackName = styled.h5`
  font-size: 14px;
  font-weight: 700;
`;

const SmallArtistName = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.mute};
`;

const ArrowIcon = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.ash};
  font-size: 18px;
`;

const PreviewSection = styled.section`
  width: 100%;
  max-width: 900px;
  padding: 60px 24px;
  display: flex;
  justify-content: center;
`;

const DemoWindow = styled.div`
  width: 100%;
  background-color: #0f172a;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const DemoHeader = styled.div`
  padding: 16px 20px;
  background-color: #1e293b;
  display: flex;
  align-items: center;
  position: relative;
`;

const WindowButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Dot = styled.span<{ bg: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ bg }) => bg};
`;

const DemoHeaderTitle = styled.span`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
`;

const DemoBody = styled.div`
  padding: 48px 32px;
  text-align: center;
  color: #ffffff;
`;

const DemoTrackInfo = styled.p`
  font-size: 12px;
  letter-spacing: 1px;
  color: #38bdf8;
  font-weight: 700;
  margin-bottom: 12px;
`;

const ProgressBar = styled.div`
  width: 240px;
  height: 4px;
  background-color: #334155;
  border-radius: 2px;
  margin: 0 auto 40px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: 45%;
  height: 100%;
  background-color: #0066ff;
`;

const LyricDisplay = styled.div`
  margin-bottom: 48px;
`;

const LyricRow = styled.h3`
  font-size: 36px;
  font-weight: 700;
  color: #94a3b8;
`;

const ActiveWord = styled.span`
  color: #ffffff;
  background-color: #0066ff;
  padding: 2px 8px;
  border-radius: 4px;
`;

const LyricRowDimmed = styled.p`
  font-size: 28px;
  color: #475569;
  margin-top: 12px;
  font-weight: 600;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.span`
  font-size: 11px;
  color: #64748b;
`;

const StatValue = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

const StatValueHighlight = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #38bdf8;
`;

const CtaSection = styled.section`
  padding: 60px 24px 100px;
  text-align: center;
`;

const CtaTitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: 28px;
`;

const CtaButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const PrimaryCtaButton = styled.button`
  padding: 14px 28px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryOn};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 15px;
  font-weight: 600;
`;

const SecondaryCtaButton = styled.button`
  padding: 14px 28px;
  background-color: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.stone};
  color: ${({ theme }) => theme.colors.ink};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 15px;
  font-weight: 600;
`;

const Footer = styled.footer`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ash};

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 16px;

  a:hover {
    color: ${({ theme }) => theme.colors.ink};
  }
`;

// 4. Export Default
export default MainPage;
