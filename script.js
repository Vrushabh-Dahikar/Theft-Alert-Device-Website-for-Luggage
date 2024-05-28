const startPage = document.getElementById('start-page');
const safePage = document.getElementById('safe-page');
const alertPage = document.getElementById('alert-page');
const alertAudio = document.getElementById('alert-audio');

const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');

let isConnected = false;
let bluetoothDevice = null;
let bluetoothCharacteristic = null;

yesButton.addEventListener('click', () => {
    // Check if Bluetooth is available in the browser
    if ('bluetooth' in navigator) {
        startPage.classList.add('hidden');
        connectToBluetoothDevice();
    } else {
        alert('Bluetooth is not supported in this browser.');
    }
});

noButton.addEventListener('click', () => {
    startPage.classList.add('hidden');
    alert('Enjoy your day!');
});

async function connectToBluetoothDevice() {
    try {
        // Request a Bluetooth device
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service'], // Replace with your device's service UUIDs
        });

        // Connect to the GATT server
        const server = await bluetoothDevice.gatt.connect();

        // Get the service and characteristic
        const service = await server.getPrimaryService('battery_service');
        bluetoothCharacteristic = await service.getCharacteristic('battery_level');

        // Add a disconnect event listener
        bluetoothDevice.addEventListener('gattserverdisconnected', handleDisconnect);

        isConnected = true;
        safePage.classList.remove('hidden');
        alertPage.classList.add('hidden');
    } catch (error) {
        isConnected = false;
        safePage.classList.add('hidden');
        alertPage.classList.remove('hidden');
        console.error('Error connecting to the device:', error);

        // Play the alert sound from the local file
        alertAudio.play();
    }
}

function handleDisconnect(event) {
    isConnected = false;
    safePage.classList.add('hidden');
    alertPage.classList.remove('hidden');
    console.log('Device disconnected:', event.target);

    // Play the alert sound from the local file
    alertAudio.play();
}
