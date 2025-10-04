import React from "react";
import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";

const NotFoundIcon: React.FC = () => (
  <MessageCircleQuestion
    size={64}
    color="#cccccc"
    style={{ marginBottom: 24 }}
  />
);

const NotFoundPage: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
      borderRadius: 16,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      padding: 32,
      margin: "5vh auto",
      maxWidth: 420,
    }}
  >
    <NotFoundIcon />
    <h1 className="font-extrabold text-5xl mb-4 text-center text-black/40">
      404
    </h1>
    <p className="text-gray-600 mb-6 text-center">
      Xin lỗi, trang bạn tìm kiếm không tồn tại.
    </p>
    <Link
      href="/"
      style={{
        background: "#1677ff",
        color: "#fff",
        padding: "10px 24px",
        borderRadius: 8,
        textDecoration: "none",
        fontWeight: 500,
        transition: "background 0.2s",
      }}
    >
      Về trang chủ
    </Link>
  </div>
);

export default NotFoundPage;
