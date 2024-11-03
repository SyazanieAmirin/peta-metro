import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function NotFound404() {
    {
        return (
            <>
                <Header onclick={() => (window.location.href = "/")} />
                <div className="max-w-[1200px] mx-auto mt-10 px-5 mb-10 flex flex-col animate-fade-in">
                    <h1 className="text-white text-center text-3xl font-bold mb-5">Sorry but the city does not exist!</h1>
                    <button onClick={() => (window.location.href = "/")} className="bg-primary py-2 px-5 rounded-full text-white font-bold transition-all hover:opacity-90">
                        Go Back Home
                    </button>
                </div>
                <Footer />
            </>
        )
    }
}