$(() => {
    // speedometer
    if ($("#speedometer").length) {
        alt.on('speedometer:data', (data) => {
            let speed = data.speed;
            let gear = data.gear;
            let rpm = data.rpm;
            let isElectric = data.isElectric;

            let gearCurrent = gear;
            let gearNext = 0;
            let gearBefore = 0;

            let gearOrder = ['R', 'P', 1, 2, 3, 4, 5, 6];
            if (isElectric) gearOrder = ['R', 'P', 1];
            let gearIndex = 0;

            if (speed === 0) {// parking
                gearIndex = 1;
            } else if (gearCurrent === 0 && speed > 0) {// backwards
                gearIndex = 0;
            } else if (gearCurrent === 1) {// first gear
                gearIndex = 2;
            } else if (gearCurrent === 6) {// last gear
                gearIndex = 7;
            } else {
                gearNext = gear + 1;
                gearBefore = gear - 1;
                gearIndex = gear + 1;
            }

            gearCurrent = gearOrder[gearIndex];
            gearNext = gearOrder[gearIndex + 1] !== undefined ? gearOrder[gearIndex + 1] : '';
            gearBefore = gearOrder[gearIndex - 1] !== undefined ? gearOrder[gearIndex - 1] : '';
            gearBefore = gearBefore !== '' ? gearBefore : '-';
            gearNext = gearNext !== '' ? gearNext : '-';
            
            let rpmPercent = (rpm / 10000 * 100).toFixed(0);

            let displayShiftUp = rpmPercent < 90 ? 'none' : 'block';
            if (gearCurrent === 'R' || gearCurrent === 'P' || gearCurrent === 6) displayShiftUp = 'none';
            if (isElectric) if (gearCurrent > 0) displayShiftUp = 'none';

            let transform = Math.round(rpm / 1000 * 27 + 180);
            $("#needle").css("transform", "rotate("+transform+"deg)");

            $("#gearNext").text(gearNext);
            $("#gearCurrent").text(gearCurrent);
            $("#gearBefore").text(gearBefore);
            $("#shift").css("display", displayShiftUp);
            $("#speed").text(speed);
            $(".lightOff").css("color", "#FFF");
            $("#fuelbar > div").css("height", data.fuelPercentage + "%");

            toggleLight(true);
            if (!data.isEngineRunning) {
                toggleLight(false);
                $("#needle").css("transform", "rotate(180deg)");
                $("#shift").css("display", "none");
                if (speed > 0) {
                    $("#gearNext").text('P');
                    $("#gearCurrent").text('N');
                    $("#gearBefore").text('R');
                } else {
                    $("#gearNext").text('1');
                    $("#gearCurrent").text('P');
                    $("#gearBefore").text('R');
                }
            }

            if (data.isEngineRunning) {
                !data.handbrakeActive ? $("#handbrake").hide() : $("#handbrake").show();
                data.isVehicleOnAllWheels ? $("#inair").hide() : $("#inair").show();
                if (data.lightState === 1) {
                    $("#lightsOn").show().css("color", "#193a61");
                } else if (data.lightState === 2) {
                    $("#lightsOn").show().css("color", "#3b97ff");
                } else {
                    $("#lightsOn").hide();
                }
                $("#fuel").show();
            } else {
                $("#handbrake").hide();
                $("#inair").hide();
                $("#lightsOn").hide();
                $("#fuel").hide();
            }
            

            function toggleLight(state) {
                let color = "#FFF";
                if (state === false) color = "#424242";
                $("#pin").css("color", color).css("border-color", color);
                $("#kmh").css("color", color);
                for (let i = 1; i <= 18; i++) {
                    $(".ii div:nth-child("+i+") > b").css("background-color", color);
                }
                for (let i = 1; i <= 9; i++) {
                    $(".num_" + i).css("color", color);
                }
            }
        });
    }
});