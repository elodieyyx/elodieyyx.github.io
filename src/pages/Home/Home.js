import React, { useEffect } from 'react';
import Projects from '../../components/Projects/Projects';
import { useLocation } from 'react-router-dom'
import "./Home.css";
import BrunchTableLanding from './BrunchTableLanding';

export default function Home() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                const element = document.querySelector(location.hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    useEffect(() => {
        document.body.classList.add('home-brunch');
        return () => document.body.classList.remove('home-brunch');
    }, []);

    return (
        <>
            <BrunchTableLanding />
            <Projects />
        </>
    );
}