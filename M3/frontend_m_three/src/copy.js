import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function App() {
  const [device, setDevice] = useState(null);
  const [accelerometerData, setAccelerometerData] = useState({
    AccelX: [],
    AccelY: [],
    AccelZ: [],
  });
  const [gyroscopeData, setGyroscopeData] = useState({
    GyroX: [],
    GyroY: [],
    GyroZ: [],
  });

  const connectToBluetoothDevice = async () => {
    try {
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'GIANG' }],
        optionalServices: ['00001101-0000-1000-8000-00805f9b34fb'],
      });

      setDevice(selectedDevice);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleStartNotifications = async () => {
    if (device) {
      try {
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');

        const accelerometerCharacteristicX = await service.getCharacteristic('00002101-0000-1000-8000-00805f9b34fb');
        const accelerometerCharacteristicY = await service.getCharacteristic('00002102-0000-1000-8000-00805f9b34fb');
        const accelerometerCharacteristicZ = await service.getCharacteristic('00002103-0000-1000-8000-00805f9b34fb');
        const gyroscopeCharacteristicX = await service.getCharacteristic('00002201-0000-1000-8000-00805f9b34fb');
        const gyroscopeCharacteristicY = await service.getCharacteristic('00002202-0000-1000-8000-00805f9b34fb');
        const gyroscopeCharacteristicZ = await service.getCharacteristic('00002203-0000-1000-8000-00805f9b34fb');

        accelerometerCharacteristicX.addEventListener('characteristicvaluechanged', (event) => {
          // const value = new DataView(event.target.value).getInt16(0, true);
          const value = event.target.value
          console.log(value)
          // setAccelerometerData((prevData) => ({ ...prevData, AccelX: [...prevData.AccelX, value] }));
        });
        accelerometerCharacteristicY.addEventListener('characteristicvaluechanged', (event) => {
          // const value = new DataView(event.target.value).getInt16(0, true);
          // setAccelerometerData((prevData) => ({ ...prevData, AccelY: [...prevData.AccelY, value] }));
        });
        accelerometerCharacteristicZ.addEventListener('characteristicvaluechanged', (event) => {
          // const value = new DataView(event.target.value).getInt16(0, true);
          // setAccelerometerData((prevData) => ({ ...prevData, AccelZ: [...prevData.AccelZ, value] }));
        });

        gyroscopeCharacteristicX.addEventListener('characteristicvaluechanged', (event) => {
          // const value = new DataView(event.target.value).getInt16(0, true);
          // setGyroscopeData((prevData) => ({ ...prevData, GyroX: [...prevData.GyroX, value] }));
        });
        gyroscopeCharacteristicY.addEventListener('characteristicvaluechanged', (event) => {
          // const value = new DataView(event.target.value).getInt16(0, true);
          // setGyroscopeData((prevData) => ({ ...prevData, GyroY: [...prevData.GyroY, value] }));
        });
        gyroscopeCharacteristicZ.addEventListener('characteristicvaluechanged', (event) => {
          // const value = new DataView(event.target.value).getInt16(0, true);
          // setGyroscopeData((prevData) => ({ ...prevData, GyroZ: [...prevData.GyroZ, value] }));
        });

        await accelerometerCharacteristicX.startNotifications();
        await accelerometerCharacteristicY.startNotifications();
        await accelerometerCharacteristicZ.startNotifications();
        await gyroscopeCharacteristicX.startNotifications();
        await gyroscopeCharacteristicY.startNotifications();
        await gyroscopeCharacteristicZ.startNotifications();
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No device selected');
    }
  };

  // Generate labels for Line chart (0 to length of the data)
  const labels = Array.from({ length: Math.max(
    accelerometerData.AccelX.length,
    accelerometerData.AccelY.length,
    accelerometerData.AccelZ.length,
    gyroscopeData.GyroX.length,
    gyroscopeData.GyroY.length,
    gyroscopeData.GyroZ.length,
  ) }, (_, i) => i.toString());

  const accelDataSets = [
    {
      label: 'AccelX',
      data: accelerometerData.AccelX,
      fill: false,
      borderColor: 'red',
    },
    {
      label: 'AccelY',
      data: accelerometerData.AccelY,
      fill: false,
      borderColor: 'green',
    },
    {
      label: 'AccelZ',
      data: accelerometerData.AccelZ,
      fill: false,
      borderColor: 'blue',
    },
  ];

  const gyroDataSets = [
    {
      label: 'GyroX',
      data: gyroscopeData.GyroX,
      fill: false,
      borderColor: 'orange',
    },
    {
      label: 'GyroY',
      data: gyroscopeData.GyroY,
      fill: false,
      borderColor: 'purple',
    },
    {
      label: 'GyroZ',
      data: gyroscopeData.GyroZ,
      fill: false,
      borderColor: 'pink',
    },
  ];

  const data = {
    labels,
    datasets: accelDataSets,
  };

  const gyroData = {
    labels,
    datasets: gyroDataSets,
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log(accelerometerData)
  //     console.log(gyroscopeData)
      

  //   }, 2000); // Update every 0.5 seconds

  //   return () => clearInterval(interval); // Cleanup the interval on component unmount
  // }, [accelerometerData, gyroscopeData]); // Add dependencies as needed for the updates


  return (
    <div className="App">
      <h1>Bluetooth Data Logging</h1>
      <button onClick={connectToBluetoothDevice}>Connect to Bluetooth</button>
      <button onClick={handleStartNotifications}>Start Notifications</button>
      <div>
        <h2>Accelerometer Data</h2>
        <Line data={data} />
        <h2>Gyroscope Data</h2>
        <Line data={gyroData} />
      </div>
    </div>
  );
}

export default App;
