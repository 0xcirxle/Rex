import {React,useState} from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Check, Copy } from 'lucide-react';

const ResultPage = () => {
    const { state } = useLocation();
    const data = state?.data || [];

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-center items-center mt-48 mb-[13.4rem]">
            <Card className="w-full max-w-md">
                <CardContent className="p-4">
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                  <code className="text-sm">{JSON.stringify(data, null, 2)}</code>
                </pre>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                    <Button
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center"
                        variant="outline"
                    >
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy JSON
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ResultPage;