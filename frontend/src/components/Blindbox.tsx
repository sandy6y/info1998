// ====== Blind Box Page =====

import "./styles.css"
import { useEffect, useState } from "react";
import BlindboxCard from "./BlindboxCard";
import { getFiguresBySeries, Figure } from "../services/figures";

type BlindboxProps = {
    series: string;     //character name
    subSeries: string;  // e.g. "Warmth", "The Paradox"
}

const Blindbox = ({ series, subSeries }: BlindboxProps) => {
    const [figures, setFigures ] = useState<Figure[]>([]);
    
    useEffect(() => {
        getFiguresBySeries(series)
            .then(allFigures => {
                // filter client-side by subSeries
                const filtered = allFigures.filter(f =>
                    f.name.includes(subSeries) || f.imageUrl.includes(`/${subSeries}/`)
            );
            setFigures(filtered);
        })
        .catch(console.error);
    }, [series, subSeries]);

    return (
        <div className="card-container">
            {figures.map((figure)=> (
                <BlindboxCard 
                key={figure.id} 
                figure={figure}
                />
            ))}
        </div>
    );
};

export default Blindbox; 