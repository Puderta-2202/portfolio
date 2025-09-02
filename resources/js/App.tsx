import React from "react";
import { useState, useEffect } from "react";
import { Portfolio } from "./types/portfolio";
import { portfolioApi, healthCheck } from "./services/api";
import { IS_DEVELOPMENT, ENABLE_DEBUG } from "./config/env";
import { PortfolioCard } from "./components/PortfolioCard";
import { PortfolioDetail } from "./components/PortfolioDetail";
import { SearchAndFilter } from "./components/SearchAndFilter";
import { LoadingSpinner, LoadingCard } from "./components/LoadingSpinner";
import { Users, Database, Globe } from "lucide-react";

/* AOS */
import AOS from "aos";
import "aos/dist/aos.css";

/* Admin */
import AdminPanel from "./components/admin/AdminPanel";

type ViewState = "list" | "detail";

export default function App() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolio, setSelectedPortfolio] =
        useState<Portfolio | null>(null);
    const [viewState, setViewState] = useState<ViewState>("list");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [searchResults, setSearchResults] = useState<Portfolio[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    /* NEW: toggle panel admin */
    const [showAdmin, setShowAdmin] = useState(false);

    /* AOS init & refresh */
    useEffect(() => {
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        AOS.init({
            duration: prefersReduced ? 0 : 600,
            easing: "ease-out-cubic",
            once: true,
            offset: 80,
            disable: prefersReduced,
        });
    }, []);
    useEffect(() => {
        AOS.refresh();
    }, [searchResults.length, viewState, isLoading]);

    /* Data init */
    useEffect(() => {
        const initializeApp = async () => {
            if (IS_DEVELOPMENT && ENABLE_DEBUG) {
                const health = await healthCheck();
                if (!health.isHealthy) {
                    setApiError(health.message);
                    console.warn("⚠️ API Health Check Failed:", health.message);
                }
            }
            loadAllPortfolios();
        };
        initializeApp();
    }, []);

    const loadAllPortfolios = async () => {
        try {
            setIsInitialLoading(true);
            setApiError(null);
            const data = await portfolioApi.getAllPortfolios();
            setPortfolios(data);
            setSearchResults(data);
        } catch (error) {
            console.error("Error loading portfolios:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Gagal memuat data portfolio";
            setApiError(errorMessage);
        } finally {
            setIsInitialLoading(false);
        }
    };

    const handlePortfolioClick = async (id: string) => {
        try {
            setIsLoading(true);
            const portfolio = await portfolioApi.getPortfolioById(id);
            if (portfolio) {
                setSelectedPortfolio(portfolio);
                setViewState("detail");
            }
        } catch (error) {
            console.error("Error loading portfolio detail:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedPortfolio(null);
        setViewState("list");
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults(portfolios);
            setIsSearching(false);
            return;
        }
        try {
            setIsLoading(true);
            setIsSearching(true);
            const results = await portfolioApi.searchPortfolios(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching portfolios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkillFilter = async (skill: string) => {
        try {
            setIsLoading(true);
            setIsSearching(true);
            const results = await portfolioApi.filterPortfoliosBySkill(skill);
            setSearchResults(results);
        } catch (error) {
            console.error("Error filtering portfolios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSearchResults(portfolios);
        setIsSearching(false);
    };

    if (isInitialLoading) {
        return (
            <div className="min-h-screen gradient-bg py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div
                            className="glass-card p-8 rounded-2xl mx-auto max-w-2xl"
                            data-aos="zoom-in"
                        >
                            <h1 className="text-4xl font-bold text-white mb-4">
                                Portfolio Database
                            </h1>
                            <p className="text-xl text-white/90">
                                Platform portfolio untuk menampilkan talenta
                                terbaik
                            </p>
                        </div>
                    </div>
                    <div data-aos="fade-up">
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    if (viewState === "detail" && selectedPortfolio) {
        return (
            <div className="min-h-screen gradient-bg py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div data-aos="fade-up">
                            <PortfolioDetail
                                portfolio={selectedPortfolio}
                                onBack={handleBackToList}
                            />
                        </div>
                    )}
                </div>

                {/* FAB Admin tetap tersedia */}
                <FabAdmin onClick={() => setShowAdmin(true)} />
                {showAdmin && (
                    <AdminPanel onClose={() => setShowAdmin(false)} />
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div data-aos="fade-down">
                    <SearchAndFilter
                        onSearch={handleSearch}
                        onSkillFilter={handleSkillFilter}
                        onClearFilters={handleClearFilters}
                        isLoading={isLoading}
                    />
                </div>

                <div className="mb-6" data-aos="fade-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {isSearching
                                    ? "Hasil Pencarian"
                                    : "Semua Portfolio"}
                            </h2>
                            <p className="text-gray-600">
                                Menampilkan {searchResults.length} dari{" "}
                                {portfolios.length} portfolio
                                {isSearching &&
                                    searchResults.length !==
                                        portfolios.length && (
                                        <span className="text-blue-600 ml-1">
                                            (difilter)
                                        </span>
                                    )}
                            </p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 60}
                            >
                                <LoadingCard />
                            </div>
                        ))}
                    </div>
                ) : apiError ? (
                    <div className="text-center py-12" data-aos="zoom-in">
                        {/* ... (bagian error tetap sama) ... */}
                        <div className="max-w-lg mx-auto">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Database className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Koneksi ke Server Gagal
                            </h3>
                            <p className="text-gray-600 mb-4">{apiError}</p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <h4 className="font-medium text-yellow-800 mb-2">
                                    💡 Pastikan Laravel Backend Berjalan:
                                </h4>
                                <div className="text-sm text-yellow-700 space-y-1">
                                    <p>
                                        1. Buka terminal dan masuk ke folder
                                        backend
                                    </p>
                                    <p>
                                        2. Jalankan:{" "}
                                        <code className="bg-yellow-100 px-1 rounded">
                                            php artisan serve
                                        </code>
                                    </p>
                                    <p>
                                        3. Server akan berjalan di:{" "}
                                        <code className="bg-yellow-100 px-1 rounded">
                                            http://localhost:8000
                                        </code>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={loadAllPortfolios}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                🔄 Coba Lagi
                            </button>
                        </div>
                    </div>
                ) : searchResults.length === 0 ? (
                    <div className="text-center py-12" data-aos="fade-up">
                        {/* ... (bagian empty state tetap) ... */}
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {isSearching
                                    ? "Tidak ada hasil ditemukan"
                                    : "Belum ada portfolio"}
                            </h3>
                            <p className="text-gray-600">
                                {isSearching
                                    ? "Coba gunakan kata kunci yang berbeda atau hapus filter yang aktif."
                                    : "Portfolio sedang dimuat dari database."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((portfolio, idx) => (
                            <div
                                key={portfolio.id}
                                data-aos="fade-up"
                                data-aos-delay={Math.min(idx, 10) * 60}
                                data-aos-duration="600"
                                data-aos-anchor-placement="top-bottom"
                            >
                                <PortfolioCard
                                    portfolio={portfolio}
                                    onClick={handlePortfolioClick}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FAB Admin & Panel */}
            <FabAdmin onClick={() => setShowAdmin(true)} />
            {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
        </div>
    );
}

/* Tombol bulat “Admin” kanan-bawah */
function FabAdmin({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            title="Admin"
            className="fixed bottom-6 right-6 rounded-full shadow-lg px-5 py-3 bg-black text-white hover:opacity-90"
        >
            Admin
        </button>
    );
}
