import React from 'react';
import { Link } from 'react-router-dom';

export default function MainCard({ cityName, countryName, image, imageAlt, continent, cityId }) {
    // Construct the image URL directly in the component
    const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cities_maps/${cityId}_thumb.webp`;

    return (
        <Link to={`/${cityId}`}>
            <div className="bg-secondary rounded-lg transition-all lg:hover:opacity-50 hover:cursor-pointer mt-5 animate-fade-in">
                <div className="flex flex-row gap-5 items-center">
                    <img
                        src={imageUrl}
                        alt={imageAlt || `${cityName} map`}
                        className="h-[120px] w-[120px] rounded-lg opacity-70"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = '/placeholder-image.png'; // Add a placeholder image if load fails
                            e.target.onerror = null; // Prevent infinite loop
                        }}
                    />
                    <div className="flex flex-col gap-1 py-5 flex-1">
                        <h1 className="text-xl lg:text-2xl font-bold text-white">{cityName}</h1>
                        <h1 className="lg:text-lg text-white/70">{countryName} | {continent}</h1>
                    </div>
                </div>
            </div>
        </Link>
    );
}