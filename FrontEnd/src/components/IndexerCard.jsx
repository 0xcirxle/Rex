import React, { useState } from 'react';
import {CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {Link} from "react-router-dom";

const IndexerCard = () => {
    const [selectedChain, setSelectedChain] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [abi, setAbi] = useState('');
    const [event, setEvent] = useState('');

    const handleGenerateDB = () => {
        // database generation
        console.log('Generating DB with:', { selectedChain, contractAddress, abi, event });
    };

    return (
        <div className="card w-[35rem] bg-gray-100 shadow-[6px_6px_0_0_#000] min-h-[20rem] h-fit rounded-sm transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000]">
            <CardContent className="space-y-6 p-6">
                <Select onValueChange={setSelectedChain}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select chain"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sepoliaethereum">Ethereum Sepolia</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    placeholder="Contract Address"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                />

                <Input
                    placeholder="ABI"
                    value={abi}
                    onChange={(e) => setAbi(e.target.value)}
                />

                <Input
                    placeholder="Event"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                />

                <div className="flex flex-col items-center w-full justify-center mt-16">
                    <Link className="btn bg-[#ffd88c] mt-5 shadow-[6px_6px_0_0_#000] font-semibold border-black border w-64 h-10 px-10 pt-1 rounded-md text-lg transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000] hover:bg-[#fc6]"
                        to="/result">Generate Database</Link>
                </div>
            </CardContent>
        </div>
    );
};

export default IndexerCard;