import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/layout-wrapper";

export const metadata: Metadata = {
  title: "Jenrianna Apartments",
  description: "Book luxury apartments easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased mx-auto`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
