import * as alt from 'alt';
import * as native from 'natives';

let electric = [
    2445973230,// neon
    1560980623,// airtug
    1147287684,// caddy
    3164157193,// dilettante
    2400073108,// surge
    544021352,// khamelion 
    2672523198,// voltic
    1031562256,// tezeract
    1392481335,// cyclone
    2765724541// raiden
];

let handbrakeActive = false;
alt.on('keydown', (key) => {
    if (key === 32) handbrakeActive = true; // space
    if (key === 35) { // end
        let currenctVehicle = alt.Player.local.vehicle;
        if (currenctVehicle) {
            let isRunning = native.getIsVehicleEngineRunning(currenctVehicle.scriptID);
            if (isRunning) {
                native.setVehicleEngineOn(currenctVehicle.scriptID, false, true, true);
            } else {
                native.setVehicleEngineOn(currenctVehicle.scriptID, true, true, true);
            }
        }
    }
});
alt.on('keyup', (key) => {
    if (key === 32) handbrakeActive = false; // space
});

let webView = null;
let fuelPercentage = 80;
alt.everyTick(() => {
    let vehicle = alt.Player.local.vehicle;
    if (vehicle) {
        if (!webView) {
            webView = new alt.WebView('http://resource/client/html/speedometer.html');
            webView.focus();
        } else {
            let lightsOn = native.getVehicleLightsState(vehicle.scriptID, false, false);
            let lightState = 0;
            if (lightsOn[1] && !lightsOn[2]) lightState = 1;
            if (lightsOn[1] && lightsOn[2]) lightState = 2;
            webView.emit('speedometer:data', {
                gear: parseInt(vehicle.gear),
                rpm: parseInt((vehicle.rpm * 10000).toFixed(0)),
                speed: parseInt((native.getEntitySpeed(vehicle.scriptID) * 3.6).toFixed(0)),
                isElectric: electric.includes(vehicle.model),
                isEngineRunning: native.getIsVehicleEngineRunning(vehicle.scriptID),
                isVehicleOnAllWheels: native.isVehicleOnAllWheels(vehicle.scriptID),
                handbrakeActive,
                lightState,
                fuelPercentage
            });
        }
    } else {
        if (webView) {
            webView.destroy();
            webView = null;
        }
    }
});