class color {
    /**
     * @param {Object} colors The colors to use in embeds.
     * @param {String} colors.readyEmbed The color for ready embed.
     * @param {String} colors.errorEmbed The color for error embed.
     * @param {String} colors.drawEmbed The color for draw embed.
     * @param {String} colors.endEmbed The color for draw embed.
     * @param {String} colors.choiceEmbed the color for choice embed.
     */
    constructor(colors = {}) {
        if (typeof (colors) !== "object") throw new Error("Color should be an object but I got : " + JSON.stringify(colors))
        this.readyEmbed = colors.readyEmbed || "#e97d00";
        this.errorEmbed = colors.errorEmbed || "#ff0000";
        this.endEmbed = colors.endEmbed || "#00e9a9";
        this.drawEmbed = colors.drawEmbed || "#8e00e9";
        this.choiceEmbed = colors.choiceEmbed || "#e9a500";

        Object.values(this).forEach((v, i) => {
            if (typeof (v) !== "string" || !v.startsWith("#")) throw new Error(`colors.${Object.keys(this)[i]} should be a string ( Hex Color Code ) but I got ` + JSON.stringify(v));
        })
    }
}

module.exports = color;