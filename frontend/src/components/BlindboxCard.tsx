// ====== Blind Box Card Format =====
import { Figure } from "../services/figures";

type BlindboxCardProps = {
    figure: Figure;
};

const BlindboxCard = ({ figure }: BlindboxCardProps) => {
    return (
    <div className="boxCard">
      <img 
        src={figure.imageUrl}
        className="figure"
        alt={figure.name}
      />

      <p className="figureId">{figure.id}</p>

      <p className="figureName">{figure.name}</p>
    </div>
    );
};

export default BlindboxCard;