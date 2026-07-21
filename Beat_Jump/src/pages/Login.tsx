import React, { useState } from 'react';
import styled from '@emotion/styled';
import LogoSvg from '../assets/Logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/main', { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : '서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
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

            {error && <FormError role="alert">{error}</FormError>}

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </SubmitButton>
          </Form>

        </Card>

        <SignUpText>
          아직 회원이 아니신가요?
          <Link to="/signup">회원가입 하기</Link>
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const FormError = styled.p`
  margin: -4px 0 0;
  color: #ef4444;
  font-size: 13px;
  line-height: 1.4;
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
