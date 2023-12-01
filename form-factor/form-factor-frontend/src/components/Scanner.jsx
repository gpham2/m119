import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function Scanner() {
  const [scanning, setScanning] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  const startScanning = () => {
    setScanning(true);
    setProcessing(false);
  };

  const stopScanning = () => {
    setScanning(false);
    setProcessing(true);
  };

  const stopProcessing = () => {
    setProcessing(false);
  };

  return (
    <div>
      <Button onClick={startScanning} disabled={scanning || processing}>
        Start Scanning
      </Button>
      <Button onClick={stopScanning} disabled={!scanning || processing}>
        Stop Scanning
      </Button>

      {scanning && (
        <Alert severity="warning">
          <AlertTitle>Scanning in progress</AlertTitle>
          <CircularProgress size={20} />
        </Alert>
      )}

      {processing && (
        <Alert severity="success">
          <AlertTitle>Processing...</AlertTitle>
          This might take a moment.
        </Alert>
      )}

      {!scanning && !processing && (
        <Alert severity="info">
          <AlertTitle>Scanning not in progress</AlertTitle>
          Click "Start Scanning" to begin.
        </Alert>
      )}

      {/* Conditionally render processing alert */}
      {processing && (
        <Alert severity="info" onClose={stopProcessing}>
          <AlertTitle>Processing completed</AlertTitle>
          Scanning results available.
        </Alert>
      )}
    </div>
  );
}
