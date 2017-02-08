$(document).ready(function() {
  $( "#donation_trigger" ).click();

  var tronaldDump = ["PANIC SELLING!!!", "DUMPPP!", "SWSF'S FAULT", "BIGGER BLOCKS CENTRALIZATION", "Cheina. China. Jina. Shyna"];
  var hodlersBelike = ["hooodll", "hodloor", "To the mooooon", "$10K INCOMING!!!", "BITCOIN WILL UNITE US!"];
  var maximum = hodlersBelike.length;
  var currentMoon = null;
  

  function moonTicker() {
    $.ajax({
      dataType: "json",
      url: "https://api.bitfinex.com/v2/candles/trade:1h:tBTCUSD/last",
      success: mooningFunction
    });
  }

  function mooningFunction(data) {

  	var oldEarth = data[1];
  	currentMoon = data[2];

  	var hodlerStatus = currentMoon>=oldEarth;

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
  setInterval(moonTicker, 10 * 1000);


  //thread txCount request
  function txCountRequest() {
    $.ajax({
      dataType: "json",
      url: "https://cors-anywhere.herokuapp.com/https://blockchain.info/q/unconfirmedcount",
      success: mempoolAttack
    });
  }

  function mempoolAttack(data){
    var soMuchTxs = data;
    $('#tx-count').html(soMuchTxs);    
  }

  txCountRequest();
  setInterval(txCountRequest, 5 * 60 * 1000);


    //thread for fee request
  function feeRequest() {
    $.ajax({
      dataType: "json",
      url: "https://bitcoinfees.21.co/api/v1/fees/recommended",
      success: makeFeeGreatAgain
    });
  }

  function makeFeeGreatAgain(data){
      var fastestAvgFee = data.fastestFee;
      var fastestAvgFeePerTx = ((fastestAvgFee * 226)/100000000) * currentMoon; 
      $('#fastest-avg-fee').html("~$"+Number(fastestAvgFeePerTx).toFixed(3)+" USD");
    
  }

 feeRequest();
 setInterval(feeRequest, 10 * 1000);

});
