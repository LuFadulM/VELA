import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vela — AI operations copilot",
  description:
    "You run everything. Vela runs admin. The AI ops copilot for executive assistants, operations managers, and virtual assistants.",
  metadataBase: new URL("https://vela.ai"),
  openGraph: {
    title: "Vela — You run everything. Vela runs admin.",
    description:
      "One workspace that unifies email, calendar, tasks and contacts — with an AI that handles the repetitive admin layer.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white">
      <body>{children}</body>
    </html>
  );
}
