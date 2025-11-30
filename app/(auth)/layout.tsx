"use client"

import React from 'react';
import '../globals.css';
import LoginHeader from './_components/LoginHeader';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <LoginHeader />
      {children}
    </div>
  );
}