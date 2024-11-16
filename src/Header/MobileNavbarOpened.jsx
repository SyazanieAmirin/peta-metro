import { useState, useEffect } from 'react';

import GithubIcon from '../assets/GithubIconWhite.svg';

export default function MobileNavbarOpened({ isOpen, setIsMenuOpen, navbarItems }) {
    const [isMenuOpen, setIsMenuOpenLocal] = useState(isOpen);

    useEffect(() => {
        setIsMenuOpenLocal(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isMenuOpen]);

    let openMenu = "absolute h-screen bg-secondary w-screen flex flex-col z-50";
    let closeMenu = "hidden";

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className={isMenuOpen ? openMenu : closeMenu}>
            <div className='flex flex-row justify-end p-6'>
                <h1 className="text-white text-2xl font-bold text-right" onClick={handleCloseMenu}>X</h1>
            </div>
            <div className='flex flex-col gap-10 text-2xl p-2 pl-5'>
                {navbarItems.map((item, index) => (
                    <div
                        key={index}
                        className="text-white font-bold transition-all py-1 px-3 hover:scale-90 hover:rounded-full"
                        onClick={() => {
                            handleCloseMenu();
                        }}
                    >
                        {item.title}
                    </div>
                ))}
            </div>
            <div className='flex flex-row justify-center mt-auto mb-28 gap-2'>
                <a className="text-white font-bold text-md" href='https://syazanie.com' target='_blank'>Created by <span className='text-blue-200'>Syazanie Amirin | V1.4.1</span></a>
                <a href="https://github.com/SyazanieAmirin/peta-metro" target='_blank'>
                    <img src={GithubIcon} alt="Github Logo" className="h-5 w-5 hover:scale-90 hover:cursor-pointer" />
                </a>
            </div>
        </div>
    );
}
