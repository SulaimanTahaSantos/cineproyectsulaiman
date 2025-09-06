import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CineProyect - Tu plataforma de películas",
  description: "Descubre, explora y guarda tus películas favoritas en CineProyect",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>
        {children}
        </main>

        <footer className="bg-gray-800 p-4 mt-8">
          <div className="container mx-auto text-center text-white">
            <p>&copy; 2025 CineProyect - Desarrollado por Sulaiman El Taha Santos</p>
          </div>
        </footer>
     
      </body>
    </html>
  );
}
