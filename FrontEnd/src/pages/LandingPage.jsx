import React from 'react';
import {Link} from "react-router-dom";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { LuClock2 } from "react-icons/lu";
import ComparisonTable from "../components/ComparisonTable";

function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center text-center leading-relaxed">
            <h1 className="text-6xl font-bold mt-12 px-7">Welcome to Rex</h1>
            <p className="mt-8 text-2xl font-medium px-7">
                Effortlessly index Blockchain data with <span className="font-semibold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-transparent bg-clip-text">
                    Blazing Fast
                </span> speeds using Rex
            </p>
            <div className="flex flex-col items-center justify-center mt-8">
                <Link className="btn bg-[#beff6b] shadow-[6px_6px_0_0_#000] font-semibold border-black border w-44 h-10 px-7 pt-1 rounded-md text-lg transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000] hover:bg-[#a6ff4d]" to="/indexer">Go to Indexer</Link>
            </div>
            <section className="flex flex-col items-center justify-center p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div
                        className="card w-fit lg:w-80 bg-gray-100 shadow-[6px_6px_0_0_#000] min-h-80 h-fit rounded-sm transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000]">
                        <figure className="p-10">
                            <BsLightningChargeFill  className="w-12 h-12 m-auto" />
                        </figure>
                        <div className="card-body items-center text-center px-8">
                            <h3 className="font-semibold text-2xl pb-6">Wicked Fast</h3>
                            <p className="text-md font-medium">
                                Our indexer is based on Reth, which currently has industry leading speeds which is 1 to 2 order of magnitudes faster.
                            </p>
                        </div>
                    </div>
                    <div
                        className="card w-fit lg:w-80 bg-gray-100 shadow-[6px_6px_0_0_#000] min-h-80 h-fit rounded-sm transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000]">
                        <figure className="p-10">
                            <FaUserCheck className="w-12 h-12 m-auto" />
                        </figure>
                        <div className="card-body items-center text-center px-8">
                            <h3 className="font-semibold text-2xl pb-6">User Friendly</h3>
                            <p className="text-md font-medium">
                                Rex is easy to use and offers its Intuitive interface designed for effortless navigation.
                            </p>
                        </div>
                    </div>
                    <div
                        className="card w-fit lg:w-80 bg-gray-100 shadow-[6px_6px_0_0_#000] min-h-80 h-fit rounded-sm transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000]">
                        <figure className="p-10">
                            <LuClock2 className="w-12 h-12 m-auto" />
                        </figure>
                        <div className="card-body items-center text-center px-8">
                            <h3 className="font-semibold text-2xl pb-6">Saves Time</h3>
                            <p className="text-md font-medium">
                                Our indexer automates complex data gathering, allowing you to focus on interpretation and decision-making.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex justify-between my-5 mx-auto px-32">
                <div className="w-1/2">
                    <h1 className="ml-[-6.75rem] mb-6 text-3xl font-semibold ">
                        Engineered for <span className="font-semibold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-transparent bg-clip-text">
                        Performance
                        </span>
                    </h1>
                    <p className="ml-0 w-[100] mr-[44] text-start">
                        Introducing Rex, engineered with reth along with execution extensions at its core. Experience rapid synchronization, near-instant querying, and swift analysis, enabling unparalleled efficiency in navigating and understanding blockchain data.
                    </p>
                    <p className="ml-0 w-[100] mt-5 mr-[44] text-start">
                        Here's a comparison between indexers based on different nodes.(time in minutes)
                    </p>
                </div>
                <div className="w-96 ml-16">
                    <ComparisonTable />
                </div>
            </section>
            <div className="flex flex-col items-center justify-center my-8">
                <Link
                    className="btn bg-[#beff6b] shadow-[6px_6px_0_0_#000] font-semibold border-black border w-44 h-10 px-7 pt-1 rounded-md text-lg transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000] hover:bg-[#a6ff4d]"
                    to="/indexer">Try Rex!</Link>
            </div>
        </div>
    );
}

export default LandingPage;
