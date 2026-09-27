'use client';

import React, { useState, useEffect } from 'react';

const mockUser = {
  id: 'usr-admin-duliajan',
  email: 'admin.pipeline@oilindia.in',
  username: 'oil_super_admin',
  isAdmin: true,
  role: 'ADMIN',
  department: 'Project Controls',
  subscriptionStatus: 'active',
  subscriptionPlan: 'pro',
  credits: 999,
};

export function useAuth() {
  const [data, setData] = useState<any>(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  return {
    data,
    isLoading,
    error,
  };
}

export async function logout() {
  console.log('[Auth] Logged out');
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export async function login(credentials: any) {
  console.log('[Auth] Login:', credentials);
  if (typeof window !== 'undefined') {
    window.location.href = '/projects';
  }
}

export async function signup(credentials: any) {
  console.log('[Auth] Signup:', credentials);
  if (typeof window !== 'undefined') {
    window.location.href = '/projects';
  }
}

export function LoginForm() {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = '/projects';
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Email / Username</label>
        <input
          type="text"
          defaultValue="planner.duliajan@oilindia.in"
          className="w-full px-3 py-2 border rounded-md bg-background"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          defaultValue="password"
          className="w-full px-3 py-2 border rounded-md bg-background"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
      >
        Sign in to Nirmaan Setu
      </button>
    </form>
  );
}

export function SignupForm() {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = '/projects';
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          defaultValue="engineer.site@oilindia.in"
          className="w-full px-3 py-2 border rounded-md bg-background"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          defaultValue="password123"
          className="w-full px-3 py-2 border rounded-md bg-background"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
      >
        Create Account
      </button>
    </form>
  );
}

export function ForgotPasswordForm() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Enter your email to receive a password reset link.</p>
      <input
        type="email"
        placeholder="your.email@oilindia.in"
        className="w-full px-3 py-2 border rounded-md bg-background"
      />
      <button className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground font-semibold">
        Send Reset Link
      </button>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <div className="space-y-4">
      <input
        type="password"
        placeholder="New password"
        className="w-full px-3 py-2 border rounded-md bg-background"
      />
      <button className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground font-semibold">
        Update Password
      </button>
    </div>
  );
}

export function VerifyEmailForm() {
  return (
    <div className="text-center py-6">
      <p className="text-sm text-muted-foreground mb-4">Email verification confirmed.</p>
      <a
        href="/projects"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold"
      >
        Go to Projects
      </a>
    </div>
  );
}
