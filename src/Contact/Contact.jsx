import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Contact() {

    const [isDonateInternational, setIsDonateInternational] = useState(false);
    const [isDonateMalaysia, setIsDonateMalaysia] = useState(false);

    const navigate = useNavigate();


    return (
        <>
            <div className="flex flex-col gap-5 bg-primary-accent items-end lg:items-start">
                <Header onclick={() => navigate("/")} />
            </div>
            <div className="max-w-[1200px] mx-auto mt-10 px-5 flex flex-col gap-5">
                <h1 className="text-white text-3xl font-bold text-center">Contact Me</h1>
                <hr></hr>
                <div className="flex flex-col lg:flex-row justify-between gap-5">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-center text-white font-bold text-xl">My Email</h1>
                        <a className="text-center text-blue-200 underline" href="mailto:muhdsyazanieamirin@gmail.com">muhdsyazanieamirin@gmail.com</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-center text-white font-bold text-xl">My Website</h1>
                        <a className="text-center text-blue-200 underline" href="https://syazanieamirin.github.io/portfolio.github.io/" target="_blank">https://syazanieamirin.github.io/portfolio.<br></br>github.io/</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-center text-white font-bold text-xl">This Website's Repository</h1>
                        <a className="text-center text-blue-200 underline" href="https://github.com/SyazanieAmirin/peta-metro" target="_blank">https://github.com/SyazanieAmirin/<br></br>peta-metro</a>
                    </div>
                </div>
                <hr></hr>
            </div>
            <div className="max-w-[1200px] mx-auto mt-10 px-5 mb-10 flex flex-col gap-5">
                <h1 className="text-white font-bold text-center text-xl">Donation</h1>
                <p className="text-white text-center"><span className="font-bold">Note:</span> I don't store any of the credit/debit card information as all transactions are processed using Buy Me A Coffee or the Maybank payment processor.</p>
                <h1 className="text-white font-bold text-center text-l">Choose Type of Donation</h1>
                <div className="flex flex-row gap-5 items-center justify-center">
                    <button className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:scale-90" onClick={() => { setIsDonateInternational(true); setIsDonateMalaysia(false) }}>International</button>
                    <button className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:scale-90" onClick={() => { setIsDonateInternational(false); setIsDonateMalaysia(true) }}>Malaysia</button>
                </div>
                {isDonateInternational && (
                    <div className="flex flex-col gap-5 items-center">
                        <p className="text-white text-center">You can donate to me using Buy Me A Coffee. Click the button below to donate to me!</p>
                        <a href="https://www.buymeacoffee.com/syazanieamirin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" className="!h-[60px] !w-[217px] transition-all hover:scale-90" /></a>
                    </div>
                )}
                {isDonateMalaysia && (
                    <div className="flex flex-col gap-5 items-center">
                        <img src="../QR_Duit_Now.jpeg" alt="Buy Me A Coffee" className="rounded-lg" />
                        <h1 className="text-white text-center mt-5 text-xl font-bold">Account Number (Maybank): 157157948111</h1>
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}