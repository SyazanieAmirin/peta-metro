import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Supabase from "../Supabase";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import NotFound404 from "../NotFound404";
import AdSenseAd from "../Adsense";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import {
  FaSearchPlus, FaSearchMinus, FaRedo, FaSun, FaMoon, // FaUndo is often for text, FaRedo for clockwise
  FaAdjust, FaExpand, FaCompress, FaSyncAlt, FaChevronDown, FaChevronUp, FaHistory, FaMagic, FaUndoAlt
} from "react-icons/fa"; // FaUndoAlt for rotate left, FaRedo for rotate right, FaHistory for reset filters, FaMagic for tools

// Loader component for images (no changes from previous version)
const ImageWithLoader = ({ src, alt, className, onLoad, imgRef, style }) => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && <div className={`w-full h-96 bg-surface rounded-lg animate-pulse ${className}`}></div>}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'hidden' : 'block'} animate-fade-in`}
        onLoad={() => { setLoading(false); if (onLoad) onLoad(); }}
        onError={(e) => {
          e.target.style.display = 'none';
          const parent = e.target.parentNode;
          if (parent) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'w-full h-96 bg-surface rounded-lg flex items-center justify-center text-text-secondary';
            errorDiv.textContent = 'Image failed to load.';
            if (e.target.nextSibling) {
              parent.insertBefore(errorDiv, e.target.nextSibling);
            } else {
              parent.appendChild(errorDiv);
            }
          }
        }}
        style={style}
      />
    </>
  );
};

// Updated ImageControls component with expandable/collapsible functionality
const ImageControls = ({
  applyRotation,
  applyBrightness,
  applyContrast,
  resetAllImageEffects, // Renamed for clarity: combines filter reset and zoom/pan reset
  toggleFullscreen,
  isFullscreen
}) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleResetAll = () => {
    resetAllImageEffects(); // This function is passed from Content, should reset rotation, brightness, contrast
    resetTransform();       // This resets zoom and pan from useControls
  };

  return (
    <div className="bg-surface rounded-lg shadow-md mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-3 text-left text-text-primary hover:bg-secondary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-expanded={isExpanded}
        aria-controls="image-tools-panel"
      >
        <span className="font-semibold flex items-center">
          <FaMagic className="mr-2 text-primary" /> Image Tools
        </span>
        {isExpanded ? <FaChevronUp size="1em" /> : <FaChevronDown size="1em" />}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}
      // Using max-h for accordion effect. Adjust [500px] if more space is needed.
      >
        <div
          id="image-tools-panel"
          className="p-3 border-t border-secondary flex flex-wrap gap-2 justify-center items-center"
        >
          <button onClick={() => zoomIn(0.2)} className="btn btn-secondary p-2" title="Zoom In"><FaSearchPlus size="1.2em" /></button>
          <button onClick={() => zoomOut(0.2)} className="btn btn-secondary p-2" title="Zoom Out"><FaSearchMinus size="1.2em" /></button>
          <button onClick={() => resetTransform()} className="btn btn-secondary p-2" title="Reset Zoom & Pan"><FaSyncAlt size="1.2em" /></button>
          <button onClick={() => applyRotation(-15)} className="btn btn-secondary p-2" title="Rotate Left"><FaUndoAlt size="1.2em" /></button>
          <button onClick={() => applyRotation(15)} className="btn btn-secondary p-2" title="Rotate Right"><FaRedo size="1.2em" /></button>
          <button onClick={() => applyBrightness(-10)} className="btn btn-secondary p-2" title="Decrease Brightness"><FaMoon size="1.2em" /></button>
          <button onClick={() => applyBrightness(10)} className="btn btn-secondary p-2" title="Increase Brightness"><FaSun size="1.2em" /></button>
          <button onClick={() => applyContrast(-10)} className="btn btn-secondary p-2" title="Decrease Contrast"><FaAdjust className="transform rotate-180" size="1.2em" /></button>
          <button onClick={() => applyContrast(10)} className="btn btn-secondary p-2" title="Increase Contrast"><FaAdjust size="1.2em" /></button>
          <button onClick={handleResetAll} className="btn btn-secondary p-2 flex items-center" title="Reset Filters, Rotation, Zoom & Pan">
            <FaHistory size="1.2em" className="mr-1" /> Reset All
          </button>
          <button onClick={toggleFullscreen} className="btn btn-secondary p-2" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <FaCompress size="1.2em" /> : <FaExpand size="1.2em" />}
          </button>
        </div>
      </div>
    </div>
  );
};


export default function Content() {
  const { cityId } = useParams();
  const navigate = useNavigate();

  const [cityData, setCityData] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [lastModified, setLastModified] = useState(null);
  const [thumbnailUrls, setThumbnailUrls] = useState({});
  const [randomCities, setRandomCities] = useState([]);

  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (cityId === undefined || (typeof cityId === 'string' && !cityId.trim())) {
      setIsLoadingPage(false);
      setCityData(null);
      setRotation(0);
      setBrightness(100);
      setContrast(100);
      return;
    }

    setIsLoadingPage(true);
    setCityData(null);
    setImageUrl("");
    setRotation(0);
    setBrightness(100);
    setContrast(100);

    const fetchCityData = async () => {
      try {
        const { data: city, error } = await Supabase.from("cities")
          .select("*")
          .eq("image-id", cityId)
          .single();

        if (error || !city) {
          console.error(`Error fetching city data for cityId '${cityId}':`, error);
          setCityData(null);
          setIsLoadingPage(false);
          return;
        }
        setCityData(city);
        const { data: imagePublicUrlData } = Supabase.storage
          .from("cities_maps")
          .getPublicUrl(`${city["image-id"]}.${city["img-ext"]}`);

        if (imagePublicUrlData) {
          const fullImageUrl = `${imagePublicUrlData.publicUrl}?t=${new Date().getTime()}`;
          setImageUrl(fullImageUrl);
          try {
            const response = await fetch(fullImageUrl, { method: 'HEAD' });
            const lastModifiedHeader = response.headers.get('last-modified');
            if (lastModifiedHeader) setLastModified(new Date(lastModifiedHeader));
          } catch (err) { /* Minor error, ignore */ }
        }

        const { data: allCities, error: allCitiesError } = await Supabase.from("cities")
          .select("image-id, city, country, img-alt")
          .neq("image-id", cityId)
          .limit(8);

        if (!allCitiesError && allCities) {
          const shuffledCities = allCities.sort(() => Math.random() - 0.5).slice(0, 4);
          setRandomCities(shuffledCities);
          const thumbnails = {};
          await Promise.all(
            shuffledCities.map(async (c) => {
              const { data: thumbUrlData } = Supabase.storage
                .from("cities_maps")
                .getPublicUrl(`${c["image-id"]}_thumb.webp`);
              if (thumbUrlData) thumbnails[c["image-id"]] = `${thumbUrlData.publicUrl}?t=${new Date().getTime()}`;
            })
          );
          setThumbnailUrls(thumbnails);
        }
      } catch (e) {
        console.error(`Failed to fetch content data for cityId '${cityId}':`, e);
        setCityData(null);
      } finally {
        setIsLoadingPage(false);
      }
    };

    fetchCityData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [cityId]);

  const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) imageContainerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const applyRotation = (degrees) => setRotation(prev => prev + degrees);
  const applyBrightness = (amount) => setBrightness(prev => Math.max(0, prev + amount));
  const applyContrast = (amount) => setContrast(prev => Math.max(0, prev + amount));

  // This function resets rotation, brightness, and contrast (managed by Content.jsx)
  const resetImageFiltersAndRotation = () => {
    setRotation(0);
    setBrightness(100);
    setContrast(100);
  };

  const imageStyle = {
    transform: `rotate(${rotation}deg)`,
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
    maxWidth: '100%',
    maxHeight: isFullscreen ? 'calc(100vh - 10px)' : '80vh',
    objectFit: isFullscreen ? 'contain' : 'cover',
    cursor: 'grab', margin: 'auto', display: 'block',
  };

  const formatLastModified = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true
    });
  };

  const handleGoBack = () => navigate("/");
  const handleThumbnailClick = (newCityId) => navigate(`/${newCityId}`);

  if (isLoadingPage) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header onclick={() => (window.location.href = "/")} />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cityData) return <NotFound404 />;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onclick={() => (window.location.href = "/")} />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto py-8 px-4 md:px-6 animate-fade-in">
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{cityData.city}</h1>
            <h2 className="text-lg text-text-secondary mt-1">
              {cityData.country} | {cityData.continent}
            </h2>
          </div>

          {imageUrl && (
            <div ref={imageContainerRef} className={`mb-4 ${isFullscreen ? 'fixed inset-0 flex items-center justify-center z-[1000]' : ' rounded-lg'}`}>
              <TransformWrapper
                initialScale={1} initialPositionX={0} initialPositionY={0}
                minScale={0.2} maxScale={15} limitToBounds={!isFullscreen}
                doubleClick={{ mode: 'reset' }} wheel={{ step: 0.2 }}
                panning={{ velocityDisabled: true }}
              >
                {() => ( // Removed 'utils' as ImageControls now uses its own useControls()
                  <div className="flex flex-col w-full">
                    <ImageControls
                      applyRotation={applyRotation}
                      applyBrightness={applyBrightness}
                      applyContrast={applyContrast}
                      resetAllImageEffects={resetImageFiltersAndRotation} // Pass the function to reset filters/rotation
                      toggleFullscreen={toggleFullscreen}
                      isFullscreen={isFullscreen}
                    />
                    <TransformComponent
                      wrapperStyle={{
                        width: '100%',
                        maxHeight: isFullscreen ? 'calc(100vh - 100px)' : 'calc(80vh - 60px)', // Adjusted for controls and some breathing room
                        border: isFullscreen ? 'none' : '1px solid var(--color-surface)',
                        overflow: 'hidden', borderRadius: isFullscreen ? '0' : '0.5rem'
                      }}
                      contentStyle={{ width: '100%', height: '100%' }}
                    >
                      <ImageWithLoader
                        imgRef={imageRef} src={imageUrl} alt={cityData["img-alt"]}
                        className="rounded-lg shadow-xl" style={imageStyle}
                      />
                    </TransformComponent>
                  </div>
                )}
              </TransformWrapper>
            </div>
          )}

          {/* ... rest of the Content component (notes, buttons, related maps, etc.) ... */}
          {cityData.note && (
            <p className="text-text-primary bg-surface p-4 rounded-lg mb-6 text-center italic">
              <strong>Note:</strong> {cityData.note}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => window.open(imageUrl, "_blank")}
              className="btn btn-primary w-full"
              disabled={!imageUrl}
            >
              View Full Image in New Tab
            </button>
            <button
              onClick={() => cityData["official-site"] && window.open(cityData["official-site"], "_blank")}
              className="btn btn-primary w-full"
              disabled={!cityData["official-site"]}
            >
              Official Site / Download
            </button>
            {cityData["note-link"] && (
              <button
                onClick={() => window.open(cityData["note-link"], "_blank")}
                className="btn btn-secondary w-full sm:col-span-2"
              >
                View Note Link
              </button>
            )}
          </div>

          <button onClick={handleGoBack} className="btn btn-danger w-full mb-8">
            Go Back to Homepage
          </button>

          <div className="bg-surface p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-white text-lg">Map Information</h3>
            <p className="text-text-secondary text-sm">Last Update: {formatLastModified(lastModified)}</p>
          </div>

          <hr className="border-secondary my-8" />

          <div className="my-6"><AdSenseAd /></div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center sm:text-left">Explore Other Maps</h3>
            {randomCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {randomCities.map((city) => (
                  <div key={city["image-id"]} className="group">
                    <button
                      onClick={() => handleThumbnailClick(city["image-id"])}
                      className="block w-full text-left bg-surface rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    >
                      {thumbnailUrls[city["image-id"]] ? (
                        <ImageWithLoader
                          src={thumbnailUrls[city["image-id"]]}
                          alt={`${city.city} thumbnail`}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-secondary rounded-t-lg animate-pulse flex items-center justify-center text-text-secondary">Loading...</div>
                      )}
                      <div className="p-3">
                        <p className="text-white font-semibold text-md group-hover:text-primary transition-colors">
                          {city.city}
                        </p>
                        <p className="text-text-secondary text-xs">{city.country}</p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center">No other maps to display at the moment.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}