import React from "react";
import Stopper from "./Stopper";
import "./styles.css";

export default class App extends React.Component {

  
  constructor(props) {
    super(props);
    this.delay = 10;
    this.player1x = 29;
    this.player2x = 490;
    this.pHeight = 80;
    this.gateHeight = 160;
    this.gateY = 160;
    this.p1GateX = 3;
    this.p2GateX = 490;
    this.playerMaxY = 400;
    this.playerMinY = 100;
    this.ballRadius = 10;
    this.bottomBoundary = 400;
    this.topBoundary = 95;
    this.leftBoundary = 5;
    this.rightBoundary = 500;
    this.defaultBallPosition = {
      x: 249,
      y: 225
    };

    this.state = {
      robot: false,
      device: null,
      notif: null,
      result: [0, 0],
      p1: 200,
      p2: 200,
      live: true,
      ballPosition: this.defaultBallPosition,
      move: {
        stepX: -1,
        stepY: 1
      }
    };
  }

  connectToBluetoothDevice = async () => {
    
    try {
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'GIANG' }], // Replace 'GIANG' with your Arduino device name
        optionalServices: ['00001101-0000-1000-8000-00805f9b34fb'], // Replace '1101' with your service UUID
      });

      this.setState({
        device: selectedDevice
      });

    } catch (error) {
      console.error('Error:', error);
    }
  };



  handleStartNotifications = async () => {
    if (this.state.device) {
      try {
        console.log("connectting to device")
        const server = await this.state.device.gatt.connect();
        const service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb'); // Replace '1101' with your service UUID
        console.log("finish connecting to device and getting primary service")

        // const accelerometerCharacteristicX = await service.getCharacteristic('00002101-0000-1000-8000-00805f9b34fb');
        const accelerometerCharacteristicY = await service.getCharacteristic('00002102-0000-1000-8000-00805f9b34fb');
        // const accelerometerCharacteristicZ = await service.getCharacteristic('00002103-0000-1000-8000-00805f9b34fb');

        console.log("finish getting characteristics")
        this.setState({notif: true})

        // accelerometerCharacteristicX.addEventListener('characteristicvaluechanged', handleCharacteristicData(accelX, setAccelX));
        accelerometerCharacteristicY.addEventListener('characteristicvaluechanged',  (e) => {
          const decodedData = new TextDecoder().decode(e.target.value);
          let step = 15;
          // Assuming decodedData is the value received from the IMU's Y-axis
     
          // if acceeleration is above some amount, move the player
          if (decodedData > 0.8) {
            this.setState({ p1: this.state.p1 - step * 3});
          } else if (decodedData > 0.5) {
            this.setState({ p1: this.state.p1 - step * 2});
          } else if (decodedData > 0.2) {
            this.setState({ p1: this.state.p1 - step * 1});
          }  else if (decodedData < -0.8) {
            this.setState({ p1: this.state.p1 + step * 3 });
          } else if (decodedData < -0.5) {
            this.setState({ p1: this.state.p1 + step * 2 });
          } else if (decodedData < -0.2) {
            this.setState({ p1: this.state.p1 + step * 1 });
          }
          

          if (this.state.p1 + this.pHeight >= this.playerMaxY) {
            this.setState({ p1: this.playerMaxY - this.pHeight });
          } else if (this.state.p1 <= this.playerMinY) {
            this.setState({ p1: this.playerMinY });
          }
        });
        
        await accelerometerCharacteristicY.startNotifications();
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No device selected');
    }
  };

  randomInitialMove() {
    const moves = [
      { stepX: 1, stepY: 1 },
      { stepX: 1, stepY: 2 },
      { stepX: 2, stepY: 1 },
      { stepX: -1, stepY: -1 },
      { stepX: -1, stepY: 1 }
    ];
    let initialMove = moves[Math.floor(Math.random() * moves.length)];
    console.log(initialMove);
    this.setState({ move: initialMove });
  }

  checkGoals() {
    if (this.state.ballPosition.x - 10 <= this.p1GateX + this.ballRadius * 2) {
      if (
        this.state.ballPosition.y <= this.gateY + this.gateHeight &&
        this.state.ballPosition.y >= this.gateY
      ) {
        this.setState({
          result: [this.state.result[0], this.state.result[1] + 1]
        });
        this.resetBall();
        this.randomInitialMove();
      }
    }
    if (this.state.ballPosition.x + 10 >= this.p2GateX + this.ballRadius) {
      if (
        this.state.ballPosition.y <= this.gateY + this.gateHeight &&
        this.state.ballPosition.y >= this.gateY
      ) {
        this.setState({
          result: [this.state.result[0] + 1, this.state.result[1]]
        });
        this.resetBall();
        this.randomInitialMove();
      }
    }
  }

  checkPlayers() {
    if (this.state.ballPosition.x - 5 <= this.player1x) {
      if (
        this.state.ballPosition.y <= this.state.p1 + this.pHeight &&
        this.state.ballPosition.y >= this.state.p1
      ) {
        this.setState({
          move: {
            stepX: -1 * this.state.move.stepX,
            stepY: 1 * this.state.move.stepY
          }
        });
      }
    }
    if (this.state.ballPosition.x + 10 >= this.player2x) {
      if (
        this.state.ballPosition.y <= this.state.p2 + this.pHeight &&
        this.state.ballPosition.y >= this.state.p2
      ) {
        this.setState({
          move: {
            stepX: -1 * this.state.move.stepX,
            stepY: 1 * this.state.move.stepY
          }
        });
      }
    }
  }

  checkBallBoundaries() {
    // dolna i górna ściana
    if (
      this.state.ballPosition.y + 20 >= this.bottomBoundary ||
      this.state.ballPosition.y - 10 <= this.topBoundary
    ) {
      this.setState({
        move: {
          stepX: this.state.move.stepX,
          stepY: -1 * this.state.move.stepY
        }
      });
    }

    // lewa i prawa ściana
    if (
      this.state.ballPosition.x - 10 <= this.leftBoundary ||
      this.state.ballPosition.x + 10 >= this.rightBoundary
    ) {
      this.setState({
        move: {
          stepX: -1 * this.state.move.stepX,
          stepY: this.state.move.stepY
        }
      });
    }
  }

  check() {
    this.checkPlayers();
    this.checkGoals();
    this.checkBallBoundaries();
  }

  componentDidMount() {
    // window.addEventListener("keydown", this.handleKeyPress);
    window.addEventListener("keydown", this.handleKeyPress2);
    this.timer = setInterval(() => this.tick(), this.delay);
  }

  componentWillUnmount() {
    // window.removeEventListener("keydown", this.handleKeyPress);
    window.removeEventListener("keydown", this.handleKeyPress2);
  }

  checkPlayer1Boundaries() {
    if (this.state.p1 + this.pHeight >= this.playerMaxY) {
      return false;
    }
    if (this.state.p1 <= this.playerMinY) {
      return false;
    }
    return true;
  }

  checkPlayer2Boundaries() {
    if (this.state.p2 + this.pHeight >= this.playerMaxY) {
      return false;
    }
    if (this.state.p2 <= this.playerMinY) {
      return false;
    }
    return true;
  }

  resetPlayer(player) {
    if (player === 1) {
      this.setState({ p1: 200 });
    } else {
      this.setState({ p2: 200 });
    }
  }

  // handleKeyPress = (event) => {
  //   let step = 7;
  //   if (event.key === "q") {
  //     this.setState({ p1: this.state.p1 - step });
  //   } else if (event.key === "a") {
  //     this.setState({ p1: this.state.p1 + step });
  //   }
  //   if (this.checkPlayer1Boundaries() === false) {
  //     this.resetPlayer(1);
  //   }
  // };
  controlPlayerTwo = () => {
    if (this.state.robot === false) {
      return
    }
    let step = 7;
  
    // Implement AI logic here to determine player movement based on ball position
    // Example: Follow the ball's y position
    if (this.state.ballPosition.y < this.state.p2) {
      this.setState({ p2: this.state.p2 - step });
    } else if (this.state.ballPosition.y > this.state.p2) {
      this.setState({ p2: this.state.p2 + step });
    }
  
    // Ensure player two stays within boundaries
    if (this.checkPlayer2Boundaries() === false) {
      // Adjust player two's position if out of bounds
      if (this.state.p2 + this.pHeight >= this.playerMaxY) {
        this.setState({ p2: this.playerMaxY - this.pHeight });
      } else if (this.state.p2 <= this.playerMinY) {
        this.setState({ p2: this.playerMinY });
      }
    }
  };
  
  // Call the controlPlayerTwo function in the tick method
  tick() {
    if (this.state.live === true) {
      this.setState({
        ballPosition: {
          x: this.state.ballPosition.x + this.state.move.stepX,
          y: this.state.ballPosition.y + this.state.move.stepY
        }
      });
      this.check();
      this.controlPlayerTwo(); // Call the function to control player two
    }
  }

  handleKeyPress2 = (event) => {
    console.log(event.key)
    let step = 7;
    if (event.key === "ArrowUp") {
      this.setState({ p2: this.state.p2 - step });
    } else if (event.key === "ArrowDown") {
      this.setState({ p2: this.state.p2 + step });
    }
    if (this.checkPlayer1Boundaries() === false) {
      this.resetPlayer(2);
    }
  };

  resetBall() {
    this.setState({
      ballPosition: this.defaultBallPosition
    });
  }

  restart() {
    this.stopper.reset();
    this.resetBall();
    this.randomInitialMove();
  }

  pause() {
    this.stopper.pause();
    if (this.state.live === true) {
      this.setState({ live: false });
    } else {
      this.setState({ live: true });
    }
  }

  printResult() {
    return "" + this.state.result[0] + ":" + this.state.result[1];
  }

  render() {
    return (
      <div className="App">
         <button onClick={this.connectToBluetoothDevice}>Connect to Bluetooth</button>
      <button onClick={this.handleStartNotifications}>Start Notifications</button>
        <h2>Pong</h2>
      {this.state.notif && 
      <>
        <Stopper
          ref={(instance) => {
            this.stopper = instance;
          }}
        />

        <div className="container">
          <div className="gameField">
            <div
              className="ball"
              style={{
                top: this.state.ballPosition.y,
                left: this.state.ballPosition.x
              }}
            />
            <div className="midLine" />
            <div className="player1" style={{ top: this.state.p1 }} />
            <div className="player2" style={{ top: this.state.p2 }} />
            <div className="gate1" />
            <div className="gate2" />
          </div>
          <div className="buttonsBar">
            <button
              onClick={() => {
                this.pause();
              }}
              id="leftBtn"
            >
              Pause
            </button>
            <div className="result">{this.printResult()}</div>
            <button
              onClick={() => {
                this.restart();
              }}
              id="rightBtn"
            >
              Restart
            </button>
            <p>Player1: rotate arduino</p>
            <p>Player2: Up, Down</p>
            <label>
              Robot Player:
              <input
                type="checkbox"
                checked={this.state.robot}
                onChange={() =>
                  this.setState((prevState) => ({
                    robot: !prevState.robot,
                  }))
                }
              />
            </label>

            
          </div>
        </div>
      </>}
      </div>
      
    );
  }
}
