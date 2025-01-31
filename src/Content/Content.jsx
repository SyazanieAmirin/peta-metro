import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Supabase from "../Supabase";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import NotFound404 from "../NotFound404";
import AdSenseAd from "../Adsense";

export default function Content() {
  const { cityId } = useParams();
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [thumbnailLoading, setThumbnailLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [lastModified, setLastModified] = useState(null);
  const [thumbnailUrls, setThumbnailUrls] = useState({});
  const [randomCities, setRandomCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCityData = async () => {
      const { data: city, error } = await Supabase.from("cities")
        .select("*")
        .eq("image-id", cityId)
        .single();

      if (error) {
        console.error("Error fetching city data:", error);
        setLoading(false);
        return;
      }

      setCityData(city);

      // Get the image URL
      const { data: imagePublicUrl } = Supabase.storage
        .from("cities_maps")
        .getPublicUrl(`${city["image-id"]}.${city["img-ext"]}`);
      
      if (imagePublicUrl) {
        setImageUrl(imagePublicUrl.publicUrl);
        
        // Fetch last modified date from image metadata
        try {
          const response = await fetch(imagePublicUrl.publicUrl, { method: 'HEAD' });
          const lastModifiedHeader = response.headers.get('last-modified');
          if (lastModifiedHeader) {
            setLastModified(new Date(lastModifiedHeader));
          }
        } catch (err) {
          console.error("Error fetching image metadata:", err);
        }
      }

      // Fetch all cities excluding the current one
      const { data: allCities, error: allCitiesError } = await Supabase.from(
        "cities"
      )
        .select("*")
        .neq("image-id", cityId);

      if (!allCitiesError) {
        // Shuffle the results and select the first 4 cities
        const shuffledCities = allCities
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        setRandomCities(shuffledCities);

        // Fetch thumbnail URLs for the random cities
        const thumbnails = {};
        await Promise.all(
          shuffledCities.map(async (city) => {
            const { data: thumbUrl, error: thumbError } = Supabase.storage
              .from("cities_maps")
              .getPublicUrl(`${city["image-id"]}_thumb.webp`);
            if (!thumbError) {
              thumbnails[city["image-id"]] = thumbUrl.publicUrl;
            }
          })
        );
        setThumbnailUrls(thumbnails);
        setThumbnailLoading(false);
      }

      setLoading(false);
    };

    fetchCityData();
  }, [cityId]);

  const formatLastModified = (date) => {
    if (!date) return 'Not available';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

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
          <h2 className="text-white/60 mb-5">
            {cityData.country} | {cityData.continent}
          </h2>
          {isLoading && (
            <div className="w-full h-svh bg-primary rounded-lg animate-pulse"></div>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={cityData["img-alt"]}
              className="rounded-lg mb-3 animate-fade-in"
              onLoad={() => setImageLoading(false)}
              style={{ display: imageLoading ? "none" : "block" }}
            />
          )}

          {cityData.note && (
            <p className="text-white mb-5 font-bold text-center">
              Note: {cityData.note}
            </p>
          )}

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
            <button onClick={handleGoBack} className="bg-red-800 py-2 px-5 rounded-full text-white font-bold">Go Back</button>
            
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-white">Last Update At:</h1>
              <p className="text-white/80">{formatLastModified(lastModified)}</p>
            </div>
            
            <hr />

            <AdSenseAd />

            <div className="flex flex-col gap-5 flex-wrap">
              <h3 className="text-white font-bold">View Other Maps</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                {randomCities.map((city, index) => (
                  <div key={index} className="w-full lg:w-[48%]">
                    <button
                      onClick={() =>
                        (window.location.href = `/${city["image-id"]}`)
                      }
                      className="block w-full"
                    >
                      {thumbnailUrls[city["image-id"]] ? (
                        <img
                          src={thumbnailUrls[city["image-id"]]}
                          alt={city["img-alt"]}
                          className="rounded-lg w-full h-72 object-cover transition-all hover:opacity-80"
                        />
                      ) : (
                        <div className="w-full h-72 bg-gray-300 rounded-lg animate-pulse"></div>
                      )}
                      <p className="text-white text-center font-bold mt-2">
                        {city.city} | {city.country}
                      </p>
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