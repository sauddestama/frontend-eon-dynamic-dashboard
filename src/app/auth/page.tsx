"use client";

import React from "react";
import LoginForm from "@/components/Auth/LoginForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
}
