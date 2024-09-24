window.addEventListener('load', function () {
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserMultiFormatReader();
    console.log('ZXing code reader initialized');
  
    const uniqueBarcodes = new Set(); // Set to store unique barcodes
    const notification = document.getElementById('notification');
  
    // Show notification function
    function showNotification(message, type, duration) {
      notification.textContent = message;
      notification.className = `notification ${type}`;
      notification.style.display = 'block';
      setTimeout(() => {
        notification.style.display = 'none';
      }, duration);
    }
  
    // Optimize video stream with ideal resolution
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 }, // High resolution video
        height: { ideal: 720 }
      }
    }).then((stream) => {
      document.getElementById('video').srcObject = stream;
    }).catch((err) => {
      console.error('Kamera hatası:', err);
    });
  
    // List available video input devices and select one
    codeReader.listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length > 0) {
          selectedDeviceId = videoInputDevices[0].deviceId;
  
          // Start continuous barcode scan on button click
          document.getElementById('startButton').addEventListener('click', () => {
            codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
              if (result) {
                const barcodeText = result.text;
                if (!uniqueBarcodes.has(barcodeText)) { // Check if barcode is unique
                  uniqueBarcodes.add(barcodeText); // Add to the set
                  const resultList = document.getElementById('resultList');
                  const li = document.createElement('li');
                  li.textContent = barcodeText;
                  resultList.appendChild(li);
                  showNotification('Barkod okuma başarılı', 'success', 2000);
                } else {
                  showNotification('Bu barkod daha önce okundu', 'error', 3000);
                }
              }
              if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error('Hata:', err);
              }
            });
            console.log(`Started continuous decode from camera with id ${selectedDeviceId}`);
          });
  
          // Reset the barcode list and clear the set on reset button click
          document.getElementById('resetButton').addEventListener('click', () => {
            codeReader.reset();
            document.getElementById('resultList').innerHTML = '';
            uniqueBarcodes.clear(); // Clear the set
            console.log('Reset.');
          });
  
          // Download barcode list as a .txt file on download button click
          document.getElementById('downloadButton').addEventListener('click', () => {
            const barcodes = Array.from(uniqueBarcodes);
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            const blob = new Blob([barcodes.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `barkod-listesi-${today}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
        } else {
          console.error('No video input devices found.');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
  
