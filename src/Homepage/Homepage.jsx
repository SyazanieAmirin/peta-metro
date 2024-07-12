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

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchInput(searchInput);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchInput]);

    const handleCardClick = (city) => {
        setSelectedCity(city);
        window.scrollTo(0, 0);
        setSearchInput('');
    };

    const handleDownload = (website) => {
        window.open(website, "_blank");
    };

    const handleView = (image) => {
        window.open(image, "_blank");
    };

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
        setSelectedCity(null);

        if (searchInput != "") {
            setEmptySearch(true);
        }
    };

    const filteredData = useMemo(() =>
        Data.filter(city =>
            city.city.toLowerCase().includes(debouncedSearchInput.toLowerCase()) ||
            city.country.toLowerCase().includes(debouncedSearchInput.toLowerCase()) ||
            city.continent.toLowerCase().includes(debouncedSearchInput.toLowerCase())

        ),
        [debouncedSearchInput]
    );


    return (
        <Suspense>
            <div className="flex flex-col gap-5 bg-primary-accent items-end lg:items-start">
                <Header onclick={() => { setSelectedCity(null); setSearchInput(""); }} onClickItems={() => { setSelectedCity(null); setSearchInput(""); }} />
            </div>
            <div className="max-w-[1200px] mx-auto mt-10 px-5 mb-10">
                <h1 className='font-bold text-white text-xl mb-2'>Search Map Here</h1>
                <Searchbar
                    placeholder="City, Country, or Continent only"
                    value={searchInput}
                    onChange={handleSearchChange}
                />

                <div className='flex flex-col gap-5 mt-10'>
                    {selectedCity ? (
                        <Content
                            cityName={selectedCity.city}
                            countryName={selectedCity.country}
                            continent={selectedCity.continent}
                            imageSrc={`./${selectedCity['image-id']}.${selectedCity['img-ext']}`}
                            imageAlt={selectedCity['img-alt']}
                            onClickDownload={() => handleDownload(selectedCity["official-site"])}
                            onClickView={() => handleView(`./${selectedCity['image-id']}.${selectedCity['img-ext']}`)}
                        />
                    ) : (
                        filteredData.length > 0 ? (
                            filteredData.map((city, index) => (
                                <MainCard
                                    key={index}
                                    cityName={city.city}
                                    countryName={city.country}
                                    continent={city.continent}
                                    image={`./${city['image-id']}_thumb.webp`}
                                    imageAlt={city['img-alt']}
                                    onClick={() => handleCardClick(city)}
                                />
                            ))
                        ) : (
                            debouncedSearchInput && <h1 className="text-white text-xl font-bold text-center">No results found. Please search using only City's name, Country's name or the Continent's name</h1>
                        )
                    )}
                </div>
            </div>
            <Footer />
        </Suspense>
    );
}
