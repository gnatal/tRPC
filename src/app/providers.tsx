'use client';

import { TRPCProvider } from '@/utils/trpc-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <TRPCProvider>{children}</TRPCProvider>;
}