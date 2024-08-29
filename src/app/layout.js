import "./globals.css";
import { Poppins } from "next/font/google";

const itim = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Draw It !",
  description: "Whiteboard for everyone.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={itim.className}>
        {children}
      </body>
    </html>
  );
}
