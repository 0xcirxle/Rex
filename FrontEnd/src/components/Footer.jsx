import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-200 py-4 mt-auto">
            <div className="container mx-auto flex items-center justify-between px-4">
                <p className="text-gray-700">Made with ❤️ by team Rex</p>
                <a
                    href="https://github.com/0xcirxle/Rex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                    <Github className="mr-2" size={20} />
                    GitHub
                </a>
            </div>
        </footer>
    );
};

export default Footer;