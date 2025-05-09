import React from 'react';
import { Link } from 'react-router-dom';

export default function MainCard({ cityName, countryName, imageAlt, continent, cityId }) {
    const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cities_maps/${cityId}_thumb.webp`;

    return (
        <Link to={`/${cityId}`} className="block group animate-fade-in">
            <div className="bg-secondary rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform group-hover:scale-[1.02] group-hover:shadow-xl">
                {/* Adjusted flex alignment: items-start for mobile, sm:items-center for larger screens */}
                <div className="flex flex-col items-start sm:flex-row sm:items-center gap-4">
                    <img
                        src={imageUrl}
                        alt={imageAlt || `${cityName} map thumbnail`}
                        className="h-32 w-full sm:w-32 object-cover transition-opacity duration-300 group-hover:opacity-90 flex-shrink-0" // Added flex-shrink-0 for image
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = '/placeholder-image.png'; // Ensure you have a placeholder image in your public folder
                            e.target.onerror = null;
                        }}
                    />
                    {/* Ensure text block takes full width on mobile for proper left alignment with padding */}
                    <div className="flex flex-col gap-1 p-4 flex-1 w-full sm:w-auto">
                        <h1 className="text-xl lg:text-2xl font-bold text-white text-left">{cityName}</h1>
                        <h2 className="text-md lg:text-lg text-white/70 text-left">{countryName} | {continent}</h2>
                    </div>
                </div>
            </div>
        </Link>
    );
}