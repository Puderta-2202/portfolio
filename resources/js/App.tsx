import { useState, useEffect } from 'react';
import { Portfolio } from './types/portfolio';
import { portfolioApi, healthCheck } from './services/api';
import { IS_DEVELOPMENT, ENABLE_DEBUG } from './config/env';
import { PortfolioCard } from './components/PortfolioCard';
import { PortfolioDetail } from './components/PortfolioDetail';
import { SearchAndFilter } from './components/SearchAndFilter';
import { LoadingSpinner, LoadingCard } from './components/LoadingSpinner';
import { Users, Database, Globe } from 'lucide-react';

type ViewState = 'list' | 'detail';

export default function App() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [viewState, setViewState] = useState<ViewState>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Portfolio[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load initial data and check API health
  useEffect(() => {
    const initializeApp = async () => {
      if (IS_DEVELOPMENT && ENABLE_DEBUG) {
        // Check API health in development
        const health = await healthCheck();
        if (!health.isHealthy) {
          setApiError(health.message);
          console.warn('⚠️ API Health Check Failed:', health.message);
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
      console.error('Error loading portfolios:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat data portfolio';
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
        setViewState('detail');
      }
    } catch (error) {
      console.error('Error loading portfolio detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedPortfolio(null);
    setViewState('list');
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
      console.error('Error searching portfolios:', error);
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
      console.error('Error filtering portfolios:', error);
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
            <div className="glass-card p-8 rounded-2xl mx-auto max-w-2xl">
              <h1 className="text-4xl font-bold text-white mb-4">Portfolio Database</h1>
              <p className="text-xl text-white/90">Platform portfolio untuk menampilkan talenta terbaik</p>
            </div>
          </div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (viewState === 'detail' && selectedPortfolio) {
    return (
      <div className="min-h-screen gradient-bg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? <LoadingSpinner /> : (
            <PortfolioDetail 
              portfolio={selectedPortfolio} 
              onBack={handleBackToList}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="glass-card p-8 rounded-2xl mx-auto max-w-4xl mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="p-4 gradient-secondary rounded-2xl animate-gradient">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white">Portfolio Database</h1>
            </div>
            <p className="text-xl text-white/90 mb-8">
              Platform portfolio untuk menampilkan talenta terbaik dari berbagai bidang
            </p>
            
            {/* Statistics */}
            <div className="flex justify-center items-center gap-8 text-white/80">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Database className="w-5 h-5" />
                <span className="font-medium">{portfolios.length} Portfolio Tersedia</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Globe className="w-5 h-5" />
                <span className="font-medium">Data Real-time dari Database</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          onSearch={handleSearch}
          onSkillFilter={handleSkillFilter}
          onClearFilters={handleClearFilters}
          isLoading={isLoading}
        />

        {/* Results Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {isSearching ? 'Hasil Pencarian' : 'Semua Portfolio'}
              </h2>
              <p className="text-gray-600">
                Menampilkan {searchResults.length} dari {portfolios.length} portfolio
                {isSearching && searchResults.length !== portfolios.length && (
                  <span className="text-blue-600 ml-1">
                    (difilter)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : apiError ? (
          <div className="text-center py-12">
            <div className="max-w-lg mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Koneksi ke Server Gagal
              </h3>
              <p className="text-gray-600 mb-4">
                {apiError}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">💡 Pastikan Laravel Backend Berjalan:</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p>1. Buka terminal dan masuk ke folder backend</p>
                  <p>2. Jalankan: <code className="bg-yellow-100 px-1 rounded">php artisan serve</code></p>
                  <p>3. Server akan berjalan di: <code className="bg-yellow-100 px-1 rounded">http://localhost:8000</code></p>
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
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isSearching ? 'Tidak ada hasil ditemukan' : 'Belum ada portfolio'}
              </h3>
              <p className="text-gray-600">
                {isSearching 
                  ? 'Coba gunakan kata kunci yang berbeda atau hapus filter yang aktif.'
                  : 'Portfolio sedang dimuat dari database.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((portfolio) => (
              <PortfolioCard 
                key={portfolio.id} 
                portfolio={portfolio} 
                onClick={handlePortfolioClick}
              />
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500 py-8 border-t border-gray-200">
          <p>
            💾 Data disimpan dan diambil dari database secara real-time
          </p>
          <p className="mt-1">
            🔄 Terakhir diperbarui: {new Date().toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}