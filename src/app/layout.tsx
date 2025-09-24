import "./globals.css";
import { Toaster } from "sonner";
export const metadata = {
  title: "ChatSphere",
  description: "",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
