import { useEffect, useState } from "react";
import "./styles.css";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";

type BlindboxCardProps = {
    blindbox: Blindbox;
};


const BlindboxCard = ({blindbox}: BlindboxCardProps) => {
    
    const [count, setCount] = useState(0);
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
    
        <div className="counter">
            <button onClick={() => setCount((count) => Math.max(0, count - 1))}>
                <Minus size={15} /> 
            </button>

            {count}

            <button onClick={() => setCount((count) => count + 1)}>
                <Plus size={15} /> 
            </button>
        </div>

    </div>
    );
};

export default BlindboxCard;