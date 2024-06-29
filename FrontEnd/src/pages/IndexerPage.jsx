import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const IndexerPage = () => {
    const [selectedChain, setSelectedChain] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [abi, setAbi] = useState('');
    const [event, setEvent] = useState('');
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const handleGenerateDB = async (e) => {
        e.preventDefault();

        const requestData = {
            contract_address: contractAddress,
            abi: abi,
            event_name: event // Include event_name in the data sent to backend
        };

        try {
            await axios.post('http://localhost:3030/update_contract', requestData);
            alert('Contract updated successfully!');

            // Fetch the data after updating the contract
            fetchData();
        } catch (error) {
            alert('Error updating contract');
            console.error(error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3030/get_data');
            setData(response.data);
            navigate('/result', { state: { data: response.data } });
        } catch (error) {
            alert('Error fetching data');
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center mt-20 mb-[7.4rem]">
            <div className="flex-grow">
            <div className="w-[35rem] bg-gray-100 shadow-[6px_6px_0_0_#000] rounded-sm transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000]">
                <CardContent className="space-y-6 p-6">
                    <Select onValueChange={setSelectedChain}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select chain" />
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
                        <Button
                            className="text-black bg-[#ffd88c] mt-5 shadow-[6px_6px_0_0_#000] font-semibold border-black border w-64 h-10 px-10 pt-1 rounded-md text-lg transition duration-300 ease-in-out hover:shadow-[8px_8px_0_0_#000] hover:bg-[#fc6]"
                            onClick={handleGenerateDB}
                        >
                            Generate Database
                        </Button>
                    </div>
                </CardContent>
            </div>
            </div>
        </div>
    );
};

export default IndexerPage;