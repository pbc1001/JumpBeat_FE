import React, { useState } from 'react';
import styled from '@emotion/styled';
import LogoSvg from '../assets/Logo.svg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <PageWrapper>
      <MainContent>
        {/* '최애의 타자' 로고 SVG 이미지 대체 */}
        <LogoImage src={LogoSvg} alt="최애의 타자" />

        <Card>
          <Title>로그인</Title>
          <Subtitle>다시 리듬을 맞출 준비가 되셨나요?</Subtitle>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>이메일</Label>
              <InputWrapper>
                <InputIcon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </InputIcon>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  hasIcon
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>

            <ForgotPassword href="#find-password">비밀번호 찾기</ForgotPassword>

            <SubmitButton type="submit">
              로그인
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </SubmitButton>
          </Form>

          <Divider>
            <DividerText>소셜 계정으로 로그인</DividerText>
          </Divider>

          <SocialGroup>
            {/* 카카오 */}
            <SocialButton bg="#FEE500" aria-label="Kakao Login">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.122.49.18.483.377.352.155-.103 2.466-1.675 3.464-2.355.54.08 1.097.124 1.669.124 4.97 0 9-3.186 9-7.115S16.97 3 12 3z" />
              </svg>
            </SocialButton>
            {/* 구글 */}
            <SocialButton bg="#ffffff" aria-label="Google Login">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </SocialButton>
          </SocialGroup>
        </Card>

        <SignUpText>
          아직 회원이 아니신가요?
          <a href="signup">회원가입 하기</a>
        </SignUpText>
      </MainContent>

      <Footer>
        <div>
          © 2024 <strong style={{ color: '#0066ff' }}>최애의 타자</strong>. Precision in every keystroke.
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
}

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.canvas};
  position: relative;
  overflow: hidden;

  /* 배경 은은한 스파클링 블루/하늘색 그라데이션 글로우 효과 */
  &::before {
    content: '';
    position: absolute;
    top: -150px;
    left: -150px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.accentSparklingBlueGlow} 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -150px;
    right: -150px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(56, 189, 248, 0.15) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  z-index: 1;
`;

const LogoImage = styled.img`
  height: 64px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  width: 150%;
  max-width: 440px;
  background-color: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 40px 36px;
  box-shadow: 0 10px 25px -5px rgba(0, 102, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.mute};
  margin-bottom: 32px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 14px;
  color: ${({ theme }) => theme.colors.ash};
  display: flex;
  align-items: center;
`;

const Input = styled.input<{ hasIcon?: boolean }>`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  padding-left: ${({ hasIcon }) => (hasIcon ? '40px' : '14px')};
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.ash};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.canvas};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.surfaceLight};
  }
`;

const ForgotPassword = styled.a`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.typography.codeMd.fontSize};
  color: ${({ theme }) => theme.colors.mute};
  margin-top: -8px;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryOn};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.92;
  }
`;

const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 28px 0 20px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.dividerSoft};
  }
`;

const DividerText = styled.span`
  padding: 0 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ash};
`;

const SocialGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const SocialButton = styled.button<{ bg?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${({ bg }) => bg || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors.dividerSoft};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SignUpText = styled.p`
  margin-top: 24px;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.mute};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    margin-left: 6px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Footer = styled.footer`
  width: 100%;
  max-width: 1200px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ash};
  z-index: 1;

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

export default LoginPage