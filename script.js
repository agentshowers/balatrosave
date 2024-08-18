const STAKES = 8;

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader()
        reader.onload = handleFileLoad;
        reader.readAsArrayBuffer(file);
    }
});

function handleFileLoad(event) {
    let text = pako.inflate(event.target.result, { windowBits: -15, to: "string"});
    let json = JSON.parse(cleanText(text));
    let stakes = Array.from(Array(STAKES + 1), () => []);
    for (const joker in json.joker_usage) {
        let wins = Object.keys(json.joker_usage[joker].wins);
        let maxWin = 0;
        if (wins.length > 0) {
            maxWin = Number(wins.sort()[wins.length - 1]);
        }
        stakes[maxWin].push(joker);
    }

    for (let i = 0; i <= STAKES; i++) {
        let html = stakes[i].join("<br>");
        document.getElementById(`stake_${i}`).innerHTML = html;
        document.getElementById(`stake_${i}_count`).innerHTML = `(${stakes[i].length})`;
    } 

}

function cleanText(text) {
    text = text.replace(/\["?([\w\s]+)"?\]=/g, "\"$1\": ");
    text = text.replace(/,}/g,"}");
    text = text.replace("return ", "");
    return text;
}
