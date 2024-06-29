import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Check, Copy } from 'lucide-react';

const ResultCard = ({ data }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
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
    );
};

export default ResultCard;