import React, { useEffect, useMemo, useState } from "react";
// NOTE: sebelumnya file ini import type { Portfolio } padahal yang dilist adalah projects.
// Biar gak ngerombak folder types kamu, kita define tipe lokal yang minimal.
type AdminProject = {
    id: number | string;
    title: string;
    portfolio?: { id: number; name: string };
    featured?: boolean;
    sort_order?: number;
    // sisanya bebas (image, technologies, dll) supaya kompatibel dengan ProjectForm initial
    [key: string]: any;
};

import ProjectForm from "./ProjectForm";
import {
    listProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../../services/admin";
import { X, Plus, Trash2, Pencil } from "lucide-react";

type Props = { onClose: () => void };

export default function AdminPanel({ onClose }: Props) {
    // key aktif (dipakai header) diambil dari localStorage saat mount
    const [adminKey, setAdminKey] = useState(
        localStorage.getItem("admin_key") || ""
    );
    // draftKey: buat ngetik di input TANPA langsung nyimpen/aktivasi
    const [draftKey, setDraftKey] = useState(adminKey);

    // ⬇️ items & editing disesuaikan ke AdminProject (bukan Portfolio)
    const [items, setItems] = useState<AdminProject[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<AdminProject | null>(null);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function refresh(p = page) {
        try {
            setLoading(true);
            setError(null);
            const res = await listProjects(p);
            setItems(res.data);
            setTotal(res.total ?? res.meta?.total ?? null);
        } catch (e: any) {
            setError(e?.message || "Failed to load");
        } finally {
            setLoading(false);
        }
    }

    // HANYA refresh ketika adminKey aktif berubah
    useEffect(() => {
        if (adminKey) refresh(1);
    }, [adminKey]);

    // ======== LOGIN VIEW (pakai draftKey, baru aktif saat klik "Masuk") ========
    if (!adminKey) {
        const handleLogin = () => {
            const k = (draftKey || "").trim();
            if (!k) return;
            localStorage.setItem("admin_key", k);
            setAdminKey(k); // aktifkan key (efek di atas akan refresh)
        };

        return (
            <Sheet onClose={onClose} title="Admin Login">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Masukkan Admin Key untuk mengelola portfolio.
                    </p>
                    <input
                        type="password"
                        placeholder="X-Admin-Key"
                        className="w-full rounded-lg border px-3 py-2"
                        value={draftKey}
                        onChange={(e) => setDraftKey(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={handleLogin}
                    >
                        Masuk
                    </button>
                </div>
            </Sheet>
        );
    }

    // ======== ADMIN VIEW ========
    return (
        <Sheet onClose={onClose} title="Admin — Projects">
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                    Total: {total ?? "—"}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCreating(true)}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem("admin_key");
                            setAdminKey(""); // balik ke login view
                            setDraftKey(""); // kosongin input
                            setItems([]); // bersihin list biar jelas
                            setTotal(null);
                        }}
                        className="px-3 py-2 rounded-lg border"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}

            {creating && (
                <div className="mb-6 rounded-xl border p-4 bg-white">
                    <h3 className="font-medium mb-3">Create Project</h3>
                    <ProjectForm
                        onSubmit={async (fd) => {
                            await createProject(fd);
                            setCreating(false);
                            await refresh(1);
                        }}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-3 py-2">Title</th>
                            <th className="text-left px-3 py-2">Portfolio</th>
                            <th className="text-left px-3 py-2">Featured</th>
                            <th className="text-left px-3 py-2">Sort</th>
                            <th className="text-left px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    className="px-3 py-6 text-center"
                                    colSpan={5}
                                >
                                    Loading…
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td
                                    className="px-3 py-6 text-center"
                                    colSpan={5}
                                >
                                    No data
                                </td>
                            </tr>
                        ) : (
                            items.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="px-3 py-2">{p.title}</td>
                                    <td className="px-3 py-2">
                                        {p.portfolio?.name ?? "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                        {p.featured ? "Yes" : "No"}
                                    </td>
                                    <td className="px-3 py-2">
                                        {p.sort_order ?? 0}
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                className="px-2 py-1 rounded-lg border flex items-center gap-1"
                                                onClick={() => setEditing(p)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                className="px-2 py-1 rounded-lg border text-red-600 flex items-center gap-1"
                                                onClick={async () => {
                                                    if (
                                                        !confirm(
                                                            `Delete "${p.title}"?`
                                                        )
                                                    )
                                                        return;
                                                    await deleteProject(
                                                        Number(p.id)
                                                    );
                                                    await refresh();
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {editing && (
                <div className="mt-6 rounded-xl border p-4 bg-white">
                    <h3 className="font-medium mb-3">Edit Project</h3>
                    <ProjectForm
                        initial={editing}
                        onSubmit={async (fd) => {
                            await updateProject(Number(editing.id), fd);
                            setEditing(null);
                            await refresh();
                        }}
                        onCancel={() => setEditing(null)}
                    />
                </div>
            )}
        </Sheet>
    );
}

/* Komponen Sheet (modal sederhana) */
function Sheet({
    children,
    title,
    onClose,
}: {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-gray-50 shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
