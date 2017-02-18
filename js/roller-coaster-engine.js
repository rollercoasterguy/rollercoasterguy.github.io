$(document).ready(function() {
    // sorry for my poor js skills

    var tronaldDump = ["PANIC SELLING!!!", "DUMPPP!", "SWSF'S FAULT", "BIGGER BLOCKS CENTRALIZATION", "Cheina. China. Jina. Shyna", "buy da dip", "Bitcoin up to 10% off", "Tronald DUMP!", "China ban. Ban china"];
    var hodlersBelike = ["hooodl", "hodloor", "To da mooooon", "$10K INCOMING!!!", "BITCOIN WILL UNITE US!", "PUMP", "buckle up hodlers", "can't see any altcoin up here", "hey r/bitcoin, should I buy today?"];
    var meh = ["meh..", "mmm...", "meh", "mmm..", "no ban no fun", "meh", "no ban no fun", "mmm", "no crisis, no pump"];
    var maximum = hodlersBelike.length;
    var currentMoon = null;
    var oldEarth = null;
    var timeframe = ['15m', '30m', '1h', '3h', '6h', '12h', '1D'];

    var markets = [new Bitfinex(), new Bitstamp()]
    var selectedMarketIndex = 0;
    var selectedMarket = markets[selectedMarketIndex];

    function moonTicker() {
        selectedMarket.fetchPrices(mooningFunction);
        for (i = 0; i < markets.length; i++) {
            if (i != selectedMarketIndex)
                markets[i].fetchPrices(updateTicker);
        }
    }

    function mooningFunction(open, close, id) {
        oldEarth = open;
        currentMoon = close;

        var change = currentMoon - oldEarth;
        var angle = (Math.atan2(change, 15) * 180 / Math.PI);

        var signal = change >= 0 ? '+' : '-';
        $('#current-moon').html('$' + currentMoon + " USD");
        $('#change-value').html(signal + Math.abs((change)).toFixed(2));
        $('#change-percentage').html(signal + Math.abs((((currentMoon / oldEarth) - 1) * 100)).toFixed(2) + "%");
        document.title = '(' + Number(currentMoon).toFixed(1) + ')' + " Bitcoin Roller Coaster Guy";

        updateStatus(angle);
        updateLabels(angle);
        updateTicker(open, close, id);

        feeRequest();
    }

    function updateTicker(open, close, id) {
        $('#ticker-' + id).html(close);
    }

    function updateStatus(angle) {
        var absAngle = Math.abs(angle);
        var randomNumber = getRandom(maximum);
        var rollerCoasterStatus = "";
        var angleTreshold = 15;

        if (absAngle >= angleTreshold) {
            $("#roller-coaster-guy").attr("src", "images/roller-coaster-guy.gif");
            rotateTheGuy(90 - (angle)); //  +90 degrees 'cause de upwards gif

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
    setInterval(moonTicker, 10 * 1000);


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

    $(".market-ticker").click(function(selected) {

        var market = $(this)[0];
        selectedMarketIndex = market.id;
        setMarket(selectedMarketIndex);
        moonTicker();
        $(".market-ticker").removeClass("active");
        $(market).addClass("active");

    });

    function setMarket(marketIndex) {
        return selectedMarket = markets[marketIndex];
    }

});