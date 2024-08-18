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
    text = text.replace(/\["?([\w\s]+)"?\]=/g, "\"$1\": ");
    text = text.replace(/,}/g,"}")
    text = text.replace("return ", "")
    document.getElementById('fileDetails').innerHTML = text;
}
