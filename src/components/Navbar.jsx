import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <header>
            <nav className="flex justify-between p-6 text-3xl bg-gray-200">
                <div>
                    <Link className="font-bold text-black" to="/">Rex</Link>
                </div>
                <div className="flex justify-between gap-6">
                    <Link className="btn bg-[#ff9a8c] shadow-[6px_6px_0_0_#000] border-black border w-36 px-5 pt-0.5 rounded-md text-lg transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000] hover:bg-[#ff7f66]" to="/architecture">Architecture</Link>
                    <Link className="btn bg-[#ff9a8c] shadow-[6px_6px_0_0_#000] border-black border w-28 px-6 pt-0.5 rounded-md text-lg transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000] hover:bg-[#ff7f66]" to="/indexer">Indexer</Link>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;