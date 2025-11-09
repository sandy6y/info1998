import "./styles.css"
import {useState} from "react";
import BlindboxCard from "./BlindboxCard";
import { BLINDBOX } from "../constants/conts";


type BlindboxProps = {
    characterName: string;
    serieName: string; 
}

const Blindbox = ({ characterName, serieName }: BlindboxProps) => {
    const filteredBoxes = BLINDBOX.filter(
        (b) => b.characterName === characterName && b.serieName === serieName
    );
    
    return (
        <div className="blindbox-list">
            {filteredBoxes.map((blindbox) => (
                <BlindboxCard 
                key={`${blindbox.characterName}-${blindbox.serieName}-${blindbox.serieNbr}`} 
                blindbox={blindbox} />
            ))}
        </div>
    );
};

export default Blindbox; 