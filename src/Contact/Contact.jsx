import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Contact() {
    const navigate = useNavigate();
    const [isDonateInternational, setIsDonateInternational] = useState(false);
    const [isDonateMalaysia, setIsDonateMalaysia] = useState(false);

    const handleDonateChoice = (type) => {
        if (type === 'international') {
            setIsDonateInternational(true);
            setIsDonateMalaysia(false);
        } else if (type === 'malaysia') {
            setIsDonateInternational(false);
            setIsDonateMalaysia(true);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header onclick={() => navigate("/")} />
            <main className="flex-grow animate-fade-in">
                <div className="max-w-3xl mx-auto py-10 px-5">
                    <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-8">Contact Me</h1>
                    <hr className="border-secondary mb-8" />

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center">
                        <div className="bg-surface p-6 rounded-lg shadow-lg">
                            <h2 className="text-white font-bold text-xl mb-2">My Email</h2>
                            <a className="text-primary hover:underline break-all" href="mailto:muhdsyazanieamirin@gmail.com">muhdsyazanieamirin@gmail.com</a>
                        </div>
                        <div className="bg-surface p-6 rounded-lg shadow-lg">
                            <h2 className="text-white font-bold text-xl mb-2">My Website</h2>
                            <a className="text-primary hover:underline" href="https://syazanie.com/" target="_blank" rel="noopener noreferrer">syazanie.com</a>
                        </div>
                        <div className="bg-surface p-6 rounded-lg shadow-lg">
                            <h2 className="text-white font-bold text-xl mb-2">Project Repository</h2>
                            <a className="text-primary hover:underline" href="https://github.com/SyazanieAmirin/peta-metro" target="_blank" rel="noopener noreferrer">GitHub - Peta Metro</a>
                        </div>
                    </section>

                    <hr className="border-secondary mb-10" />

                    <section className="text-center">
                        <h2 className="text-white font-bold text-2xl md:text-3xl mb-6">Support The Project</h2>
                        <p className="text-text-secondary mb-6">If you find this project useful, please consider a small donation. It helps keep the project alive and running!</p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
                            <button
                                className={`btn ${isDonateInternational ? 'btn-primary' : 'btn-secondary'} w-full sm:w-auto`}
                                onClick={() => handleDonateChoice('international')}
                            >
                                Donate via Buy Me A Coffee
                            </button>
                            <button
                                className={`btn ${isDonateMalaysia ? 'btn-primary' : 'btn-secondary'} w-full sm:w-auto`}
                                onClick={() => handleDonateChoice('malaysia')}
                            >
                                Donate via QR (MY)
                            </button>
                        </div>

                        {isDonateInternational && (
                            <div className="bg-surface p-6 rounded-lg shadow-lg flex flex-col items-center gap-5 animate-fade-in">
                                <p className="text-text-primary">Click the button below to go to my Buy Me A Coffee page. Thank you for your support!</p>
                                <a href="https://www.buymeacoffee.com/syazanieamirin" target="_blank" rel="noopener noreferrer">
                                    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" className="h-[60px] w-[217px] transition-transform hover:scale-105" />
                                </a>
                                <p className="text-text-secondary text-sm"><span className="font-semibold">Note:</span> Transactions are securely processed by Buy Me A Coffee. I do not store any payment information.</p>
                            </div>
                        )}

                        {isDonateMalaysia && (
                            <div className="bg-surface p-6 rounded-lg shadow-lg flex flex-col items-center gap-5 animate-fade-in">
                                {/* Ensure QR_Duit_Now.jpeg is in your public folder */}
                                <img src="/QR_Duit_Now.jpeg" alt="DuitNow QR Code" className="rounded-lg max-w-xs w-full shadow-md" />
                                <h3 className="text-white text-lg font-semibold mt-3">Account Number (Maybank): <span className="text-primary">157157948111</span></h3>
                                <p className="text-text-secondary text-sm"><span className="font-semibold">Note:</span> Transactions are processed by Maybank. I do not store any payment information.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}