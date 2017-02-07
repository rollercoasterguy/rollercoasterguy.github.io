$(document).ready(function() {
  $( "#donation_trigger" ).click();
  

  function moonTicker() {
    var timeStamp = ((Date.now() / 1000) | 0);
    $.ajax({
      dataType: "json",
      url: "https://www.bitstamp.net/api/v2/ticker_hour/btcusd/",
      success: mooningFunction
    });
  }

  function mooningFunction(data) {
  	//var tickerDataArray = data['result']['3600'];
  	//var lastTickerData = tickerDataArray[tickerDataArray.length-1];

  	var oldEarth = data.open;
  	var currentMoon = data.last;

  	var hodlerStatus = currentMoon>oldEarth;

    var rollerCoasterStatus = hodlerStatus ? "To the mooooon " : "PANIC SELLING!!! ";
    $('#current-moon').html('$'+currentMoon+" USD");
    document.title = '('+Number(currentMoon).toFixed(1)+')' + " Bitcoin Roller Coaster Guy";

    rBitcoin_or_rBtc(hodlerStatus);

    $('#roller-coaster-status').html(rollerCoasterStatus);
  }

  function rBitcoin_or_rBtc(hodlerStatus){
    if(hodlerStatus){
      $('#roller-coaster-guy').addClass("here-we-go");
      $('.panel').removeClass("panel-danger").addClass("panel-success");
      $('.label').removeClass("label-danger").addClass("label-success");
    }else {
      $('#roller-coaster-guy').removeClass("here-we-go");
      $('.panel').removeClass("panel-success").addClass("panel-danger");
      $('.label').removeClass("label-success").addClass("label-danger");
    }
    return;
  }

  moonTicker();
  setInterval(moonTicker, 8 * 1000);
});
