import "./globals.css";

// Root layout - locale-specific layout is in app/[locale]/layout.tsx
// The middleware handles redirecting / to /en/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
