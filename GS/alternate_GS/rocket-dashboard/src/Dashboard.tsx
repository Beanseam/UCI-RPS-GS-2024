import AccelerationGraph1 from "./components/AccelerationGraph1";
import AccelerationGraph2 from "./components/AccelerationGraph2";
import GyroGraph from "./components/GyroGraph";
import MagGraph from "./components/MagGraph";
import AltitudeGraph from "./components/AltitudeGraph";
import PressureGraph from "./components/PressureGraph";
import TempGraph from "./components/TempGraph";
import Alert from "./components/Alert";
import { BPTesting } from "./components/BPTesting";
import Orientation3D from "./components/Orientation";

// import Orientation from "./components/Orientation";

// import SendCommandButton from "./components/SendCommandButton";
import './App.css';
import { SendCommandButton } from "./components/SendCommandButton";

const Dashboard = () => {
    
  return (
    // <div className="p-4">
    //   <h1 className="text-2xl font-bold mb-4">Rocket Dashboard</h1>
    //   <AccelerationGraph1 />
    //   <AccelerationGraph2 />
    //   <GyroGraph />
    //   <MagGraph />
    //   <AltitudeGraph />
    //   <PressureGraph />
    //   <TempGraph />

    // </div>
    
    <div className="dashboard-container">
        <h1 className="dashboard-title">Rocket Dashboard</h1>
        <div className="graph-row">
            <div className="graph-container">
                <AccelerationGraph1 />
            </div>
            <div className="graph-container">
                <AccelerationGraph2 />
            </div>
            <div className="graph-container">
                <GyroGraph />
            </div>
        </div>

        <div className="graph-row">
            <div className="graph-container">
                <MagGraph />
            </div>
            <div className="graph-container">
                <AltitudeGraph />
            </div>
            <div className="graph-container">
                <PressureGraph />
            </div>
        </div>

        {/* <div className="graph-row">
            <div className="graph-container">
                <TempGraph />
            </div>
        </div> */}

        <Alert />
        <SendCommandButton />
        <Orientation3D />
        <BPTesting />
    </div>
  );
};

export default Dashboard;
