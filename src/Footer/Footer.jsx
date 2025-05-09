export default function Footer() {
    return (
        <footer className="bg-secondary flex flex-row items-center justify-center py-4 w-full mt-auto shadow-inner animate-fade-in">
            <div className="flex items-center gap-3">
                <a className="text-text-secondary hover:text-primary font-medium text-sm transition-colors" href='https://syazanie.com' target='_blank' rel="noopener noreferrer">
                    Created by <span className='text-primary hover:underline'>Syazanie Amirin</span> | V1.7.0
                </a>
                <a href="https://github.com/SyazanieAmirin/peta-metro" target='_blank' rel="noopener noreferrer" aria-label="GitHub Repository">
                    {/* Assuming GithubIcon.svg is in public folder or correctly pathed from src/assets */}
                    <img src="/GithubIcon.svg" alt="GitHub Logo" className="h-6 w-6 text-text-secondary hover:text-primary transition-all transform hover:scale-110" />
                </a>
            </div>
        </footer>
    )
}