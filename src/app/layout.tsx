import type { Metadata } from " next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NotBase – Clicker on Base Mainnet",
  description: "Каждый клик = транзакция в Base",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-black">{children}</body>
    </html>
  );
}