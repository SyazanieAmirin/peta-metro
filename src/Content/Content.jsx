import React, { useState } from 'react';

export default function Content({ cityName, countryName, imageSrc, imageAlt, onClickDownload, onClickView, continent, extraNote, noteLink }) {
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-1 mb-5">
            <h1 className="text-white text-3xl font-bold">{cityName}</h1>
            <h1 className="text-white/60 mb-5">{countryName} | {continent}</h1>
            {isLoading && <h1 className="text-white text-xl font-bold text-center">Loading...</h1>}
            <div className="items-center flex flex-col gap-5">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="rounded-lg"
                    loading="lazy"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
                <button className="mt-5 bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:scale-90" onClick={onClickDownload}>Download (From External Site)</button>
                <button className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:scale-90" onClick={onClickView}>View in new Tab</button>
                {extraNote && <h1 className='text-center text-white text-l font-bold mt-5'>Note: {extraNote} | <a href={noteLink} className='text-blue-200 underline'>Link</a></h1>}
            </div>
        </div>
    )
}
