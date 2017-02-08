$(document).ready(function() {
  $( "#donation_trigger" ).click();

  var tronaldDump = ["PANIC SELLING!!!", "DUMPPP!", "SWSF'S FAULT", "BIGGER BLOCKS CENTRALIZATIOON"];
  var hodlersBelike = ["hooodll", "hodloor", "To the mooooon ", "$10K INCOMING"];
  var maximum = hodlersBelike.length;
  
  

  function moonTicker() {
    var timeStamp = ((Date.now() / 1000) | 0);
    $.ajax({
      dataType: "json",
      url: "https://api.bitfinex.com/v2/candles/trade:30m:tBTCUSD/last",
      success: mooningFunction
    });
  }

  function mooningFunction(data) {

  	var oldEarth = data[1];
  	var currentMoon = data[2];

  	var hodlerStatus = currentMoon>oldEarth;

    var randomDump = getRandom(maximum);
    var randomPump = getRandom(maximum);

    var rollerCoasterStatus = hodlerStatus ? hodlersBelike[randomPump] : tronaldDump[randomDump];
    $('#current-moon').html('$'+currentMoon+" USD");


    document.title = '('+Number(currentMoon).toFixed(1)+')' + " Bitcoin Roller Coaster Guy";

    rBitcoin_or_rBtc(hodlerStatus);

    $('#roller-coaster-status').html(rollerCoasterStatus);
  }

  function rBitcoin_or_rBtc(hodlerStatus){
    if(hodlerStatus){
      $('#roller-coaster-guy').removeClass("here-we-go");
      $('.panel').removeClass("panel-danger").addClass("panel-success");
      $('.label').removeClass("label-danger").addClass("label-success");
    }else {
      $('#roller-coaster-guy').addClass("here-we-go");
      $('.panel').removeClass("panel-success").addClass("panel-danger");
      $('.label').removeClass("label-success").addClass("label-danger");
    }
    return;
  }

  function getRandom(max) {
    return Math.round(Math.random()*max);
  }


  moonTicker();
  setInterval(moonTicker, 6 * 1000);
});
