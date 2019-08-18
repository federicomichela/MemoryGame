function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function formatTimeToString(ms) {
    let formattedTimeParts = [];
    let dayToMs = 24 * 60 * 60 * 1000;
    let hourToMs = 60 * 60 * 1000;
    let minuteToMs = 60 * 1000;
    let secondToMs = 1000;

    let days = Math.floor(ms / dayToMs);
    let hours = Math.floor((ms - (days * dayToMs)) / hourToMs);
    let minutes = Math.floor((ms - (hours * hourToMs)) / minuteToMs);
    let seconds = Math.floor((ms - (minutes * minuteToMs)) / secondToMs);

    if (days) { formattedTimeParts.push(`${days}d`); }
    if (hours || formattedTimeParts.length) { formattedTimeParts.push(`${hours}h`); }
    if (minutes || formattedTimeParts.length) { formattedTimeParts.push(`${minutes}m`); }
    if (seconds || formattedTimeParts.length) { formattedTimeParts.push(`${seconds}s`); }

    return formattedTimeParts.join(" ");
}

Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [this[i], this[j]] = [this[j], this[i]];
    }

    return this;
}
