import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
import Link from "next/link";
import "./globals.css";
import { MantineProvider } from '@mantine/core';
import { Toaster } from "@/components/ui/toaster";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";


const defaultUrl = process.env.URL
  ? `https://${process.env.URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "predi.ct.it",
  description: "Share your verified predictions with others",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MantineProvider>
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center px-8 text-sm">
                  <div className="flex items-center font-semibold">
                    <Link href={"/"}><h1 className="text-3xl mr-4">PredictIt!</h1></Link>
                    <div className="hidden sm:block gap-4">
                    <Link href="https://github.com/lukesteinbicker/predictit/"><Button variant="link">Repo</Button></Link>
                    <CopyButton text="Keep the lights on" copyText="0xd5c81b6bba0ceb477594fcedc83703ed5911843d"/>
                    </div>
                  </div>
                  <div className="inline-flex gap-2">
                  <HeaderAuth />
                  <ThemeSwitcher />
                  </div>
                </div>
              </nav>
              <div className="flex flex-col max-w-5xl px-5">
                {children}
              </div>
            </div>
          </main>
          <Toaster />
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
