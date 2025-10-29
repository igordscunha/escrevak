import type { Metadata } from "next";
import "./globals.css";
import HeaderComponent from "./components/HeaderComponent";
import { AuthProvider } from "./contexts/auth-context";
import { geistMono, geistSans } from './fonts/fonts';

export const metadata: Metadata = {
  title: "Escrevak",
  description: "Escreva para o mundo.",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <HeaderComponent />
          <main className="bg-indigo-200 text-white">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
