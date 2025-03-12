import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import './CardRow.css';

interface CardRowProps {
    children: React.ReactNode;
}

const CardRow: React.FC<CardRowProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="card-row-wrapper">
            <Button variant="light" className="scroll-button left" onClick={scrollLeft}>
                &#9664;
            </Button>
            <div className="card-row" ref={containerRef}>
                {children}
            </div>
            <Button variant="light" className="scroll-button right" onClick={scrollRight}>
                &#9654;
            </Button>
        </div>
    );
};

export default CardRow;
