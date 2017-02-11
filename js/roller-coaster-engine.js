$(document).ready(function() {

    var tronaldDump = ["PANIC SELLING!!!", "DUMPPP!", "SWSF'S FAULT", "BIGGER BLOCKS CENTRALIZATION", "Cheina. China. Jina. Shyna", "buy da dip", "Bitcoin up to 10% off", "Tronald DUMP!"];
    var hodlersBelike = ["hooodl", "hodloor", "To the mooooon", "$10K INCOMING!!!", "BITCOIN WILL UNITE US!", "PUMP", "buckle up hodlers", "can't see any altcoin up here"];
    var meh = ["meh..", "mmm...", "meh", "mmm..", "no ban no fun", "meh", "no ban no fun", "mmm"];
    var maximum = hodlersBelike.length;
    var currentMoon = null;

    function moonTicker() {
        $.ajax({
            dataType: "json",
            url: "https://api.bitfinex.com/v2/candles/trade:5m:tBTCUSD/hist?limit=6",
            success: mooningFunction
        });
    }

    function mooningFunction(data) {
        var oldEarth = data[5][1];
        currentMoon = data[0][2];

        var angle = (Math.atan2(currentMoon - oldEarth, 15) * 180 / Math.PI);

        $('#current-moon').html('$' + currentMoon + " USD");
        document.title = '(' + Number(currentMoon).toFixed(1) + ')' + " Bitcoin Roller Coaster Guy";

        updateStatus(angle);
        updateLabels(angle);

        feeRequest();
    }

    function updateStatus(angle) {
        var absAngle = Math.abs(angle);
        var randomNumber = getRandom(maximum);
        var rollerCoasterStatus = "";
        var angleTreshold = 7.5;

        if (absAngle >= angleTreshold) {
            $("#roller-coaster-guy").attr("src", "images/roller-coaster-guy.gif");
            rotateTheGuy(90 - (angle * 1.1)); //  +90 degrees 'cause de upwards gif // *1.1 for more inclination

            if (angle >= 0) {
                rollerCoasterStatus = hodlersBelike[randomNumber];
            } else {
                rollerCoasterStatus = tronaldDump[randomNumber];
            }
        } else {
            rollerCoasterStatus = meh[randomNumber];
            $("#roller-coaster-guy").attr("src", "images/no-fun-roller-coaster-guy.gif");
            rotateTheGuy(-angle);
        }

        $('#roller-coaster-status').html(rollerCoasterStatus);

    }

    function rotateTheGuy(angle) {
        $("#roller-coaster-guy").css({
            "transform": "rotate(" + angle + "deg)",
            "-moz-transform": "rotate(" + angle + "deg)",
            "o-transform": "rotate(" + angle + "deg)",
            "webkit-transform": "rotate(" + angle + "deg)"
        });
    }

    function updateLabels(angle) {
        if (angle >= 0) {
            $('.panel').removeClass("panel-danger").addClass("panel-success");
            $('.label').removeClass("label-danger").addClass("label-success");
        } else {
            $('.panel').removeClass("panel-success").addClass("panel-danger");
            $('.label').removeClass("label-success").addClass("label-danger");
        }
    }


    function getRandom(max) {
        return Math.round(Math.random() * max);
    }

    moonTicker();
    setInterval(moonTicker, 6 * 1000);


    //thread txCount request
    function txCountRequest() {
        $.ajax({
            dataType: "json",
            url: "https://blockchain.info/q/unconfirmedcount?cors=true",
            success: mempoolAttack
        });
    }

    function mempoolAttack(data) {
        var soMuchTxs = data;
        $('#tx-count').html(soMuchTxs);
    }

    txCountRequest();
    setInterval(txCountRequest, 30 * 1000);


    //thread for fee request
    function feeRequest() {
        $.ajax({
            dataType: "json",
            url: "https://bitcoinfees.21.co/api/v1/fees/recommended",
            success: makeFeeGreatAgain
        });
    }

    function makeFeeGreatAgain(data) {
        var fastestAvgFee = data.fastestFee;
        var fastestAvgFeePerTx = ((fastestAvgFee * 226) / 100000000) * currentMoon;
        $('#fastest-avg-fee').html("~$" + Number(fastestAvgFeePerTx).toFixed(3) + " USD");

    }

});