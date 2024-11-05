import { Link, Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <>
            <nav className="py-2 w-full bg-gradient-to-r from-zinc-950 via-black to-zinc-950">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-col lg:flex-row items-center justify-end gap-1 text-center font-semibold text-white text-sm py-4">
                        <div className='flex flex-col md:flex-col lg:flex-row items-center justify-end gap-3 text-center'>
                            <Link to="/" className='cursor-pointer rounded-lg py-3 px-4 hover:bg-zinc-900 transition-all duration-200'>Ruleta</Link>
                        </div>
                        <div className='flex flex-col md:flex-col lg:flex-row items-center justify-end gap-3 text-center'>
                            <Link to="/inventario" className='cursor-pointer rounded-lg py-3 px-4 hover:bg-zinc-900 transition-all duration-200'>Inventario</Link>
                        </div>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    )
}

export default Layout