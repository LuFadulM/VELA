import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-50/60">
      <header className="border-b border-navy-100 bg-white">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/"><Logo /></Link>
          <Link href="mailto:hello@vela.ai" className="text-sm text-navy-500 hover:text-navy-900">
            Need help? hello@vela.ai
          </Link>
        </div>
      </header>
      <main className="container flex flex-1 items-center justify-center py-12">
        {children}
      </main>
    </div>
  );
}
