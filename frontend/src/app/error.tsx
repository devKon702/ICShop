"use client";
import React from "react";

interface ErrorPageProps {
  error?: Error;
  reset?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
        color: "#333",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Something went wrong</h1>
      <p>
        {error?.message ||
          "An unexpected error has occurred. Please try again later."}
      </p>
      {reset && (
        <button
          onClick={reset}
          style={{
            marginTop: 16,
            padding: "8px 24px",
            fontSize: 16,
            borderRadius: 4,
            border: "none",
            background: "#0070f3",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorPage;
