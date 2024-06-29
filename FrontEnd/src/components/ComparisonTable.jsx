import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from 'recharts';

const data = [
    { name: 'Reth', value: 6, color: '#FFA500' },
    { name: 'Infura', value: 19, color: '#8C8C8C' },
    { name: 'Graph', value: 67, color: '#8C8C8C' },
];

const ComparisonTable = () => {
    const [isVisible, setIsVisible] = useState(false);
    const chartRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );

        if (chartRef.current) {
            observer.observe(chartRef.current);
        }

        return () => {
            if (chartRef.current) {
                observer.unobserve(chartRef.current);
            }
        };
    }, []);

    return (
        <div ref={chartRef} className="w-full h-64 bg-grid border border-black">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{top: 20, right: 30, left: -35, bottom: 10}}
                    barSize={20}
                    barGap={2}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" domain={[0, 80]}/>
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false}/>
                    <Bar
                        dataKey="value"
                        isAnimationActive={isVisible}
                        animationBegin={0}
                        animationDuration={1000}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                        <LabelList dataKey="value" position="right"/>
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <style jsx>{`
                .bg-grid {
                    background-size: 16px 16px;
                    background-image: linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                    linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
                }
            `}</style>
        </div>
    );
};

export default ComparisonTable;