import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


function App() {
  const [device, setDevice] = useState(null);




  const [chartDataAX, setChartDataAX] = useState(null);
  const [chartDataAY, setChartDataAY] = useState(null);
  const [chartDataAZ, setChartDataAZ] = useState(null);
  const [chartDataGX, setChartDataGX] = useState(null);
  const [chartDataGY, setChartDataGY] = useState(null);
  const [chartDataGZ, setChartDataGZ] = useState(null);

  const [accelX, setAccelX] = useState([]);
  const [accelY, setAccelY] = useState([]);
  const [accelZ, setAccelZ] = useState([]);
  const [gyroX, setGyroX] = useState([]);
  const [gyroY, setGyroY] = useState([]);
  const [gyroZ, setGyroZ] = useState([]);

  const [ax, setAX] = useState(false);
  const [ay, setAY] = useState(false);
  const [az, setAZ] = useState(false);
  const [gx, setGX] = useState(false);
  const [gy, setGY] = useState(false);
  const [gz, setGZ] = useState(false);


  // set it from 1 to 16

  const [allLabels, setAllLabels] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, 16]);


  const [selectedChart, setSelectedChart] = useState('AX');

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'AX':
        return chartDataAX && <Line data={chartDataAX} options={{ responsive: true, maintainAspectRatio: false}} />;
      case 'AY':
        return chartDataAY && <Line data={chartDataAY} options={{ responsive: true,  maintainAspectRatio: false }} />;
      case 'AZ':
        return chartDataAZ && <Line data={chartDataAZ} options={{ responsive: true ,  maintainAspectRatio: false}} />;
      case 'GX':
        return chartDataGX && <Line data={chartDataGX} options={{ responsive: true ,  maintainAspectRatio: false}} />;
      case 'GY':
        return chartDataGY && <Line data={chartDataGY} options={{ responsive: true ,  maintainAspectRatio: false}} />;
      case 'GZ':
        return chartDataGZ && <Line data={chartDataGZ} options={{ responsive: true ,  maintainAspectRatio: false}} />;
      default:
        return null;
    }
  };

  const connectToBluetoothDevice = async () => {
    
    try {
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'GIANG' }], // Replace 'GIANG' with your Arduino device name
        optionalServices: ['00001101-0000-1000-8000-00805f9b34fb'], // Replace '1101' with your service UUID
      });

      setDevice(selectedDevice);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCharacteristicData = (dataSet, setDataSet, setFlag) => {
    return (event) => {
      const value = event.target.value;
      const decodedData = new TextDecoder().decode(value);
  
      if (dataSet.length > 15) {
        dataSet.shift();
      }
  
      dataSet.push(decodedData);
      setDataSet([...dataSet]);
      setFlag((flag) => !flag);
    };
  };

  const handleStartNotifications = async () => {
    if (device) {
      try {
        console.log("connectting to device")
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb'); // Replace '1101' with your service UUID
        console.log("finish connecting to device and getting primary service")

        const accelerometerCharacteristicX = await service.getCharacteristic('00002101-0000-1000-8000-00805f9b34fb');
        const accelerometerCharacteristicY = await service.getCharacteristic('00002102-0000-1000-8000-00805f9b34fb');
        const accelerometerCharacteristicZ = await service.getCharacteristic('00002103-0000-1000-8000-00805f9b34fb');
        const gyroscopeCharacteristicX = await service.getCharacteristic('00002201-0000-1000-8000-00805f9b34fb');
        const gyroscopeCharacteristicY = await service.getCharacteristic('00002202-0000-1000-8000-00805f9b34fb');
        const gyroscopeCharacteristicZ = await service.getCharacteristic('00002203-0000-1000-8000-00805f9b34fb');

        console.log("finish getting characteristics")

        accelerometerCharacteristicX.addEventListener('characteristicvaluechanged', handleCharacteristicData(accelX, setAccelX, setAX));
        accelerometerCharacteristicY.addEventListener('characteristicvaluechanged', handleCharacteristicData(accelY, setAccelY, setAY));
        accelerometerCharacteristicZ.addEventListener('characteristicvaluechanged', handleCharacteristicData(accelZ, setAccelZ, setAZ));
        gyroscopeCharacteristicX.addEventListener('characteristicvaluechanged', handleCharacteristicData(gyroX, setGyroX, setGX));
        gyroscopeCharacteristicY.addEventListener('characteristicvaluechanged', handleCharacteristicData(gyroY, setGyroY, setGY));
        gyroscopeCharacteristicZ.addEventListener('characteristicvaluechanged', handleCharacteristicData(gyroZ, setGyroZ, setGZ));

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


  useEffect(() => {
    const data = {
      labels: allLabels,
      datasets: [
        {
          label: 'Accelerometer X',
          data: accelX,
          fill: false,
          borderColor: 'red',
        },
      ],
    };
    setChartDataAX(data);
  }, [ax]);

  useEffect(() => {
    const data = {
      labels: allLabels,
      datasets: [
        {
          label: 'Accelerometer Y',
          data: accelY,
          fill: false,
          borderColor: 'blue',
        },
      ],
    };
    setChartDataAY(data);
  }, [ay]);
  
  useEffect(() => {
    const data = {
      labels: allLabels,
      datasets: [
        {
          label: 'Accelerometer Z',
          data: accelZ,
          fill: false,
          borderColor: 'green',
        },
      ],
    };
    setChartDataAZ(data);
  }, [az]);
  
  useEffect(() => {
    const data = {
      labels: allLabels,
      datasets: [
        {
          label: 'Gyroscope X',
          data: gyroX,
          fill: false,
          borderColor: 'purple',
        },
      ],
    };
    setChartDataGX(data);
  }, [gx]);
  
  useEffect(() => {
    const data = {
      labels: allLabels,
      datasets: [
        {
          label: 'Gyroscope Y',
          data: gyroY,
          fill: false,
          borderColor: 'orange',
        },
      ],
    };
    setChartDataGY(data);
  }, [gy]);
  
  useEffect(() => {
    const data = {
      labels: allLabels,
      datasets: [
        {
          label: 'Gyroscope Z',
          data: gyroZ,
          fill: false,
          borderColor: 'pink',
        },
      ],
    };
    setChartDataGZ(data);
  }, [gz]);
  

  return (
    <div className="App">
      <h1>Bluetooth Data Logging</h1>
      <button onClick={connectToBluetoothDevice}>Connect to Bluetooth</button>
      <button onClick={handleStartNotifications}>Start Notifications</button>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setSelectedChart('AX')}>Accelerometer X</button>
        <button onClick={() => setSelectedChart('AY')}>Accelerometer Y</button>
        <button onClick={() => setSelectedChart('AZ')}>Accelerometer Z</button>
        <button onClick={() => setSelectedChart('GX')}>Gyroscope X</button>
        <button onClick={() => setSelectedChart('GY')}>Gyroscope Y</button>
        <button onClick={() => setSelectedChart('GZ')}>Gyroscope Z</button>
      </div>
      <div>
        {renderSelectedChart()}
      </div>
    </div>
  );
}

export default App;