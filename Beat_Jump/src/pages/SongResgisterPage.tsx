// 1. Import 문
import React, { useState } from 'react';
import styled from '@emotion/styled';
import LogoSvg from '../assets/Logo.svg';

// 2. 컴포넌트 로직
const SongRegisterPage = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 싱크 에디터 이동 로직 처리
  };

  return (
    <PageWrapper>
      {/* 상단 네비게이션 헤더 */}
      <Header>
        <HeaderContainer>
          <LogoImage src={LogoSvg} alt="최애의 타자" />
          <NavGroup>
            <NavLink href="#play">플레이</NavLink>
            <NavLink href="#create" active>제작하기</NavLink>
            <NavLink href="#leaderboard">리더보드</NavLink>
          </NavGroup>
          <HeaderAuth>
            <LoginButton href="#login">로그인</LoginButton>
            <StartHeaderButton>시작하기</StartHeaderButton>
          </HeaderAuth>
        </HeaderContainer>
      </Header>

      <MainContainer>
        <FormSection>
          {/* 브레드크럼 */}
          <Breadcrumb>
            <span>🎵 크리에이터 스튜디오</span>
            <span>›</span>
            <span className="active">새 곡</span>
          </Breadcrumb>

          {/* 메인 타이틀 */}
          <PageTitle>새 곡 등록</PageTitle>
          <PageSubtitle>
            좋아하는 리듬을 키보드로 가져오세요. 동기화 과정을 시작하기 위해 메타데이터와 가사를 입력해주세요.
          </PageSubtitle>

          {/* 곡 등록 폼 */}
          <Form onSubmit={handleSubmit}>
            {/* YouTube URL */}
            <FormGroup>
              <Label>YouTube URL</Label>
              <InputWrapper>
                <InputIcon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </InputIcon>
                <Input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </InputWrapper>
              <HelperText>YouTube 동영상의 원본 링크를 입력해 주세요.</HelperText>
            </FormGroup>

            {/* 곡 제목 & 아티스트 (2열 배치) */}
            <RowGrid>
              <FormGroup>
                <Label>곡 제목</Label>
                <Input
                  type="text"
                  placeholder="예: Moonlight Sonata"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>아티스트</Label>
                <Input
                  type="text"
                  placeholder="예: Ludwig van Beethoven"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />
              </FormGroup>
            </RowGrid>

            {/* 가사 입력 */}
            <FormGroup>
              <Label>가사</Label>
              <TextArea
                placeholder="여기에 가사를 붙여넣으세요. 줄바꿈을 사용하여 구절을 구분하세요..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
              />
            </FormGroup>

            {/* 정보 안내 박스 */}
            <InfoBanner>
              <InfoIcon>ⓘ</InfoIcon>
              <span>등록된 곡은 모든 사용자에게 공개됩니다. 저작권 침해 요소가 없도록 주의해주세요.</span>
            </InfoBanner>

            {/* 하단 액션 버튼 */}
            <ActionRow>
              <BackButton type="button">← 취소 및 돌아가기</BackButton>
              <SubmitButton type="submit">
                싱크 작업 시작 →
              </SubmitButton>
            </ActionRow>
          </Form>
        </FormSection>

        {/* 우측 데이터 미리보기 안내 플로팅 카드 */}
        <SidebarArea>
          <PreviewCard>
            <CardVideoBox>
              <WindowControls>
                <Dot bg="#ff5f56" />
                <Dot bg="#ffbd2e" />
                <Dot bg="#27c93f" />
              </WindowControls>
              <PlayIconCircle>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </PlayIconCircle>
            </CardVideoBox>

            <CardBody>
              <CardTitle>미디어 미리보기</CardTitle>
              <CardDesc>
                왼쪽 입력창에 유효한 YouTube 동영상 URL을 입력하면 동영상이 이 영역에 제대로 불러와지는지 확인해주세요.
              </CardDesc>

              <ProgressStatus>
                <ProgressFill />
              </ProgressStatus>
              <StatusRow>
                <span>URL 검증</span>
                <StatusTag>대기 중</StatusTag>
              </StatusRow>
            </CardBody>
          </PreviewCard>
        </SidebarArea>
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
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  gap: 48px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const FormSection = styled.div`
  flex: 1;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ash};
  margin-bottom: 20px;

  .active {
    color: ${({ theme }) => theme.colors.ink};
    font-weight: 600;
  }
`;

const PageTitle = styled.h1`
  font-size: 40px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
  letter-spacing: -1px;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mute};
  margin-top: 10px;
  margin-bottom: 36px;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.ash};
  display: flex;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  padding-left: ${({ placeholder }) => (placeholder?.includes('http') ? '42px' : '14px')};
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HelperText = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.ash};
`;

const RowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 180px;
  padding: 14px;
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  line-height: 1.6;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background-color: #f0f6ff;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.charcoal};
`;

const InfoIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const BackButton = styled.button`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mute};
  background: none;

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const SubmitButton = styled.button`
  padding: 12px 28px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryOn};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 14px;
  font-weight: 700;
`;

const SidebarArea = styled.aside`
  width: 280px;
  flex-shrink: 0;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const PreviewCard = styled.div`
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
`;

const CardVideoBox = styled.div`
  width: 100%;
  height: 150px;
  background-color: #0f172a;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const WindowControls = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
`;

const Dot = styled.span<{ bg: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ bg }) => bg};
`;

const PlayIconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardBody = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const CardDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mute};
  margin-top: 6px;
  line-height: 1.5;
`;

const ProgressStatus = styled.div`
  width: 100%;
  height: 4px;
  background-color: #f1f5f9;
  border-radius: 2px;
  margin-top: 20px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: 30%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.ash};
`;

const StatusTag = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.mute};
`;

const Footer = styled.footer`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  padding: 32px 0;
  margin-top: auto;
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
export default SongRegisterPage;