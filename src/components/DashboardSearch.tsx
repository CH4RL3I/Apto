"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function DashboardSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/case-studies?q=${encodeURIComponent(q)}` : "/case-studies");
  }

  return (
    <form
      onSubmit={submit}
      className="flex w-full max-w-xl items-center gap-2 rounded-[14px] border border-sage-mist-2 bg-chalk px-3 py-2.5 shadow-1"
    >
      <Search className="h-4 w-4 text-charcoal-3" strokeWidth={1.75} />
      <label htmlFor="dashboard-search" className="sr-only">
        Search challenges, companies, and skills
      </label>
      <input
        id="dashboard-search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search challenges, companies, skills..."
        className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal-3 focus:outline-none"
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}
