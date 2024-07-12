export default function Footer() {
    return (
        <footer className="bg-secondary flex flex-row items-center justify-center py-2 w-full mt-10 align-middle gap-2 flex-wrap">
            <a className="text-white font-bold text-md" href='https://syazanieamirin.github.io/portfolio.github.io/' target='_blank'>Created by <span className='text-blue-200'>Syazanie Amirin | V1.1.2</span></a>
            <a href="https://github.com/SyazanieAmirin/peta-metro" target='_blank'>
                <img src="../GithubIcon.svg" alt="Github Logo" className="h-5 w-5 hover:scale-90 hover:cursor-pointer" />
            </a>
        </footer>
    )
}