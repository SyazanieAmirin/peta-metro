import Header from "../Header/Header";
import InputBar from "../Components/Searchbar";

export default function Admin() {
    return (
        <>
            <div className="flex flex-col gap-5 bg-primary-accent items-end lg:items-start animate-fade-in">
                <Header onclick={() => { setSelectedCity(null); setSearchInput(""); }} />
            </div>
            <div className="max-w-[1200px] mx-auto mt-10 px-5 mb-10 flex flex-col animate-fade-in">
                <form>
                    <h1 className='font-bold text-white text-xl mb-2 animate-fade-in'>City Name</h1>
                    <InputBar
                        placeholder="Example: Bangkok | Thailand | Asia | BKK"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                    <h1 className='font-bold text-white text-xl mb-2 animate-fade-in'>City Country</h1>
                    <InputBar
                        placeholder="Example: Bangkok | Thailand | Asia | BKK"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                    <h1 className='font-bold text-white text-xl mb-2 animate-fade-in'>City Continent</h1>
                    <InputBar
                        placeholder="Example: Bangkok | Thailand | Asia | BKK"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                    <h1 className='font-bold text-white text-xl mb-2 animate-fade-in'>City Local Name</h1>
                    <InputBar
                        placeholder="Example: Bangkok | Thailand | Asia | BKK"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                    <h1 className='font-bold text-white text-xl mb-2 animate-fade-in'>Image</h1>
                    <InputBar
                        placeholder="Example: Bangkok | Thailand | Asia | BKK"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                    {/*Ni buat kalau type kat name, dia auto buh kat ID tapi kecik and if space, dia buh _*/}
                    <h1 className='font-bold text-white text-xl mb-2 animate-fade-in'>ID</h1>
                    <InputBar
                        placeholder="Example: Bangkok | Thailand | Asia | BKK"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />

                    {/*Make it auto*/}
                    <h1 className='font-bold text-white text-xl mb-2 animate-fade-in'>Image Extension</h1>
                    <InputBar
                        placeholder="Example: Bangkok | Thailand | Asia | BKK"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                    {/*Make it auto*/}
                    <h1 className='font-bold text-white text-xl mb-2 animate-fade-in'>Website</h1>
                    <InputBar
                        placeholder="Example: Bangkok | Thailand | Asia | BKK"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                </form>
            </div>
        </>
    )
}