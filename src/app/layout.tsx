import type { Metadata } from "next";
import { Providers } from "./providers";
import { ThemeProvider } from "./ThemeProvider";
import Navbar from "./components/navbar/Navbar";

export const metadata: Metadata = {
  title: "DocConnect",
  description: "Connect with doctors online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
