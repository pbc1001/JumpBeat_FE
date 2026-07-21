// 1. Import 문
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import LogoSvg from '../assets/Logo.svg';

// 팁 메시지 목록
const TIPS = [
  '빠른 속도보다 일정한 리듬을 유지하는 것이 더 유리합니다.',
  '리듬 정확도를 높이려면 \'콤보\' 타법을 활용하세요.',
  '집중력을 높이기 위해 포커스 BPM에 맞춰보세요.',
];

// 2. 컴포넌트 로직
const LoadingPage = () => {
  const [progress, setProgress] = useState<number>(0);
  const [tipIndex, setTipIndex] = useState<number>(0);

  // 프로그레스 바 차오르는 애니메이션 시뮬레이션
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // 무작위 속도로 부드럽게 증가
        const diff = Math.random() * 15;
        return Math.min(prev + diff, 100);
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  // 팁 메시지 주기적 전환 (3.5초마다)
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3500);

    return () => clearInterval(tipTimer);
  }, []);

  return (
    <PageWrapper>
      <CenterContainer>
        {/* 상단 움직이는 3개 점 */}
        <DotGroup>
          <Dot delay="0s" />
          <Dot delay="0.2s" />
          <Dot delay="0.4s" />
        </DotGroup>

        {/* 로고 & 서브 타이틀 */}
        <LogoWrapper>
          <LogoImage src={LogoSvg} alt="최애의 타자" />
          <Subtitle>모든 타전에 리듬을.</Subtitle>
        </LogoWrapper>

        {/* 프로그레스 바 영역 */}
        <ProgressTrack>
          <ProgressFill width={progress} />
        </ProgressTrack>

        {/* 하단 팁 & 상태 바 */}
        <StatusRow>
          <TipBox key={tipIndex}>
            <TipIcon>💡</TipIcon>
            <TipText>{TIPS[tipIndex]}</TipText>
          </TipBox>

          <EngineStatusBadge>
            <StatusDot />
            오디오 엔진 초기화 중
          </EngineStatusBadge>
        </StatusRow>
      </CenterContainer>

      {/* 바닥글 */}
      <Footer>
        <FooterLeft>© 2024 최애의 타자. Global</FooterLeft>
        <FooterRight>© 2024 최애의 타자. Global &nbsp;|&nbsp; 제작: 리듬 타자 팀</FooterRight>
      </Footer>
    </PageWrapper>
  );
};

// 3. Emotion Styled & Keyframes 정의

// 점 애니메이션 (바운스 & 페이드)
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1.1);
    opacity: 1;
  }
`;

// 팁 텍스트 등장 애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8faff;
  position: relative;
  overflow: hidden;
`;

const CenterContainer = styled.div`
  width: 100%;
  max-width: 520px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DotGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const Dot = styled.span<{ delay: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${({ delay }) => delay};
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const LogoImage = styled.img`
  height: 32px;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.mute};
  letter-spacing: -0.3px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
  transition: width 0.3s ease-out;
`;

const StatusRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`;

const TipBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${fadeIn} 0.4s ease-out;
`;

const TipIcon = styled.span`
  font-size: 14px;
`;

const TipText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.charcoal};
  font-weight: 500;
`;

const EngineStatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.ash};
  white-space: nowrap;
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 24px;
  width: 100%;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.ash};
`;

const FooterLeft = styled.div``;

const FooterRight = styled.div``;

// 4. Export Default
export default LoadingPage;