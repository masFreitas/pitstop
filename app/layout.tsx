import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "PitStop",
  description: "Gerenciamento automotivo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body className="min-h-full flex flex-col">
        <header className="bg-gray-400 p-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 text-2xl font-bold">
            PitStop
          </Link>
          <div>
            <Link
              href="/cadastrar-veiculo"
              className="bg-gray-900 text-white p-4 text-xl font-bold uppercase rounded-xl hover:bg-green-700"
            >
              Cadastrar Veículo
            </Link>
          </div>
        </header>
        {children}
        <ToastContainer position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
