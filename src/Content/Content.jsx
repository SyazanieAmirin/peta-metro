import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Data from '../assets/data.json';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import NotFound404 from '../NotFound404';

export default function Content() {
    const { cityId } = useParams();
    const cityData = Data.find(city => city['image-id'] === cityId);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    if (!cityData) {
        return <NotFound404 />;
    }

    const handleGoBack = () => {
        navigate("/");
    };

    // On load, scroll to top
    window.scrollTo({ top: 0 });

    return (
        <>
            <Header onclick={() => (window.location.href = "/")} />
            <div className="max-w-[1200px] mx-auto mt-10 px-5 mb-10 flex flex-col animate-fade-in">
                <div className="flex flex-col gap-1 mb-5">
                    <h1 className="text-3xl font-bold text-white">{cityData.city}</h1>
                    <h2 className="text-white/60 mb-5">{cityData.country} | {cityData.continent}</h2>
                    {loading && <div className="w-full h-svh bg-primary rounded-lg animate-pulse"></div>}
                    <img
                        src={`./${cityData['image-id']}.${cityData['img-ext']}`}
                        alt={cityData['img-alt']}
                        className="rounded-lg mb-3 animate-fade-in"
                        onLoad={() => setLoading(false)}
                        style={{ display: loading ? 'none' : 'block' }}
                    />

                    {cityData.note && <p className="text-white mb-5 font-bold text-center">Note: {cityData.note}</p>}

                    <div className='flex flex-col gap-5 w-full mt-5'>
                        <button onClick={() => window.open(`./${cityData['image-id']}.${cityData['img-ext']}`, "_blank")} className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:opacity-90">View Image in New Tab</button>
                        <button onClick={() => window.open(cityData["official-site"], "_blank")} className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:opacity-90">Download (From External Site)</button>
                        {cityData["note-link"] && (
                            <button
                                onClick={() => window.open(cityData["note-link"], "_blank")}
                                className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:opacity-90"
                            >
                                View Note Link
                            </button>
                        )}
                        <button onClick={handleGoBack} className="bg-red-800 py-2 px-5 rounded-full text-white font-bold">Go Back</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
