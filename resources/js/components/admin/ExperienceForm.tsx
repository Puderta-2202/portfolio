import React, { useEffect, useState } from "react";
import { listPortfoliosSimple } from "../../services/admin";

export default function ExperienceForm({
    initial = {},
    onSubmit,
    onCancel,
}: {
    initial?: any;
    onSubmit: (payload: any) => Promise<void>;
    onCancel?: () => void;
}) {
    const [portfolioId, setPortfolioId] = useState<number | "">(
        initial.portfolio_id ?? ""
    );
    const [company, setCompany] = useState(initial.company ?? "");
    const [position, setPosition] = useState(initial.position ?? "");
    const [startDate, setStartDate] = useState(initial.start_date ?? "");
    const [endDate, setEndDate] = useState(initial.end_date ?? "");
    const [description, setDescription] = useState(initial.description ?? "");
    const [isCurrent, setIsCurrent] = useState(!!initial.is_current_role);
    const [sortOrder, setSortOrder] = useState<number>(initial.sort_order ?? 0);
    const [options, setOptions] = useState<
        Array<{ id: number; name: string; title: string }>
    >([]);

    useEffect(() => {
        listPortfoliosSimple()
            .then(setOptions)
            .catch(() => setOptions([]));
    }, []);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit({
            portfolio_id: portfolioId,
            company,
            position,
            start_date: startDate || null,
            end_date: endDate || null,
            description,
            is_current_role: isCurrent,
            sort_order: sortOrder,
        });
    }

    return (
        <form className="space-y-4" onSubmit={submit}>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Owner Portfolio
                    </label>
                    <select
                        className="w-full rounded-lg border px-3 py-2 bg-white"
                        value={portfolioId}
                        onChange={(e) =>
                            setPortfolioId(
                                e.target.value ? Number(e.target.value) : ""
                            )
                        }
                        required
                    >
                        <option value="">— pilih —</option>
                        {options.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.name} — {o.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Company
                    </label>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Position
                    </label>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        id="cur"
                        type="checkbox"
                        checked={isCurrent}
                        onChange={(e) => setIsCurrent(e.target.checked)}
                    />
                    <label htmlFor="cur" className="text-sm font-medium">
                        Current Role
                    </label>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        className="w-full rounded-lg border px-3 py-2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        className="w-full rounded-lg border px-3 py-2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Sort Order
                    </label>
                    <input
                        type="number"
                        className="w-full rounded-lg border px-3 py-2"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(Number(e.target.value))}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Description
                </label>
                <textarea
                    className="w-full rounded-lg border px-3 py-2 min-h-28"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Save
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
