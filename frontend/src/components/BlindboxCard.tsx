import { useEffect, useState } from "react";
import "./styles.css";
import { useCollected } from "../context/CollectedContext";
import { Plus, Minus } from "lucide-react";

type BlindboxCardProps = {
    blindbox: Blindbox;
};


const BlindboxCard = ({blindbox}: BlindboxCardProps) => {
    
    const [count, setCount] = useState(0);
    const {increase, decrease } = useCollected();

    const handlePlus = () => {
      setCount((prev) => prev + 1);
      increase();
    }

    const handleMinus = () => {
      if (count > 0) {
        setCount((prev) => prev - 1);
        decrease(); 
      }
    }

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
            <button onClick={handleMinus}>
                <Minus size={15} /> 
            </button>
            {count}
            <button onClick={handlePlus}>
                <Plus size={15} /> 
            </button>
        </div>
    </div>
    );
};

export default BlindboxCard;