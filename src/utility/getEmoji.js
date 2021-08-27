function getEmoji(number) {
    if (number === 1) return "✊";
    else if (number === 3) return "✌️";
    else if (number === 2) return "🤚";
    else return number;
}

module.exports = getEmoji;