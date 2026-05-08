"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pill } from "@/components/ui/Pill";

export interface TasksTableRow {
  id: string;
  title: string;
  cluster: string;
  matchesRoles: string[];
  status: "DB override" | "File default" | "Missing";
}

export function TasksTable({ rows }: { rows: TasksTableRow[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => {
      return (
        r.id.toLowerCase().includes(term) ||
        r.title.toLowerCase().includes(term) ||
        r.cluster.toLowerCase().includes(term) ||
        r.matchesRoles.some((role) => role.toLowerCase().includes(term))
      );
    });
  }, [rows, q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by slug, title, cluster, role…"
          className="focus-ring w-full max-w-md rounded-lg border border-sage-mist-2 bg-chalk px-3 py-2 text-sm"
        />
        <span className="text-xs text-charcoal-2">
          {filtered.length} / {rows.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-sage-mist-2 bg-chalk">
        <table className="w-full text-sm">
          <thead className="bg-pale-sage text-left text-xs uppercase tracking-wide text-sage-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Cluster</th>
              <th className="px-4 py-3 font-semibold">Roles</th>
              <th className="px-4 py-3 font-semibold">Tasks</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-mist-2">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-pale-sage/30">
                <td className="px-4 py-3 font-mono text-xs text-charcoal-2">
                  {r.id}
                </td>
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3 text-charcoal-2">{r.cluster}</td>
                <td className="px-4 py-3 text-xs text-charcoal-2">
                  {r.matchesRoles.slice(0, 2).join(", ")}
                  {r.matchesRoles.length > 2
                    ? ` +${r.matchesRoles.length - 2}`
                    : ""}
                </td>
                <td className="px-4 py-3">
                  <Pill
                    variant={
                      r.status === "DB override"
                        ? "sageSolid"
                        : r.status === "File default"
                        ? "sage"
                        : "coral"
                    }
                    size="sm"
                  >
                    {r.status}
                  </Pill>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/tasks/${r.id}`}
                    className="text-sage hover:underline"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-charcoal-2"
                >
                  No matches.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
