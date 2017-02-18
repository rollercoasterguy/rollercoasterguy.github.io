class Market {
    constructor() {
        this.apiAdrress = "";
        this.priceInfo = "";
        this.id = null;
    }
    getAdrress() {
        return this.apiAdrress;
    }
    fetchPrices(fctn) {}

    getPriceInfo() {
        return this.priceInfo;
    }

    getId() {
        return this.id;
    }
}

class Bitfinex extends Market {

    constructor() {
        super();
        this.apiAdrress = "https://api.bitfinex.com/v2/candles/trade:15m:tBTCUSD/hist?limit=96";
        this.priceInfo = "Based on Bitfinex 24h timeframe";
        this.id = 0;
    }


    fetchPrices(fctn) {
        var id = this.id;
        $.ajax({
            dataType: "json",
            url: this.getAdrress(),
            success: function(data) {
                fctn(data[95][1], data[0][2], id);
            }
        });
    }

}

class Bitstamp extends Market {

    constructor() {
        super();
        this.apiAdrress = "https://www.bitstamp.net/api/v2/ticker/btcusd/";
        this.priceInfo = "Based on Bistamp daily performance";
        this.id = 1;
    }


    fetchPrices(fctn) {
        var id = this.id;
        $.ajax({
            dataType: "json",
            url: this.getAdrress(),
            success: function(data) {
                fctn(data["open"], data["last"], id);
            }
        });
    }

}