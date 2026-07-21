// 1. Import 문
import React, { useState } from 'react';
import styled from '@emotion/styled';
import LogoSvg from '../assets/Logo.svg';

// 2. 컴포넌트 로직
const SignUpPage = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nickname, email, password, passwordConfirm, agreed });
  };

  return (
    <PageWrapper>
      <MainContent>
        <LogoImage src={LogoSvg} alt="최애의 타자" />

        <Card>
          <Title>회원가입</Title>
          <Subtitle>리듬에 맞춰 타이핑할 준비가 되셨나요?</Subtitle>

          <Form onSubmit={handleSubmit}>
            {/* 닉네임 */}
            <FormGroup>
              <Label>닉네임</Label>
              <InputWrapper>
                <InputIcon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                </InputIcon>
                <Input
                  type="text"
                  placeholder="비트마스터"
                  hasIcon
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            {/* 이메일 */}
            <FormGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                placeholder="hello@beattyping.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>

            {/* 비밀번호 */}
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

            {/* 비밀번호 확인 */}
            <FormGroup>
              <Label>비밀번호 확인</Label>
              <InputWrapper>
                <InputIcon>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </InputIcon>
                <Input
                  type="password"
                  placeholder="••••••••"
                  hasIcon
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            {/* 약관 동의 */}
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <CheckboxCustom />
              <CheckboxText>
                <strong>최애의 타자</strong> 의 <a href="#terms">이용약관</a>과{' '}
                <a href="#privacy">개인정보 처리방침</a>에 동의합니다.
              </CheckboxText>
            </CheckboxLabel>

            <SubmitButton type="submit">
              시작하기
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
              </svg>
            </SubmitButton>
          </Form>

          <LoginLinkText>
            이미 계정이 있으신가요? <a href="#login">로그인</a>
          </LoginLinkText>
        </Card>
      </MainContent>

      <FooterText>PRECISION IN EVERY KEYSTROKE</FooterText>
    </PageWrapper>
  );
};

// 3. Emotion Styled 정의
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.canvas};
  position: relative;
  overflow: hidden;
  padding: 40px 20px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.accentSparklingBlueGlow} 0%,
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
  width: 100%;
  z-index: 1;
`;

const LogoImage = styled.img`
  height: 64px;
  margin-bottom: 32px;
`;


const Card = styled.div`
  width: 150%;
  max-width: 420px;
  background-color: ${({ theme }) => theme.colors.canvas};
  border: 1.5px solid ${({ theme }) => theme.colors.ink};
  border-radius: 20px;
  padding: 36px 32px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: 6px;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.mute};
  margin-bottom: 28px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
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
  height: 42px;
  padding: 0 14px;
  padding-left: ${({ hasIcon }) => (hasIcon ? '40px' : '14px')};
  background-color: ${({ theme }) => theme.colors.surfaceCard};
  border: 1px solid ${({ theme }) => theme.colors.hairlineStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 4px;
  user-select: none;
`;

const CheckboxInput = styled.input`
  display: none;

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};

    &::after {
      display: block;
    }
  }
`;

const CheckboxCustom = styled.span`
  width: 18px;
  height: 18px;
  border: 1.5px solid ${({ theme }) => theme.colors.stone};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s ease;

  &::after {
    content: '';
    display: none;
    width: 5px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
  }
`;

const CheckboxText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.charcoal};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 46px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryOn};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 15px;
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

const LoginLinkText = styled.p`
  margin-top: 24px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.mute};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FooterText = styled.p`
  font-size: 11px;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.colors.ash};
  font-weight: 500;
  z-index: 1;
`;

// 4. Export Default
export default SignUpPage;