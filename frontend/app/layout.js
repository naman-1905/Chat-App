import "./globals.css";

export const metadata = {
  title: "Common — conversations, on your terms",
  description: "A calmer way to chat, gather, and share moments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
