// src/Header/Header.jsx
import { useState } from "react";
import MobileNavbarOpened from "./MobileNavbarOpened";
import { Link } from 'react-router-dom';
import { FaHome, FaEnvelope } from 'react-icons/fa'; // Import icons here

export default function Header({ onclick, onClickItems }) { // onClickItems seems for desktop only

    // Define navbar items with icons for mobile menu
    const navbarItemsForMobile = [
        { title: <Link to="/" className="hover:text-primary transition-colors">Home</Link>, path: "/", icon: <FaHome size={20} /> },
        { title: <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>, path: "/contact", icon: <FaEnvelope size={20} /> },
    ];

    // Navbar items for desktop (if they need to be different, otherwise use the same)
    const navbarItemsForDesktop = [
        { title: <Link to="/" className="hover:text-primary transition-colors">Home</Link> },
        { title: <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link> },
    ];


    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div className="flex flex-row w-full items-center justify-between bg-secondary shadow-md py-3 md:py-4 animate-fade-in">
                <h1 className="pl-4 md:pl-8 font-bold tracking-wider text-xl text-white hover:cursor-pointer" onClick={onclick}>Peta Metro</h1>

                {/* Mobile Menu Icon / Hamburger */}
                <button
                    aria-label="Open menu"
                    className="lg:hidden flex flex-col gap-1.5 mr-4 my-2 p-2 rounded hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                    <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                    <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                </button>

                {/* Desktop Navigation */}
                <nav className="lg:flex lg:flex-row lg:gap-6 hidden pr-8 items-center">
                    {navbarItemsForDesktop.map((item, index) => (
                        <div
                            key={index}
                            // onClick={onClickItems} // This prop seems intended for specific actions on desktop items
                            className="text-white font-semibold text-lg py-1 px-3" // Removed hover:scale-90, Link handles its own hover
                        >
                            {item.title}
                        </div>
                    ))}
                </nav>
            </div>

            <MobileNavbarOpened
                isOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                navbarItems={navbarItemsForMobile}
            />
        </>
    );
}