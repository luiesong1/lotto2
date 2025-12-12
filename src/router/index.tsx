import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from 'pages/Login';
import { Dashboard } from 'pages/Dashboard';

function Root() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEMO 로그인 페이지 */}
        <Route path="/login" element={<Login />} />

        {/* 메인 → 항상 데모 Dashboard 페이지 */}
        <Route path="/" element={<Dashboard />} />

        {/* 그 외 모든 경로 → / 로 이동 */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Root;
