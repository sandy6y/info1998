// ====== Blind Box Card Format =====

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
    
    </div>
    );
};

export default BlindboxCard;