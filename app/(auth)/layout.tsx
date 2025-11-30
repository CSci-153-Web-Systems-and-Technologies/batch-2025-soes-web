"use client"

import React from 'react';
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