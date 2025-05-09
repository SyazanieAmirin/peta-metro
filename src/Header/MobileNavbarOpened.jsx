import { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming navbarItems might contain Links
import { FaTimes, FaHome, FaEnvelope, FaGithub } from 'react-icons/fa'; // Example icons

const defaultNavbarItems = [
    { title: "Home", path: "/", icon: <FaHome /> },
    { title: "Contact", path: "/contact", icon: <FaEnvelope /> },
];

export default function MobileNavbarOpened({ isOpen, setIsMenuOpen, navbarItems = defaultNavbarItems }) {

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        // Cleanup function to remove the class if the component unmounts while open
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpen]);

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
    };

    // Navigate and close menu
    const handleNavigation = (path) => {
        handleCloseMenu();
    };

    return (
        <div
            className={`
                fixed inset-0 z-40
                transition-opacity duration-300 ease-in-out
                ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
            onClick={handleCloseMenu} // Close menu if backdrop is clicked
        >
            {/* Semi-transparent backdrop */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Menu Panel */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-4/5 max-w-sm
                    bg-surface shadow-xl z-50
                    flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header for the menu */}
                <div className="flex justify-between items-center p-5 border-b border-secondary">
                    <h2 className="text-xl font-semibold text-text-primary">Menu</h2>
                    <button
                        onClick={handleCloseMenu}
                        className="text-text-secondary hover:text-primary p-2 rounded-full transition-colors"
                        aria-label="Close menu"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow p-5 space-y-3">
                    {navbarItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => item.path ? handleNavigation(item.path) : handleCloseMenu()}
                            className="flex items-center space-x-3 p-3 rounded-lg text-text-primary hover:bg-secondary hover:text-white transition-all duration-200 ease-in-out cursor-pointer text-lg group"
                        >
                            {item.icon && <span className="text-primary group-hover:text-white transition-colors">{item.icon}</span>}
                            <span>{item.title}</span>
                        </div>
                    ))}
                </nav>

                {/* Footer within the menu */}
                <div className="p-5 border-t border-secondary mt-auto">
                    <div className='flex flex-col items-center gap-2 text-center'>
                        <a
                            className="text-sm text-text-secondary hover:text-primary transition-colors"
                            href='https://syazanie.com'
                            target='_blank'
                            rel="noopener noreferrer"
                        >
                            Created by <span className='font-semibold text-primary hover:underline'>Syazanie Amirin</span>
                        </a>
                        <a
                            href="https://github.com/SyazanieAmirin/peta-metro"
                            target='_blank'
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
                            aria-label="GitHub Repository"
                        >
                            <FaGithub />
                            <span className="text-sm">View Source</span>
                        </a>
                        <p className="text-xs text-text-secondary/70">V1.7.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}