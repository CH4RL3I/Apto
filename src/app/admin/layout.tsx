import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { checkAdminGate } from "@/lib/admin/gate";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gate = await checkAdminGate();
  if (gate.reason === "no-session") redirect("/login");
  if (!gate.allowed) notFound();

  return (
    <div className="min-h-screen bg-chalk text-charcoal">
      <header className="border-b border-sage-mist-2 bg-pale-sage">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sage-700">Admin · Apto</span>
            <span className="text-xs text-charcoal-2">Internal tooling</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-charcoal-2">{gate.email}</span>
            <Link href="/dashboard" className="text-sage hover:underline">
              Exit
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
