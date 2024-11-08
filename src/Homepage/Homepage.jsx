// Homepage.jsx
import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';

const Header = lazy(() => import('../Header/Header'));
const Searchbar = lazy(() => import('../Components/Searchbar'));
const MainCard = lazy(() => import('../Components/MainCard'));
const Content = lazy(() => import('../Content/Content'));
import Footer from '../Footer/Footer';
import Data from '../assets/data.json';

import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";

export default function Homepage() {
    const [selectedCity, setSelectedCity] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;  // Show 15 items per page

    const handleDownload = (website) => {
        window.open(website, "_blank");
    };

    const handleView = (image) => {
        window.open(image, "_blank");
    };

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
        setSelectedCity(null);
        setCurrentPage(1);  // Reset to first page on when the user searches
    };
    const filteredData = useMemo(() =>
        Data.filter(city =>
            city.city.toLowerCase().includes(searchInput.toLowerCase()) ||
            city.country.toLowerCase().includes(searchInput.toLowerCase()) ||
            city.continent.toLowerCase().includes(searchInput.toLowerCase()) ||
            city.shortened?.toLowerCase().includes(searchInput.toLowerCase()),
        ),
        [searchInput]
    );

    // Calculate paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const maxVisiblePages = 5;  // Maximum number of visible page buttons

    const [visibleRange, setVisibleRange] = useState({ start: 0, end: maxVisiblePages });

    useEffect(() => {
        // Reset visible range when search input changes
        setVisibleRange({ start: 0, end: maxVisiblePages });
    }, [searchInput]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0 });

        // Adjust visible range if the current page is near the edges
        if (page > visibleRange.end) {
            setVisibleRange({ start: visibleRange.start + 1, end: visibleRange.end + 1 });
        } else if (page < visibleRange.start + 1) {
            setVisibleRange({ start: visibleRange.start - 1, end: visibleRange.end - 1 });
        }
    };

    // Move range left or right when arrows are clicked
    const handleLeftArrow = () => {
        if (visibleRange.start > 0) {
            setVisibleRange({ start: visibleRange.start - 1, end: visibleRange.end - 1 });
        }
    };

    const handleRightArrow = () => {
        if (visibleRange.end < totalPages) {
            setVisibleRange({ start: visibleRange.start + 1, end: visibleRange.end + 1 });
        }
    };



    return (
        <Suspense>
            <div className="flex flex-col gap-5 bg-primary-accent items-end lg:items-start animate-fade-in">
                <Header onclick={() => { setSelectedCity(null); setSearchInput(""); }} />
            </div>
            <div className="max-w-[1200px] mx-auto mt-10 px-5 mb-10 flex flex-col animate-fade-in">
                <h1 className='font-bold text-white text-xl mb-2 animate-fade-in'>Search Map Here</h1>
                <Searchbar
                    placeholder="Example: Bangkok | Thailand | Asia | BKK"
                    value={searchInput}
                    onChange={handleSearchChange}
                />

                <h1 className='font-bold text-white/70 text-lg mt-5 text-right'>
                    Number of Maps: {filteredData.length}
                </h1>

                {selectedCity && (
                    <button className='bg-primary py-2 px-5 w-full max-w-[200px] rounded-full text-white font-bold transition-all hover:scale-90 mt-5' onClick={() => { setSelectedCity(null); setSearchInput(""); }}>
                        Go Back
                    </button>
                )}

                <div key={currentPage} className='flex flex-col gap-5 mt-5 animate-fade-in'>
                    {selectedCity ? (
                        <Content
                            cityName={selectedCity.city}
                            countryName={selectedCity.country}
                            continent={selectedCity.continent}
                            imageSrc={`./${selectedCity['image-id']}.${selectedCity['img-ext']}`}
                            imageAlt={selectedCity['img-alt']}
                            onClickDownload={() => handleDownload(selectedCity["official-site"])}
                            onClickView={() => handleView(`./${selectedCity['image-id']}.${selectedCity['img-ext']}`)}
                            extraNote={selectedCity.note}
                            noteLink={selectedCity['note-link']}
                            searchInput={searchInput}
                            onSearchChange={handleSearchChange}
                        />
                    ) : (
                        paginatedData.length > 0 ? (
                            paginatedData.map((city, index) => (
                                <MainCard
                                    key={index}
                                    cityName={city.city}
                                    countryName={city.country}
                                    continent={city.continent}
                                    image={`./${city['image-id']}_thumb.webp`}
                                    imageAlt={city['img-alt']}
                                    cityId={city['image-id']}
                                    onClick={() => {
                                        setSelectedCity(city);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                />
                            ))
                        ) : (
                            searchInput && <h1 className="text-white text-xl font-bold text-center">No results found. Please search using only City's name, Country's name or the Continent's name</h1>
                        )
                    )}
                </div>


                <div className="flex justify-center mt-5">
                    {visibleRange.start > 0 && (
                        <button
                            onClick={handleLeftArrow}
                            className="px-3 py-2 mx-1 rounded-full font-bold bg-gray-100 transition-all hover:opacity-70"
                        >
                            <FaChevronLeft />
                        </button>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(visibleRange.start, visibleRange.end)
                        .map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 mx-1 rounded-full font-bold ${page === currentPage ? 'bg-primary text-white' : 'bg-gray-400 transition-all hover:opacity-70'}`}
                            >
                                {page}
                            </button>
                        ))}

                    {visibleRange.end < totalPages && (
                        <button
                            onClick={handleRightArrow}
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
