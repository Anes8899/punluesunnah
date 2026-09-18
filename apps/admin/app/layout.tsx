import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ពន្លឺស៊ុណ្ណះ · Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="km">
      <body>{children}</body>
    </html>
  );
}
