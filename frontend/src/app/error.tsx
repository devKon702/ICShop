"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Home, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <svg
          className="w-20 h-20 text-blue-400 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="currentColor"
            strokeWidth="3"
            fill="#e0f2fe"
          />
          <path
            d="M24 16v10"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="24" cy="32" r="2" fill="#2563eb" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Please try again or return to the homepage.
        </p>
        <div className="space-x-2 flex">
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center px-6 py-2 bg-primary/80 hover:bg-primary rounded-lg shadow transition disabled:cursor-progress"
            aria-label="Reload page"
          >
            <RotateCcw />
            <span>Reload</span>
          </Button>
          <Button className="flex px-6 py-2 space-x-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
            <Link href="/" className="flex items-center space-x-2">
              <Home />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
        <div className="mt-8 flex items-center space-x-2 text-sm text-gray-400">
          <span>IoT Shop</span>
          <span>•</span>
          <span>Empowering your smart life</span>
        </div>
      </div>
    </div>
  );
}
