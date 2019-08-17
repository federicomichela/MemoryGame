function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function formatTimeToString(ms) {
    let seconds = Math.round(ms/1000) % 60;
    let minutes = Math.round(seconds / 60) % 60;
    let hours = Math.round(minutes / 60) % 24;
    let days = Math.round(hours/24);
    let formattedTime = `${hours}h ${minutes}m ${seconds}s`;

    if (days) {
        formattedTime = `${days}d ${formattedTime}`;
    }

    return formattedTime;
}

Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [this[i], this[j]] = [this[j], this[i]];
    }

    return this;
}
