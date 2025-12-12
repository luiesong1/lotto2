// Login.tsx (DEMO 관리자 대시보드 화면으로 전체 교체)

import React from 'react';
import * as S from './style';

export function Login() {
  return (
    <S.Container style={{ background: '#0A66C2', minHeight: '100vh' }}>
      <S.Wrapper>
        <div
          style={{
            background: '#fff',
            padding: '40px',
            borderRadius: '16px',
            width: '650px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '15px',
            }}
          >
            🎛 Lotto Again 관리자 대시보드 (DEMO)
          </h1>

          <p style={{ color: '#555', marginBottom: '25px' }}>
            로그인 없이 샘플 관리자 페이지를 확인할 수 있습니다.
          </p>

          <hr style={{ marginBottom: '25px' }} />

          {/* Member Section */}
          <h2
            style={{
              fontSize: '22px',
              marginBottom: '10px',
              fontWeight: 600,
            }}
          >
            📌 회원 정보
          </h2>

          <ul style={{ marginBottom: '25px', lineHeight: '1.8' }}>
            <li>총 회원수 : 1,284명</li>
            <li>금일 신규 가입 : 12명</li>
          </ul>

          {/* Lotto Section */}
          <h2
            style={{
              fontSize: '22px',
              marginBottom: '10px',
              fontWeight: 600,
            }}
          >
            📌 최근 로또 번호
          </h2>

          <div style={{ display: 'flex', gap: '14px', marginBottom: '30px' }}>
            {[3, 12, 18, 24, 33, 41].map((num) => (
              <div
                key={num}
                style={{
                  width: '55px',
                  height: '55px',
                  background: '#F59E0B',
                  borderRadius: '50%',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {num}
              </div>
            ))}
          </div>

          {/* Navigation Button */}
          <button
            onClick={() => (window.location.href = '/')}
            style={{
              background: '#0A66C2',
              color: 'white',
              padding: '14px 22px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            메인 페이지로 이동 →
          </button>
        </div>
      </S.Wrapper>
    </S.Container>
  );
}
