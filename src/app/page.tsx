"use client";

import dynamic from "next/dynamic";
import { Providers } from "./providers";

// Динамически загружаем основной контент только на клиенте
const DynamicContent = dynamic(() => import("./MainContent"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-4">
      <h1 className="text-7xl font-black mb-4">NotBase</h1>
      <p className="text-2xl opacity-80">Loading wallet...</p>
    </main>
  ),
});

export default function Home() {
  return (
    <Providers>
      <DynamicContent />
    </Providers>
  );
}