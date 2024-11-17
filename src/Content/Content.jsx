import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Supabase from '../Supabase';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import NotFound404 from '../NotFound404';

export default function Content() {
    const { cityId } = useParams();
    const [cityData, setCityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [thumbnailLoading, setThumbnailLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [thumbnailUrls, setThumbnailUrls] = useState({});
    const [randomCities, setRandomCities] = useState([]);
    const navigate = useNavigate();

    const compressImage = async (imageUrl, quality = 0.5, maxWidth = 1000) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Avoid CORS issues
            img.src = imageUrl;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const scaleFactor = Math.min(maxWidth / img.width, 1); // Scale down if wider than maxWidth
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Compress the image
                const compressedDataUrl = canvas.toDataURL("image/jpeg", quality); // JPEG format
                resolve(compressedDataUrl);
            };

            img.onerror = () => {
                resolve(imageUrl); // Fallback to original if compression fails
            };
        });
    };


    useEffect(() => {
        const fetchCityData = async () => {
            const { data: city, error } = await Supabase
                .from('cities')
                .select('*')
                .eq('image-id', cityId)
                .single();

            if (error) {
                console.error("Error fetching city data:", error);
                setLoading(false);
                return;
            }

            setCityData(city);

            // Fetch the main image URL
            const { data: imagePublicUrl, error: imageError } = Supabase
                .storage
                .from('cities_maps')
                .getPublicUrl(`${city['image-id']}.${city['img-ext']}`);
            if (!imageError) {
                setImageUrl(imagePublicUrl.publicUrl);
            }

            // Fetch random cities excluding the current one
            const { data: otherCities, error: randomError } = await Supabase
                .from('cities')
                .select('*')
                .neq('image-id', cityId)
                .limit(4);

            if (!randomError) {
                setRandomCities(otherCities);

                // THIS IS FOR THUMBNAIL IMAGES
                const fullResUrls = {};
                await Promise.all(
                    otherCities.map(async (city) => {
                        const { data: fullResUrl, error: fullResError } = Supabase
                            .storage
                            .from('cities_maps')
                            .getPublicUrl(`${city['image-id']}.${city['img-ext']}`);

                        if (!fullResError) {
                            const compressedUrl = await compressImage(fullResUrl.publicUrl, 0.5, 500); // Adjust quality & width for thumbnails
                            fullResUrls[city['image-id']] = compressedUrl;
                        }
                    })
                );
                setThumbnailUrls(fullResUrls);
                setThumbnailLoading(false);
            }

            setLoading(false);
        };

        fetchCityData();
    }, [cityId]);


    // Ensure all loading states are handled
    const isLoading = loading || imageLoading || thumbnailLoading;

    const handleGoBack = () => navigate("/");

    if (!cityData) {
        return <NotFound404 />;
    }

    return (
        <>
            <Header onclick={() => (window.location.href = "/")} />
            <div className="max-w-[1200px] mx-auto mt-10 px-5 mb-10 flex flex-col animate-fade-in">
                <div className="flex flex-col gap-1 mb-5">
                    <h1 className="text-3xl font-bold text-white">{cityData.city}</h1>
                    <h2 className="text-white/60 mb-5">{cityData.country} | {cityData.continent}</h2>
                    {isLoading && <div className="w-full h-svh bg-primary rounded-lg animate-pulse"></div>}
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={cityData['img-alt']}
                            className="rounded-lg mb-3 animate-fade-in"
                            onLoad={() => setImageLoading(false)}
                            style={{ display: imageLoading ? 'none' : 'block' }}
                        />
                    )}

                    {cityData.note && <p className="text-white mb-5 font-bold text-center">Note: {cityData.note}</p>}

                    <div className="flex flex-col gap-5 w-full mt-5">
                        <button
                            onClick={() => window.open(imageUrl, "_blank")}
                            className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:opacity-90"
                        >
                            View Image in New Tab
                        </button>
                        <button
                            onClick={() => window.open(cityData["official-site"], "_blank")}
                            className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:opacity-90"
                        >
                            Download (From External Site)
                        </button>
                        {cityData["note-link"] && (
                            <button
                                onClick={() => window.open(cityData["note-link"], "_blank")}
                                className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:opacity-90"
                            >
                                View Note Link
                            </button>
                        )}
                        <button
                            onClick={handleGoBack}
                            className="bg-red-800 py-2 px-5 rounded-full text-white font-bold"
                        >
                            Go Back
                        </button>
                        <hr />

                        <div className="flex flex-col gap-5 flex-wrap">
                            <h3 className="text-white font-bold text-2xl">View Other Maps</h3>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {randomCities.map((city, index) => (
                                    <div key={index} className="w-full lg:w-[48%]">
                                        <button
                                            onClick={() => window.location.href = `/${city['image-id']}`}
                                            className="block w-full"
                                        >
                                            {thumbnailUrls[city['image-id']] ? (
                                                <img
                                                    src={thumbnailUrls[city['image-id']]}
                                                    alt={city['img-alt']}
                                                    className="rounded-lg w-full h-72 object-cover transition-all hover:opacity-80"
                                                />
                                            ) : (
                                                <div className="w-full h-72 bg-gray-300 rounded-lg animate-pulse"></div>
                                            )}
                                            <p className="text-white text-center font-bold mt-2">{city.city} | {city.country}</p>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
