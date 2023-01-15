const OptionButton = ({ option, onClick, isSelected, isCorrect }) => {
    return (
        <button
            className={`Answer ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${!isCorrect && isSelected ? 'incorrect' : ''}`}
            onClick={() => onClick(option)}>
            {option}
        </button>
    )
};
export default OptionButton;
