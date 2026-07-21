// 1. Import 문
import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import LogoSvg from '../assets/Logo.svg';

// 가상 연습 데이터 (가사 목록)
const MOCK_LYRICS = [
    'Im crazy about you',
  '원하는걸 다 시험해봐',
  'All on me',
  '되어 줄게 너의 all the possibility',
  '이 감정을 더 알고 싶어',
  'Im falling for',
  'all the possibility',
];

// 2. 컴포넌트 로직
const TypingPracticePage = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(1); 
  const [userInput, setUserInput] = useState<string>('');
  
  // 실시간 스탯
  const [wpm, setWpm] = useState<number>(84);
  const [accuracy] = useState<number>(98.2);
  const [combo, setCombo] = useState<number>(142);
  const [isBgVideoOn, setIsBgVideoOn] = useState<boolean>(true);

  // "야호!" 애니메이션 효과 상태
  const [cheers, setCheers] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // 현재 타겟 문장
  const currentTarget = MOCK_LYRICS[currentIndex] || '';
  const prevTarget = MOCK_LYRICS[currentIndex - 1] || '';
  const nextTargets = MOCK_LYRICS.slice(currentIndex + 1, currentIndex + 3);

  // 진행률 계산
  const progressPercent = Math.round(((currentIndex + 1) / MOCK_LYRICS.length) * 100);

  // 자동 포커스 유지
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  // 문장 완료 처리 함수
  const handleSentenceComplete = () => {
    if (userInput.trim() === '') return;

    // "야호!" 팝업 텍스트 생성
    const newCheer = {
      id: Date.now(),
      text: userInput.trim() === currentTarget ? '야호! PERFECT! 🎉' : '성공! ✨',
      x: Math.random() * 80 + 10, // 위치 난수
      y: 40 + Math.random() * 20,
    };
    setCheers((prev) => [...prev, newCheer]);

    // 콤보 및 타수 증가
    setCombo((prev) => prev + 1);
    setWpm((prev) => Math.min(prev + Math.floor(Math.random() * 3) + 1, 250));

    // 다음 문장으로 이동
    if (currentIndex < MOCK_LYRICS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 마지막 문장 달성 시 처음으로 리셋
      setCurrentIndex(0);
    }

    setUserInput('');
  };

  // 키 입력 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSentenceComplete();
    }
  };

  // 실시간 입력값 상태 변경 & 자동 다음 문장 넘어감 체크
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);

    // 완전 일치 시 즉시 제출 원할 경우 (주석 해제 시 자동 넘어감)
    if (val === currentTarget) {
      setTimeout(() => {
        handleSentenceComplete();
      }, 150);
    }
  };

  // 3초 후 "야호!" 이펙트 제거
  const handleAnimationEnd = (id: number) => {
    setCheers((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <PageWrapper onClick={() => inputRef.current?.focus()}>
      {/* 상단 네비게이션 헤더 */}
      <Header>
        <HeaderContainer>
          <LogoImage src={LogoSvg} alt="최애의 타자" />
          <NavGroup>
            <NavLink href="#play" active>
              플레이 중
            </NavLink>
            <NavLink href="#create">제작하기</NavLink>
            <NavLink href="#leaderboard">리더보드</NavLink>
          </NavGroup>
          <HeaderAuth>
            <LoginButton href="#login">로그인</LoginButton>
            <StartHeaderButton>시작하기</StartHeaderButton>
          </HeaderAuth>
        </HeaderContainer>
      </Header>

      {/* 상단 스탯 대시보드 바 */}
      <DashboardBar>
        <DashboardContainer>
          <StatGroup>
            <StatItem>
              <StatLabel>속도 (WPM)</StatLabel>
              <StatValue>{wpm}</StatValue>
            </StatItem>
            <Divider />
            <StatItem>
              <StatLabel>정확도</StatLabel>
              <StatValue color="#22c55e">{accuracy}%</StatValue>
            </StatItem>
            <Divider />
            <StatItem>
              <StatLabel>콤보</StatLabel>
              <StatValue color="#0066ff">{combo}</StatValue>
            </StatItem>
          </StatGroup>

          <RightInfoGroup>
            <TrackInfo>
              <TrackLabel>현재 곡</TrackLabel>
              <TrackTitle>너.모.되</TrackTitle>
            </TrackInfo>
            <BgToggleButton
              active={isBgVideoOn}
              onClick={() => setIsBgVideoOn(!isBgVideoOn)}
            >
              📹 배경 영상 {isBgVideoOn ? '켜기' : '끄기'}
            </BgToggleButton>
            <PauseButton title="일시정지">⏸</PauseButton>
          </RightInfoGroup>
        </DashboardContainer>
      </DashboardBar>

      {/* 메인 타이핑 인터페이스 */}
      <MainContent>
        <TypingCard>
          <CardHeader>
            <CardTitle>연습 문서 · 가사 타이핑</CardTitle>
            <ProgressBadge>진행률: {progressPercent}%</ProgressBadge>
          </CardHeader>

          {/* 가사 출력 흐름 영역 */}
          <LyricsArea>
            {/* 이전 문장 (희미함) */}
            <FadedLine>{prevTarget || '...'}</FadedLine>

            {/* 현재 타겟 문장 & 입력 대조 하이라이트 */}
            <CurrentLineBox>
              <AccentBar />
              <TargetText>
                {currentTarget.split('').map((char, idx) => {
                  let charColor = '#1e293b'; // 기본 색상
                  if (idx < userInput.length) {
                    charColor =
                      userInput[idx] === char ? '#0066ff' : '#ef4444'; // 맞으면 파랑, 틀리면 빨강
                  }
                  return (
                    <span key={idx} style={{ color: charColor }}>
                      {char}
                    </span>
                  );
                })}
              </TargetText>
            </CurrentLineBox>

            {/* 다음 문장들 (희미함) */}
            {nextTargets.map((line, i) => (
              <FadedLine key={i}>{line}</FadedLine>
            ))}
          </LyricsArea>
        </TypingCard>

        {/* 하단 입력 폼 */}
        <InputWrapper>
          <HiddenInput
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="여기에 가사를 입력하세요..."
          />
          <StatusBadge>
            <CheckIcon>✓</CheckIcon> 퍼펙트
          </StatusBadge>
        </InputWrapper>

        {/* 단축키 가이드 */}
        <ShortcutNotice>
          <Kbd>Enter</Kbd> 줄바꿈 <Kbd>Esc</Kbd> 일시정지
        </ShortcutNotice>

        {/* "야호!" 이펙트 애니메이션 오버레이 */}
        {cheers.map((cheer) => (
          <CheerFloat
            key={cheer.id}
            style={{ left: `${cheer.x}%`, top: `${cheer.y}%` }}
            onAnimationEnd={() => handleAnimationEnd(cheer.id)}
          >
            {cheer.text}
          </CheerFloat>
        ))}
      </MainContent>

      {/* 푸터 */}
      <Footer>
        <FooterContainer>
          <FooterLogo src={LogoSvg} alt="최애의 타자" />
          <FooterText>© 2024. 런칭 스타일 연습 모드.</FooterText>
          <FooterLinks>
            <a href="#terms">이용약관</a>
            <a href="#privacy">개인정보처리방침</a>
            <a href="#support">고객지원</a>
          </FooterLinks>
        </FooterContainer>
      </Footer>
    </PageWrapper>
  );
};

// 3. Emotion Styled & Keyframes 정의

// "야호!" 둥둥 떠오르는 애니메이션
const floatUp = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, 10px) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -20px) scale(1.2);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -60px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -80px) scale(0.9);
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  user-select: none;
  position: relative;
  overflow: hidden;
`;

const Header = styled.header`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
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
  height: 22px;
`;

const NavGroup = styled.nav`
  display: flex;
  gap: 24px;
`;

const NavLink = styled.a<{ active?: boolean }>`
  font-size: 14px;
  font-weight: ${({ active }) => (active ? '700' : '500')};
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.charcoal)};
`;

const HeaderAuth = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LoginButton = styled.a`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.charcoal};
`;

const StartHeaderButton = styled.button`
  padding: 6px 14px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 12px;
  font-weight: 600;
`;

const DashboardBar = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  padding: 12px 0;
`;

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ash};
  font-weight: 600;
`;

const StatValue = styled.span<{ color?: string }>`
  font-size: 20px;
  font-weight: 800;
  color: ${({ color, theme }) => color || theme.colors.ink};
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: #e2e8f0;
`;

const RightInfoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TrackInfo = styled.div`
  text-align: right;
`;

const TrackLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.ash};
  display: block;
`;

const TrackTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const BgToggleButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  background-color: #f1f5f9;
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.charcoal};

  &:hover {
    background-color: #e2e8f0;
  }
`;

const PauseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const TypingCard = styled.div`
  width: 100%;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  border-radius: 20px;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const CardTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ash};
`;

const ProgressBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const LyricsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 220px;
  justify-content: center;
`;

const FadedLine = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: #cbd5e1;
  text-align: left;
  padding-left: 16px;
`;

const CurrentLineBox = styled.div`
  position: relative;
  padding: 16px;
  background-color: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
`;

const AccentBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
`;

const TargetText = styled.p`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.4;
  font-family: monospace, sans-serif;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  position: relative;
  display: flex;
  align-items: center;
`;

const HiddenInput = styled.input`
  width: 100%;
  padding: 18px 24px;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.ink};
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  color: #16a34a;
`;

const CheckIcon = styled.span`
  font-size: 10px;
`;

const ShortcutNotice = styled.div`
  margin-top: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ash};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Kbd = styled.kbd`
  padding: 2px 6px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.charcoal};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
`;

const CheerFloat = styled.div`
  position: absolute;
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 2px 10px rgba(0, 102, 255, 0.3);
  pointer-events: none;
  animation: ${floatUp} 1.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
  white-space: nowrap;
`;

const Footer = styled.footer`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  padding: 20px 0;
  margin-top: auto;
  background-color: #ffffff;
`;

const FooterContainer = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterLogo = styled.img`
  height: 18px;
`;

const FooterText = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.ash};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 16px;

  a {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.ash};
  }
`;

// 4. Export Default
export default TypingPracticePage;
