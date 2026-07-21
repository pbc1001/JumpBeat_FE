// 1. Import 문
import { useState } from 'react';
import styled from '@emotion/styled';
import LogoSvg from '../assets/Logo.svg';

// 2. 컴포넌트 로직
const SyncEditorPage = () => {
  const [selectedTimelineId, setSelectedTimelineId] = useState<number>(2);

  const timelineItems = [
    { id: 1, time: '00:42.1', tag: '인트로', text: '악기 빌드업 구간' },
    { id: 2, time: '01:24.4', tag: '주멜로', subTag: '보컬', text: '우리 사이 세상 소릴 지우는', selected: true },
    { id: 3, time: '01:26.2', tag: '주멜로', text: 'Heart beat, I cant take it any more' },
    { id: 4, time: '01:29.8', tag: '주멜로', text: 'You, You remind me' },
    { id: 5, time: '01:33.1', tag: '주멜로가뭔데', text: '한여름밤의 꿈속같이' },
    { id: 6, time: '01:36.5', tag: '씹덕아;', text: 'You, You remind me' },
    { id: 7, time: '--:--.-', tag: '', text: "And the city's pulse is beating fast...", pending: true },
  ];

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
            <StartHeaderButton >시작하기</StartHeaderButton>
          </HeaderAuth>
        </HeaderContainer>
      </Header>

      {/* 메인 에디터 영역 */}
      <EditorLayout>
        {/* 좌측: 비디오 플레이어 & AI 분석 카드 */}
        <LeftPane>
          <PaneHeader>
            <div>
              <TitleGroup>
                <Title>AI 싱크 에디터</Title>
                <AiBadge>✦ AI 지원 모드</AiBadge>
              </TitleGroup>
              <Subtitle>동기화 중: Midnight City — M83</Subtitle>
            </div>
          </PaneHeader>

          {/* 유튜브 비디오 플레이어 임베드 */}
          <VideoContainer>
            <StyledIframe
              src="https://www.youtube.com/embed/TaiAXFeSb3g?autoplay=0&controls=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoContainer>

          {/* AI 분석 결과 알림 카드 */}
          <AiNoticeCard>
            <AiIconWrapper>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </AiIconWrapper>
            <AiNoticeContent>
              <AiNoticeTitle>AI 신뢰도 점수: 98%</AiNoticeTitle>
              <AiNoticeText>
                비트 감지 결과 01:45 지점에서 높은 리듬 밀도가 확인되었습니다. 빠른 템포 전환을 위해 더블 탭 싱크 마커 추가를 고려해보세요.
              </AiNoticeText>
            </AiNoticeContent>
            <ReanalyzeButton>재분석하기</ReanalyzeButton>
          </AiNoticeCard>
        </LeftPane>

        {/* 우측: 싱크 타임라인 목록 & 하단 액션 버튼 */}
        <RightPane>
          <TimelineHeader>
            <TimelineTitle>싱크 타임라인</TimelineTitle>
            <HeaderActionButtons>
              <IconButton title="추가">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </IconButton>
              <IconButton title="필터">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
              </IconButton>
            </HeaderActionButtons>
          </TimelineHeader>

          {/* 타임라인 리스트 */}
          <TimelineList>
            {timelineItems.map((item) => {
              const isSelected = selectedTimelineId === item.id;
              return (
                <TimelineItem
                  key={item.id}
                  isSelected={isSelected}
                  isPending={item.pending}
                  onClick={() => setSelectedTimelineId(item.id)}
                >
                  <TimeBadge isSelected={isSelected}>{item.time}</TimeBadge>
                  <ItemContent>
                    <TagRow>
                      {item.tag && <Tag>{item.tag}</Tag>}
                      {item.subTag && <SubTag>{item.subTag}</SubTag>}
                    </TagRow>
                    <ItemText isSelected={isSelected}>{item.text}</ItemText>
                  </ItemContent>
                  {isSelected && (
                    <CheckBadge>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </CheckBadge>
                  )}
                </TimelineItem>
              );
            })}
          </TimelineList>

          {/* 하단 저장/게시 버튼 영역 */}
          <TimelineFooter>
            <DraftButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              임시 저장
            </DraftButton>
            <PublishButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v8M12 18v4M4.93 10.93l1.41 1.41M17.66 11.66l1.41 1.41" />
              </svg>
              싱크 게시
            </PublishButton>
          </TimelineFooter>
        </RightPane>
      </EditorLayout>

      {/* 바닥글 상태 표시줄 */}
      <StatusBar>
        <StatusItem>● 자동 저장 활성화됨</StatusItem>
        <StatusItem>모드: 고급 정밀 편집</StatusItem>
        <ShortcutGroup>
          <KeyBadge>SPACE</KeyBadge> 재생 / 일시정지
          <KeyBadge style={{ marginLeft: '12px' }}>S</KeyBadge> 싱크 전용
        </ShortcutGroup>
      </StatusBar>
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
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1400px;
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
  font-weight: ${({ active }) => (active ? '700' : '500')};
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.charcoal)};
  position: relative;

  ${({ active, theme }) =>
    active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -18px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${theme.colors.primary};
    }
  `}
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

const EditorLayout = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  gap: 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LeftPane = styled.div`
  flex: 1.4;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PaneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
`;

const AiBadge = styled.span`
  padding: 4px 10px;
  background-color: #e0edff;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 12px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mute};
  margin-top: 4px;
`;

const VideoContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000000;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const AiNoticeCard = styled.div`
  background-color: #f0f6ff;
  border: 1px solid #d0e2ff;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const AiIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  background-color: #dbeafe;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AiNoticeContent = styled.div`
  flex: 1;
`;

const AiNoticeTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: 4px;
`;

const AiNoticeText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.charcoal};
  line-height: 1.5;
`;

const ReanalyzeButton = styled.button`
  padding: 8px 14px;
  background-color: #ffffff;
  border: 1px solid #bfdbfe;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    background-color: #eff6ff;
  }
`;

const RightPane = styled.div`
  flex: 1;
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TimelineTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const HeaderActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.charcoal};

  &:hover {
    background-color: #f1f5f9;
  }
`;

const TimelineList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: 480px;
  padding-right: 4px;
`;

const TimelineItem = styled.div<{ isSelected?: boolean; isPending?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  background-color: ${({ isSelected }) => (isSelected ? '#f0f6ff' : '#ffffff')};
  border: 1.5px solid ${({ isSelected, theme }) => (isSelected ? theme.colors.primary : '#f1f5f9')};
  opacity: ${({ isPending }) => (isPending ? 0.5 : 1)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ isSelected, theme }) => (isSelected ? theme.colors.primary : theme.colors.hairlineStrong)};
  }
`;

const TimeBadge = styled.span<{ isSelected?: boolean }>`
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 12px;
  font-weight: 700;
  background-color: ${({ isSelected }) => (isSelected ? '#0066ff' : '#e2e8f0')};
  color: ${({ isSelected }) => (isSelected ? '#ffffff' : '#475569')};
`;

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TagRow = styled.div`
  display: flex;
  gap: 6px;
`;

const Tag = styled.span`
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  background-color: #0f172a;
  color: #ffffff;
  border-radius: 4px;
`;

const SubTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  background-color: #e2e8f0;
  color: #475569;
  border-radius: 4px;
`;

const ItemText = styled.p<{ isSelected?: boolean }>`
  font-size: 14px;
  font-weight: ${({ isSelected }) => (isSelected ? '700' : '500')};
  color: ${({ isSelected, theme }) => (isSelected ? theme.colors.ink : theme.colors.charcoal)};
`;

const CheckBadge = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimelineFooter = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.dividerSoft};
`;

const DraftButton = styled.button`
  flex: 1;
  height: 44px;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const PublishButton = styled.button`
  flex: 1.5;
  height: 44px;
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const StatusBar = styled.div`
  width: 100%;
  height: 36px;
  background-color: #ffffff;
  border-top: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  padding: 0 24px;
  display: flex;
  align-items: center;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.ash};
`;

const StatusItem = styled.span`
  margin-right: 24px;
`;

const ShortcutGroup = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const KeyBadge = styled.kbd`
  padding: 2px 6px;
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-family: monospace;
  font-size: 10px;
  font-weight: 700;
  color: #334155;
`;

// 4. Export Default
export default SyncEditorPage;