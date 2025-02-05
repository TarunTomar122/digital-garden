'use client';

import { useState, useEffect } from 'react';

interface ListPageProps {
    list: string[];
}

export default function List(props: ListPageProps) {
    const [randomItems, setRandomItems] = useState<string[]>([]);

    const getRandomItems = () => {
        const shuffled = props.list.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    };

    useEffect(() => {
        setRandomItems(getRandomItems());
    }, [props.list]);

    const refreshItems = () => {
        setRandomItems(getRandomItems());
    };

    return (
        <div className='py-4'>
            <div className="flex items-center">
                <p className="text-xl md:text-2xl font-extralight py-4">100 things I wanna do before 100</p>
                <button onClick={refreshItems} className="ml-4 text-slate-400 hover:text-slate-600">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                            <path d="M2 10C2 10 2.12132 9.15076 5.63604 5.63604C9.15076 2.12132 14.8492 2.12132 18.364 5.63604C19.6092 6.88131 20.4133 8.40072 20.7762 10M2 10V4M2 10H8M22 14C22 14 21.8787 14.8492 18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364C4.39076 17.1187 3.58669 15.5993 3.22383 14M22 14V20M22 14H16" stroke="#c8d2df" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </button>
            </div>

            <div className="text-slate-400 leading-8 text-lg md:leading-10 mt-4 xl:pr-24 font-light">
                {
                    randomItems.map((item, index) => {
                        return (
                            <div key={index} className='flex flex-row items-center gap-4'>
                                <div className='w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center'>
                                    <p className='text-white'>{index + 1}</p>
                                </div>
                                <p className='text-slate-200'>{item}</p>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}