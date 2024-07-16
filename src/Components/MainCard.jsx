export default function MainCard({ cityName, countryName, image, imageAlt, onClick, continent }) {
    return (
        <div className="bg-secondary rounded-lg transition-all lg:hover:opacity-50 hover:cursor-pointer mt-5" onClick={onClick}>
            <div className="flex flex-row gap-5">
                <div className="rounded-lg">
                    <img src={image} alt={imageAlt} className="h-max-[220px] w-max-[220px] h-[120px] w-[120px] rounded-lg opacity-70" loading="lazy" />
                </div>
                <div className="flex flex-col gap-1 py-5">
                    <h1 className="text-xl lg:text-2xl font-bold text-white">{cityName}</h1>
                    <h1 className="lg:text-lg text-white/70">{countryName} | {continent}</h1>
                </div>
            </div>
        </div >
    )
}