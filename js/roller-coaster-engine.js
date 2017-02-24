$(document).ready(function() {

    var tronaldDump = ["PANIC SELLING!!!", "DUMPPP!", "SWSF'S FAULT", "BIGGER BLOCKS CENTRALIZATION", "Cheina. China. Jina. Shyna", "buy da dip", "Bitcoin up to 10% off", "Tronald DUMP!", "China ban. Ban china"];
    var hodlersBelike = ["hooodl", "hodloor", "To da mooooon", "$10K INCOMING!!!", "BITCOIN WILL UNITE US!", "PUMP", "buckle up hodlers", "can't see any altcoin up here", "hey r/bitcoin, should I buy today?"];
    var meh = ["meh..", "mmm...", "meh", "mmm..", "no ban no fun", "meh", "no ban no fun", "mmm", "no etf, no pump"];
    var maximum = hodlersBelike.length;
    var currentMoon = null;
    var oldEarth = null;

    var markets = [new Bitfinex(), new Bitstamp()];
    var selectedMarketIndex = 0;
    var selectedMarket = markets[selectedMarketIndex];

    function fetchMooningPrices() {
        selectedMarket.fetchPrices(mooningFunction);
        for (i = 0; i < markets.length; i++) {
            if (i != selectedMarketIndex)
                markets[i].fetchPrices(updateTicker);
        }
    }
    //boostrap to display current mooning prices and daily change
    fetchMooningPrices();
    setInterval(fetchMooningPrices, 5 * 60 * 1000);


    //web sockets running to not lose the mooning prices
    for (i = 0; i < markets.length; i++) {
        markets[i].runWebsocketTicker(updateTicker);
    }

    function moonTicker() {
        mooningFunction(selectedMarket.getOpenPrice(), selectedMarket.getLatestPrice(), selectedMarketIndex);
    }

    function mooningFunction(open, close, id) {
        updateCurrentMoon(open, close);
        updateStatus(open, close);
        updateLabels(open, close);
        updateTicker(open, close, id);
        updateHodlings(close);
    }

    function updateCurrentMoon(open, close) {

        if (currentMoon != close) {
            oldEarth = open;
            currentMoon = close;

            var change = currentMoon - oldEarth;

            $('#current-moon').html('$' + currentMoon + " USD");
            animateMoonElem($('#current-moon'));

            var signal = change >= 0 ? '+' : '-';
            $('#change-value').html(signal + Math.abs((change)).toFixed(2));
            $('#change-percentage').html(signal + Math.abs((((currentMoon / oldEarth) - 1) * 100)).toFixed(2) + "%");

            document.title = '(' + currentMoon + ')' + " Bitcoin Roller Coaster Guy";
            feeRequest();
        }
    }

    function updateHodlings(close) {
        var hodlingsAmount = $('#hodlings').val();
        if (hodlingsAmount != undefined && hodlingsAmount != 0) {
            $('#hodler-hodlings').html('$' + (close * hodlingsAmount).toFixed(2));
        }
    }


    function updateTicker(open, close, id) {
        var tickerElem = $('#ticker-' + id);
        if (close != tickerElem.html()) {
            tickerElem.html(close);
            animateMoonElem(tickerElem);
        }
    }

    function animateMoonElem(mooningElem) {
        // it must have pulse class
        mooningElem.addClass("flash");
        setTimeout(function() {
            mooningElem.removeClass("flash")
        }, 1000);
    }

    function updateStatus(open, close) {
        var angle = (Math.atan2(close - open, 15) * 180 / Math.PI);
        var absAngle = Math.abs(angle);
        var randomNumber = getRandom(maximum);
        var rollerCoasterStatus = "";
        var angleTreshold = 20;

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

    function updateLabels(open, close) {
        if ((open - close) < 0) {
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

    $(".market-ticker").click(function(selected) {

        var market = $(this)[0];
        selectedMarketIndex = market.id;
        setMarket(selectedMarketIndex);
        moonTicker();
        $(".market-ticker").removeClass("active");
        $(market).addClass("active");

    });

    $("#hodlings").on("change keyup paste", function() {
        updateHodlings(selectedMarket.getLatestPrice());
    })

    function setMarket(marketIndex) {
        return selectedMarket = markets[marketIndex];
    }

});