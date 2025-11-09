import { useEffect, useState } from "react";
import "./styles.css";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";

type BlindboxCardProps = {
    blindbox: Blindbox;
};

const BlindboxCard = ({blindbox}: BlindboxCardProps) => {
    
    const imagePath = `/images/${blindbox.characterName}/${blindbox.serieName}/${blindbox.serieNbr}.jpg`;
    
    return (
    <div className="boxCard">
      <img 
        src={imagePath}
        className="figure"
        alt={blindbox.name}
      />

      <p className="figureName">
        {blindbox.name}
      </p>
    
      <Minus size={15} />  <Plus size={15} /> 

    </div>
    );
};

export default BlindboxCard;