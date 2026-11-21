import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { HeaderActions } from "@/components/HeaderActions";


export const metadata: Metadata = {
  title: "PitStop",
  description: "Gerenciamento automotivo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className="min-h-full flex flex-col">
        <header className="bg-gray-400 p-4 flex flex-wrap justify-between items-center gap-3">
          <Link href="/" className="flex items-center gap-4 text-2xl font-bold">
            PitStop
          </Link>
          <Suspense fallback={null}>
            <HeaderActions />
          </Suspense>
        </header>
        {children}
        <ToastContainer position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
