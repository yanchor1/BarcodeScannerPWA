const codeReader = new ZXing.BrowserBarcodeReader();
const scanBtn = document.getElementById('scanBtn');
const barcodeList = document.getElementById('barcodeList');
let barcodes = [];

scanBtn.addEventListener('click', () => {
    codeReader.decodeOnceFromVideoDevice(undefined, 'video').then((result) => {
        const li = document.createElement('li');
        li.textContent = result.text;
        barcodeList.appendChild(li);
        barcodes.push(result.text);
    }).catch((err) => {
        console.error(err);
    });
});

function downloadTxtFile() {
    const blob = new Blob([barcodes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'barcodes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
