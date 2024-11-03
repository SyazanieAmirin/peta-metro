// Homepage.jsx
import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';

const Header = lazy(() => import('../Header/Header'));
const Searchbar = lazy(() => import('../Components/Searchbar'));
const MainCard = lazy(() => import('../Components/MainCard'));
const Content = lazy(() => import('../Content/Content'));
import Footer from '../Footer/Footer';
import Data from '../assets/data.json';

export default function Homepage() {
    const [selectedCity, setSelectedCity] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;  // Show 15 items per page

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0 });
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
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-4 py-2 mx-1 rounded-full font-bold ${i + 1 === currentPage ? 'bg-primary text-white' : 'bg-gray-300 transition-all hover:opacity-70'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
            <Footer />
        </Suspense>
    );
}
