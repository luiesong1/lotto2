import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import * as S from "./style";

const sampleData = [
  { name: "월", users: 300, sales: 120 },
  { name: "화", users: 450, sales: 220 },
  { name: "수", users: 500, sales: 260 },
  { name: "목", users: 700, sales: 300 },
  { name: "금", users: 900, sales: 450 },
  { name: "토", users: 1200, sales: 480 },
  { name: "일", users: 800, sales: 330 },
];

export function Dashboard() {
  return (
    <S.Container style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "20px" }}>
        📊 Lotto Again 관리자 대시보드 (샘플)
      </h1>

      {/* 카드 영역 */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            flex: 1,
          }}
        >
          <h3>총 회원수</h3>
          <strong style={{ fontSize: "30px" }}>12,840명</strong>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            flex: 1,
          }}
        >
          <h3>이번주 매출</h3>
          <strong style={{ fontSize: "30px" }}>₩ 3,820,000</strong>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            flex: 1,
          }}
        >
          <h3>신규 가입자</h3>
          <strong style={{ fontSize: "30px" }}>128명</strong>
        </div>
      </div>

      {/* 라인 차트 */}
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>📈 일간 사용자 증가 추이</h2>
        <LineChart width={800} height={350} data={sampleData}>
          <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>

      {/* 바 차트 */}
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>📊 요일별 매출</h2>
        <BarChart width={800} height={350} data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#f59e0b" />
        </BarChart>
      </div>
    </S.Container>
  );
}
