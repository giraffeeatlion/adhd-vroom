'use client';

import { useState } from 'react';
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import Dashboard from '@/components/Dashboard'; // <-- 1. IMPORT DASHBOARD
import { useAuth } from '@/context/AuthContext';   // <-- 2. IMPORT useAuth

// A small component to keep the login/register toggle logic clean
function AuthForms() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? <LoginForm /> : <RegisterForm />}
      <button 
        onClick={() => setShowLogin(!showLogin)} 
        className="mt-4 text-sm text-blue-400 hover:underline"
      >
        {showLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
}

export default function Home() {
  const { token } = useAuth(); // <-- 3. GET THE TOKEN FROM CONTEXT

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      {token ? <Dashboard /> : <AuthForms />} {/* <-- 4. RENDER BASED ON TOKEN */}
    </main>
  );
}