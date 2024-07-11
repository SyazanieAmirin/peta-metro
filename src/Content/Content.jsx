export default function Content({ cityName, countryName, imageSrc, imageAlt, onClickDownload, onClickView, continent }) {
    return (
        <div className="flex flex-col gap-1 mb-5">
            <h1 className="text-white text-3xl font-bold">{cityName}</h1>
            <h1 className="text-white/60 mb-5">{countryName} | {continent}</h1>
            <div className="items-center flex flex-col gap-5">
                <img src={imageSrc} alt={imageAlt} className="rounded-lg" loading="lazy" />
                <button className="mt-5 bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:scale-90" onClick={onClickDownload}>Download (From External Site)</button>
                <button className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:scale-90" onClick={onClickView}>View in new Tab</button>
            </div>
        </div>
    )
}