document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader()
        reader.onload = handleFileLoad;
        reader.readAsArrayBuffer(file);
    } else {
        document.getElementById('fileDetails').innerHTML = 'No file selected.';
    }
});

function handleFileLoad(event) {
    let text = pako.inflate(event.target.result, { windowBits: -15, to: "string"});
    let json = JSON.parse(cleanText(text));
    let allJokers = []
    let winners = {};
    let losers = {};
    for (const joker in json.joker_usage) {
        allJokers.push(joker);
        let wins = json.joker_usage[joker].wins;
        let losses = json.joker_usage[joker].losses;
        if (wins['8']) {
            winners[joker] = wins['8'];
        }
        if (losses['8']) {
            losers[joker] = losses['8'];
        }
    }

    let overallHtml = `Gold stickers: ${Object.keys(winners).length} / ${allJokers.length}<br>`
    document.getElementById('overall').innerHTML = overallHtml;

    let sortedWins = Object.entries(winners).sort(([,a],[,b]) => b-a);
    let winnersHtml = sortedWins.slice(0, 5).map(x => `${x[0]} (${x[1]})`).join('<br>');
    document.getElementById('wins').innerHTML = winnersHtml;

    let sortedLosses = Object.entries(losers).sort(([,a],[,b]) => b-a);
    let losersHtml = sortedLosses.slice(0, 5).map(x => `${x[0]} (${x[1]})`).join('<br>');
    document.getElementById('losses').innerHTML = losersHtml;

    let nonWinners = allJokers.filter(x => !Object.keys(winners).includes(x));
    let missingHtml = nonWinners.join('<br>');
    document.getElementById('missing').innerHTML = missingHtml;

}

function cleanText(text) {
    text = text.replace(/\["?([\w\s]+)"?\]=/g, "\"$1\": ");
    text = text.replace(/,}/g,"}");
    text = text.replace("return ", "");
    return text;
}
