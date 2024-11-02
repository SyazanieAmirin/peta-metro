// Content.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Data from '../assets/data.json';
import Header from '../Header/Header';
import Searchbar from '../Components/Searchbar';
import { useNavigate } from 'react-router-dom';

export default function Content({ searchInput, onSearchChange }) {
    const { cityId } = useParams();
    const cityData = Data.find(city => city['image-id'] === cityId);

    if (!cityData) {
        return <h1 className="text-white">City not found</h1>;
    }

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <>
            <Header onclick={() => window.history.back()} />
            <div className="max-w-[1200px] mx-auto mt-10 px-5 mb-10 flex flex-col">
                <div className="flex flex-col gap-1 mb-5 mt-5">
                    <h1 className="text-3xl font-bold text-white">{cityData.city}</h1>
                    <h2 className="text-white/60 mb-5">{cityData.country} | {cityData.continent}</h2>
                    <img src={`./${cityData['image-id']}.${cityData['img-ext']}`} alt={cityData['img-alt']} className="rounded-lg mb-3" />
                    {cityData.note && <p className="text-white mb-5 font-bold text-center">Note: {cityData.note}</p>}

                    <div className='flex flex-col gap-5 w-full mt-5'>
                        <button onClick={() => window.open(`./${cityData['image-id']}.${cityData['img-ext']}`, "_blank")} className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:opacity-90">View Image in New Tab</button>
                        <button onClick={() => window.open(cityData["official-site"], "_blank")} className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:opacity-90">Download (From External Site)</button>
                        <button onClick={handleGoBack} className="bg-primary opacity-70 py-2 px-5 rounded-full text-[#cbcbcb] font-bold transition-all hover:opacity-100">Go Back</button>
                    </div>
                </div>
            </div>
        </>
    );
}
