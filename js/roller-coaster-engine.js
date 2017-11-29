$(document).ready(function() {

    var tronaldDump = ["PANIC SELLING!!!", "DUMPPP!", "Bitcoin going to 0!! LOLOLOL", "SEGWIT POISON PILL", "Cheina. China. Jina. Shyna", "buy da dip", "Bitcoin up to 10% off", "Tronald DUMP!", "China ban. Ban china"];
    var hodlersBelike = ["hooodl", "hodloor", "To da mooooon", "$100K INCOMING!!!", "BITCOIN WILL UNITE US!", "Bye Dimon", "buckle up hodlers", "can't see any altcoin up here", "hey r/bitcoin, should I buy today?"];
    var meh = ["meh..", "mmm...", "meh", "C'mon... do something...", "no ban no fun", "meh", "no FUD, no fun", "mmm", "no dump, no pump"];
    var maximum = hodlersBelike.length;
    var currentMoon = null;
    var oldEarth = null;
    var toggleHoldingsInput = true;

    var markets = [new Bitstamp(), new Bitfinex()];
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
        var fiatHodlingsAmount = $('#hodler-hodlings').val();
        var hodlingsAmount = $('#hodlings').val();
        if (toggleHoldingsInput) {
            if (hodlingsAmount != undefined && hodlingsAmount != 0) {
                $('#hodler-hodlings').val((close * hodlingsAmount).toFixed(2));
            } else {
                $('#hodler-hodlings').html('');
            }
        } else {
            if (fiatHodlingsAmount != undefined && fiatHodlingsAmount != 0) {
                $('#hodlings').val((fiatHodlingsAmount / close).toFixed(4));
            } else {
                $('#hodlings').html('');
            }
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
        var angle = (Math.atan2(close - open, 20) * 180 / Math.PI);
        var randomNumber = getRandom(maximum);
        var rollerCoasterStatus = "";
        var changeAbs = Math.abs((currentMoon / oldEarth) - 1).toFixed(3);
        var changeTreshold = 0.008;
        
        if(close>=10000){
            $('body').css('background-image', 'url(images/moon.gif');
        }else{
            $('body').css('background-image', 'url(images/what-if-its-a-space-rollercoaster.jpg');
        }
        
        if (changeAbs >= changeTreshold) {
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
        $('#fastest-avg-fee').html("~" + fastestAvgFee + " sat/B");
        $('#fastest-avg-fee-fiat').html("$ " + Number(fastestAvgFeePerTx).toFixed(3));

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
        toggleHoldingsInput = true;
        updateHodlings(selectedMarket.getLatestPrice());
    });

    $("#hodler-hodlings").on("change keyup paste", function() {
        toggleHoldingsInput = false;
        updateHodlings(selectedMarket.getLatestPrice());
    });

    function setMarket(marketIndex) {
        return selectedMarket = markets[marketIndex];
    }

});
