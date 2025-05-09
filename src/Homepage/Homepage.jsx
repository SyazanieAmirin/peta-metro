import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import Supabase from '../Supabase';
// Lazy load components
const Header = lazy(() => import('../Header/Header'));
const Searchbar = lazy(() => import('../Components/Searchbar'));
const MainCard = lazy(() => import('../Components/MainCard'));
// Eager load Footer as it's simple and always needed
import Footer from '../Footer/Footer';
import AdSenseAd from '../Adsense';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

// Dedicated loader for the initial data fetching phase of the Homepage
const InitialPageLoader = () => (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background text-white">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary mb-4"></div>
        <p className="text-xl font-semibold">Loading Metro Maps...</p>
    </div>
);

// Fallback loader for React.lazy Suspense (for component chunks)
const LazyComponentLoader = () => (
    <div className="flex justify-center items-center py-20 bg-background"> {/* Adjusted height for component context */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
);

export default function Homepage() {
    const [data, setData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true); // Primary loading state for city data
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [pageSetIndex, setPageSetIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setIsDataLoading(true); // Set loading true at the start
            try {
                const { data: cities, error } = await Supabase
                    .from('cities')
                    .select('*'); // You can specify columns if not all are needed: 'image-id, city, country, continent, img-alt, shortened'

                if (error) {
                    console.error("Error fetching city data:", error);
                    throw error; // Let it be caught by the catch block
                }
                setData(cities || []); // Ensure data is an array even if Supabase returns null
            } catch (error) {
                // In case of an error, setData to an empty array so the page can still render "No results"
                setData([]);
                // Optionally, you could set an error state here to show a specific error message to the user
            } finally {
                setIsDataLoading(false); // Set loading false once fetch is complete (success or fail)
            }
        };
        fetchData();
    }, []); // Empty dependency array, so it runs once on mount

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
        setCurrentPage(1);
        setPageSetIndex(0);
    };

    const filteredData = useMemo(
        () =>
            data.filter(city =>
                city.city.toLowerCase().includes(searchInput.toLowerCase()) ||
                city.country.toLowerCase().includes(searchInput.toLowerCase()) ||
                city.continent.toLowerCase().includes(searchInput.toLowerCase()) ||
                city.shortened?.toLowerCase().includes(searchInput.toLowerCase())
            ),
        [searchInput, data]
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPageSet = () => {
        setPageSetIndex(prev => Math.max(0, prev - 1));
    };

    const handleNextPageSet = () => {
        const maxPageSetIndex = Math.floor((totalPages - 1) / 5);
        setPageSetIndex(prev => Math.min(maxPageSetIndex, prev + 1));
    };

    // If data is still loading, show the initial page loader and nothing else.
    // This prevents rendering of the main layout or Suspense fallbacks for child components prematurely.
    if (isDataLoading) {
        return <InitialPageLoader />;
    }

    // If data loading is complete, proceed to render the main page structure
    return (
        <Suspense fallback={<LazyComponentLoader />}>
            <div className="flex flex-col min-h-screen bg-background">
                <Header onClick={() => { setSearchInput(''); setCurrentPage(1); setPageSetIndex(0); }} />
                <main className="flex-grow">
                    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 animate-fade-in">
                        <h1 className="font-bold text-white text-2xl md:text-3xl mb-4">Discover Metro Maps</h1>
                        <Searchbar
                            placeholder="E.g., Tokyo, Japan, Asia, TYO"
                            value={searchInput}
                            onChange={handleSearchChange}
                        />

                        <h2 className="font-semibold text-white/80 text-lg mt-6 mb-4 text-right">
                            Available Maps: {filteredData.length}
                        </h2>

                        {paginatedData.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {paginatedData.map((city, index) => (
                                    <React.Fragment key={city['image-id']}>
                                        <MainCard
                                            cityName={city.city}
                                            countryName={city.country}
                                            continent={city.continent}
                                            imageAlt={city['img-alt']}
                                            cityId={city['image-id']}
                                        />
                                        {/* Render AdSense ad every 5 cards, but not if it's the last item in a sparse page */}
                                        {(index + 1) % 5 === 0 && paginatedData.length > index + 1 && (
                                            <div className="my-4"><AdSenseAd /></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <h3 className="text-white text-xl font-semibold">No results found.</h3>
                                <p className="text-white/70 mt-2">Try searching by city, country, local name (e.g., KL for Kuala Lumpur), or continent.</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center my-8 space-x-2">
                                {pageSetIndex > 0 && (
                                    <button
                                        onClick={handlePrevPageSet}
                                        className="p-3 rounded-full text-white bg-secondary hover:bg-secondary-light transition-colors"
                                        aria-label="Previous page set"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                )}

                                {(() => {
                                    const pages = [];
                                    const startPageInSet = pageSetIndex * 5 + 1;
                                    for (let i = 0; i < 5 && startPageInSet + i <= totalPages; i++) {
                                        pages.push(startPageInSet + i);
                                    }
                                    return pages.map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded-md font-semibold transition-colors ${page === currentPage
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'bg-secondary text-white/80 hover:bg-secondary-light'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ));
                                })()}

                                {(pageSetIndex + 1) * 5 < totalPages && (
                                    <button
                                        onClick={handleNextPageSet}
                                        className="p-3 rounded-full text-white bg-secondary hover:bg-secondary-light transition-colors"
                                        aria-label="Next page set"
                                    >
                                        <FaChevronRight />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </Suspense>
    );
}