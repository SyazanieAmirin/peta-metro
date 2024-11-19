import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import Supabase from '../Supabase';
const Header = lazy(() => import('../Header/Header'));
const Searchbar = lazy(() => import('../Components/Searchbar'));
const MainCard = lazy(() => import('../Components/MainCard'));
import Footer from '../Footer/Footer';

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function Homepage() {

    // Adsense
    useEffect(() => {
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5336437476198786"
            crossorigin="anonymous"></script>
    }, []);

    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [pageSetIndex, setPageSetIndex] = useState(0); // Add this new state

    const fetchData = async () => {
        try {
            const { data: cities, error } = await Supabase
                .from('cities')
                .select('*');
            if (error) throw error;
            setData(cities);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0 });
    };


    const handlePrevPageSet = () => {
        setPageSetIndex(prev => Math.max(0, prev - 1));
    };

    const handleNextPageSet = () => {
        setPageSetIndex(prev => Math.min(Math.floor((totalPages - 1) / 5), prev + 1));
    };


    return (
        <Suspense>
            <div className="flex flex-col gap-5 bg-primary-accent items-end lg:items-start animate-fade-in">
                <Header onClick={() => setSearchInput('')} />
            </div>
            <div className="max-w-[1200px] mx-auto mt-10 px-5 mb-10 flex flex-col animate-fade-in">
                <h1 className="font-bold text-white text-xl mb-2">Search Map Here</h1>
                <Searchbar
                    placeholder="Example: Bangkok | Thailand | Asia | BKK"
                    value={searchInput}
                    onChange={handleSearchChange}
                />

                <h1 className="font-bold text-white/70 text-lg mt-5 text-right">
                    Number of Maps: {filteredData.length}
                </h1>

                <div className="flex flex-col gap-5 mt-5">
                    {paginatedData.length > 0 ? (
                        paginatedData.map((city) => (
                            <MainCard
                                key={city['image-id']}
                                cityName={city.city}
                                countryName={city.country}
                                continent={city.continent}
                                imageAlt={city['img-alt']}
                                cityId={city['image-id']}
                            />
                        ))
                    ) : (
                        <h1 className="text-white text-xl font-bold text-center">
                            No results found. You can search using the city's name, country, local name (Such as: KL for Kuala Lumpur) or the continent.
                        </h1>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-5">
                    {pageSetIndex > 0 && (
                        <button
                            onClick={handlePrevPageSet}
                            className="px-3 py-2 mx-1 rounded-full font-bold bg-gray-100 transition-all hover:opacity-70"
                        >
                            <FaChevronLeft />
                        </button>
                    )}

                    {(() => {
                        const pages = [];
                        const startPage = pageSetIndex * 5 + 1;

                        // Generate exactly 5 page numbers or less if at the end
                        for (let i = 0; i < 5 && startPage + i <= totalPages; i++) {
                            pages.push(startPage + i);
                        }

                        return pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 mx-1 rounded-full font-bold ${page === currentPage
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-400'
                                    }`}
                            >
                                {page}
                            </button>
                        ));
                    })()}

                    {(pageSetIndex + 1) * 5 < totalPages && (
                        <button
                            onClick={handleNextPageSet}
                            className="px-3 py-2 mx-1 rounded-full font-bold bg-gray-100 transition-all hover:opacity-70"
                        >
                            <FaChevronRight />
                        </button>
                    )}
                </div>
            </div>
            <Footer />
        </Suspense>
    );
}