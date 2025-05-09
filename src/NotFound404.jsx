import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { useNavigate } from "react-router-dom";

export default function NotFound404() {
    const navigate = useNavigate();
    const goHome = () => navigate("/");

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header onclick={goHome} />
            <main className="flex-grow flex flex-col items-center justify-center text-center px-5 animate-fade-in">
                <h1 className="text-white text-4xl md:text-5xl font-bold mb-6">Oops! Page Not Found</h1>
                <p className="text-text-secondary text-lg mb-8">Sorry, the page or city you are looking for does not exist.</p>
                <button
                    onClick={goHome}
                    className="btn btn-primary text-lg px-8 py-3"
                >
                    Go Back Home
                </button>
            </main>
            <Footer />
        </div>
    );
}