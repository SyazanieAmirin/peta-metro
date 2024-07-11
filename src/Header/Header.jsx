import { useState } from "react";
import MobileNavbarOpened from "./MobileNavbarOpened";
import { Link } from 'react-router-dom';


export default function Header({ onclick, onClickItems }) {

    const navbarItems = [
        { title: <Link to="/">Home</Link> },
        { title: <Link to="/contact">Contact</Link> },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div className="flex flex-row w-full align-middle items-center justify-between bg-secondary lg:py-3">
                <h1 className="pl-5 lg:pl-16 font-bold tracking-[0.55em] text-white hover:cursor-pointer" onClick={onclick}>PETA METRO</h1>
                <header className="lg:hidden flex flex-col gap-1 mr-5 my-3" onClick={() => setIsMenuOpen(true)}>
                    <h1 className="w-full h-full py-[0.10em] px-3 rounded-full bg-white"></h1>
                    <h1 className="w-full h-full py-[0.10em] px-3 rounded-full bg-white"></h1>
                    <h1 className="w-full h-full py-[0.10em] px-3 rounded-full bg-white"></h1>
                </header>
                <div className="lg:flex lg:flex-row lg:gap-5 hidden pr-16">
                    {navbarItems.map((item, index) => (
                        <h1 key={index} onClick={onClickItems} className="text-white font-bold transition-all py-1 px-3 hover:scale-90 hover:rounded-full">{item.title}</h1>
                    ))}
                </div>
            </div>

            <MobileNavbarOpened isOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} navbarItems={navbarItems} />
        </>
    );
}
