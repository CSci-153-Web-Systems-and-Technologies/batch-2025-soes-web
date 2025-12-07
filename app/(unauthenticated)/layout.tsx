"use client"

import React from 'react';
import VoterHeader from '@/components/Header';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <VoterHeader />
      {children}
    </div>
  );
}