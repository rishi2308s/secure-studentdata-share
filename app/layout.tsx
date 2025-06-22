import type { Metadata } from "next";
import "./globals.css"; 

// Metadata for the app 
export const metadata: Metadata = {
  title: "TnP Share App",
  description: "Securely share student data via tokenized links",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/*  Using Tailwind CDN for quick setup and simplicity, avoiding complex local build/configuration steps and reducing development overhead.*/}
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white min-h-screen text-gray-900 p-6">
        {children} {/* Render page content */}
      </body>
    </html>
  );
}
