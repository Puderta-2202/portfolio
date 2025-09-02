import React, { useEffect, useMemo, useState } from "react";
import { listPortfoliosSimple } from "../../services/admin";

type Props = {
    initial?: any; // buat edit mode
    onSubmit: (fd: FormData) => Promise<void> | void;
    onCancel: () => void;
};

type SimplePortfolio = { id: number; name: string };

function isValidUrl(v?: string) {
    if (!v) return false;
    try {
        const u = new URL(v);
        return !!u.protocol && !!u.host;
    } catch {
        return false;
    }
}

function makeSlug(s: string) {
    return s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default function ProjectForm({ initial, onSubmit, onCancel }: Props) {
    const [title, setTitle] = useState<string>(initial?.title ?? "");
    const [slug, setSlug] = useState<string>(initial?.slug ?? "");
    const [stack, setStack] = useState<string>(initial?.stack ?? "");
    const [description, setDescription] = useState<string>(
        initial?.description ?? ""
    );
    const [repositoryUrl, setRepositoryUrl] = useState<string>(
        initial?.repository_url ?? ""
    );
    const [demoUrl, setDemoUrl] = useState<string>(initial?.demo_url ?? "");
    const [portfolioId, setPortfolioId] = useState<number | "">(
        initial?.portfolio_id ?? ""
    );
    const [featured, setFeatured] = useState<boolean>(!!initial?.featured);
    const [sortOrder, setSortOrder] = useState<number>(
        Number(initial?.sort_order ?? 0)
    );
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const [portfolios, setPortfolios] = useState<SimplePortfolio[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({}); // dari 422
    const [genericError, setGenericError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await listPortfoliosSimple();
                // backend kamu biasanya kirim {data:[{id,name},...]} atau langsung array
                const items: SimplePortfolio[] = Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res)
                    ? res
                    : [];
                if (mounted) setPortfolios(items);
            } catch (e) {
                // ga fatal buat form, cuma dropdown kosong
                console.warn("Failed to load portfolios", e);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // auto-generate slug kalau kosong
    useEffect(() => {
        if (!initial && title && !slug) {
            setSlug(makeSlug(title));
        }
    }, [title]); // eslint-disable-line

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setGenericError(null);

        // client-side minimal validation
        const clientErr: Record<string, string[]> = {};
        if (!title?.trim()) clientErr.title = ["Title is required."];
        if (!slug?.trim()) clientErr.slug = ["Slug is required."];
        if (!portfolioId) clientErr.portfolio_id = ["Portfolio is required."];

        // URL optional, tapi kalau diisi harus valid
        if (repositoryUrl && !isValidUrl(repositoryUrl)) {
            clientErr.repository_url = [
                "Repository URL must be a valid URL (https://...)",
            ];
        }
        if (demoUrl && !isValidUrl(demoUrl)) {
            clientErr.demo_url = ["Demo URL must be a valid URL (https://...)"];
        }

        if (Object.keys(clientErr).length > 0) {
            setErrors(clientErr);
            setSubmitting(false);
            return;
        }

        try {
            const fd = new FormData();
            fd.append("title", title.trim());
            fd.append("slug", slug.trim());
            if (stack) fd.append("stack", stack);
            if (description) fd.append("description", description);
            // kirim hanya kalau valid
            if (isValidUrl(repositoryUrl))
                fd.append("repository_url", repositoryUrl);
            if (isValidUrl(demoUrl)) fd.append("demo_url", demoUrl);

            fd.append("portfolio_id", String(portfolioId));
            fd.append("featured", featured ? "1" : "0");
            fd.append(
                "sort_order",
                String(Number.isFinite(sortOrder) ? sortOrder : 0)
            );

            if (thumbnail) fd.append("thumbnail", thumbnail);

            await onSubmit(fd);
        } catch (err: any) {
            // kalau admin.ts melempar Error(text), coba parse JSON validation dari backend
            try {
                const j = JSON.parse(err.message);
                if (j?.errors) setErrors(j.errors);
                else setGenericError(j?.message || "Failed to submit");
            } catch {
                setGenericError(err?.message || "Failed to submit");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {genericError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {genericError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm mb-1">Title</label>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title?.map((m, i) => (
                        <p key={i} className="text-xs text-red-600 mt-1">
                            {m}
                        </p>
                    ))}
                </div>

                <div>
                    <label className="block text-sm mb-1">Slug</label>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                    />
                    {errors.slug?.map((m, i) => (
                        <p key={i} className="text-xs text-red-600 mt-1">
                            {m}
                        </p>
                    ))}
                </div>

                <div>
                    <label className="block text-sm mb-1">Stack</label>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={stack}
                        onChange={(e) => setStack(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Portfolio</label>
                    <select
                        className="w-full rounded-lg border px-3 py-2"
                        value={portfolioId}
                        onChange={(e) =>
                            setPortfolioId(
                                e.target.value ? Number(e.target.value) : ""
                            )
                        }
                    >
                        <option value="">— Choose —</option>
                        {portfolios.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    {errors.portfolio_id?.map((m, i) => (
                        <p key={i} className="text-xs text-red-600 mt-1">
                            {m}
                        </p>
                    ))}
                </div>

                <div>
                    <label className="block text-sm mb-1">Repository URL</label>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={repositoryUrl}
                        onChange={(e) => setRepositoryUrl(e.target.value)}
                        placeholder="https://github.com/…"
                    />
                    {errors.repository_url?.map((m, i) => (
                        <p key={i} className="text-xs text-red-600 mt-1">
                            {m}
                        </p>
                    ))}
                </div>

                <div>
                    <label className="block text-sm mb-1">Demo URL</label>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        placeholder="https://example.com/…"
                    />
                    {errors.demo_url?.map((m, i) => (
                        <p key={i} className="text-xs text-red-600 mt-1">
                            {m}
                        </p>
                    ))}
                </div>

                <div>
                    <label className="block text-sm mb-1">Sort order</label>
                    <input
                        type="number"
                        className="w-full rounded-lg border px-3 py-2"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(Number(e.target.value))}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        id="featured"
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <label htmlFor="featured" className="text-sm select-none">
                        Featured
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-sm mb-1">Thumbnail</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm"
                />
                {errors.thumbnail?.map((m, i) => (
                    <p key={i} className="text-xs text-red-600 mt-1">
                        {m}
                    </p>
                ))}
            </div>

            <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                    className="w-full rounded-lg border px-3 py-2"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                    {submitting ? "Saving…" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg border"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
