import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { PreferencesProvider } from "@/lib/preferences/provider";
import { THEME_COOKIE, DEV_MODE_COOKIE } from "@/lib/preferences/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Receipt Validation Platform - Summarecon Mall",
  description:
    "Proof of Concept demo for AI-powered receipt validation, OCR processing, fraud detection, and business analytics for Summarecon Mall.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get(THEME_COOKIE)?.value === "dark" ? "dark"
    : cookieStore.get(THEME_COOKIE)?.value === "auto" ? "auto"
    : "light";
  const isDark = theme === "dark";
  const devMode = cookieStore.get(DEV_MODE_COOKIE)?.value === "true";

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}${isDark ? " dark" : ""}`}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              var c=document.cookie.match(new RegExp('(?:^| )dip-theme=([^;]+)'));
              var t=c?decodeURIComponent(c[1]):(localStorage.getItem('summarecon-theme')||'light');
              if(!c&&localStorage.getItem('summarecon-theme')){document.cookie='dip-theme='+t+';path=/;max-age=31536000;SameSite=Lax'}
              var d=t==='dark'||(t==='auto'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
              document.documentElement.classList.toggle('dark',d);
            }catch(e){}
          `}
        </Script>
      </head>
      <body className="antialiased">
        <PreferencesProvider initialValues={{ theme, developerMode: devMode }}>
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}
