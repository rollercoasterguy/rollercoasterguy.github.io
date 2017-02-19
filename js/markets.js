class Market {
    constructor() {
        this.apiAdrress = "";
        this.priceInfo = "";
        this.id = null;
        this.openPrice = 0;
        this.latestPrice = 0;
    }
    getAdrress() {
        return this.apiAdrress;
    }

    fetchPrices(fctn) {}

    runWebsocketTicker(updateTicker) {

    }

    getPriceInfo() {
        return this.priceInfo;
    }

    getId() {
        return this.id;
    }

    getLatestPrice() {
        return this.latestPrice;
    }

    setLatestPrice(v) {
        this.latestPrice = v;
    }

    getOpenPrice() {
        return this.openPrice;
    }

    setOpenPrice(v) {
        this.openPrice = v;
    }
}

class Bitfinex extends Market {

    constructor() {
        super();
        this.apiAdrress = "https://api.bitfinex.com/v2/candles/trade:5m:tBTCUSD/hist?limit=288";
        this.priceInfo = "Based on Bitfinex 24h timeframe";
        this.id = 0;
    }

    runWebsocketTicker(updateTicker) {

        const w = new WebSocket('wss://api.bitfinex.com/ws/2');
        var _this = this;
        w.onmessage = function(event) {
            var msgData = JSON.parse(event.data);
            if (msgData instanceof Array) {
                var latestPrice = msgData[1][6];
                if (latestPrice != undefined) {
                    _this.setLatestPrice(latestPrice);
                    updateTicker(_this.getOpenPrice(), latestPrice, _this.getId());
                }
            }
        };

        let msg = JSON.stringify({
            event: 'subscribe',
            channel: 'ticker',
            symbol: 'tBTCUSD'
        })

        w.onopen = function() {
            w.send(msg);
        };

    }

    fetchPrices(fctn) {
        var _this = this;
        $.ajax({
            dataType: "json",
            url: this.getAdrress(),
            success: function(data) {
                _this.setOpenPrice(data[287][1]);
                _this.setLatestPrice(data[0][2]);
                fctn(_this.getOpenPrice(), _this.getLatestPrice(), _this.id);
            }
        });
    }

}

class Bitstamp extends Market {

    constructor() {
        super();
        this.apiAdrress = "https://www.bitstamp.net/api/ticker";
        this.priceInfo = "Based on Bistamp daily performance";
        this.id = 1;
    }

    runWebsocketTicker(updateTicker) {

        var pusher = new Pusher('de504dc5763aeef9ff52'),
            tradesChannel = pusher.subscribe('live_trades');

        var _this = this;
        tradesChannel.bind('trade', function(data) {
            _this.setLatestPrice(data.price);
            updateTicker(_this.getOpenPrice(), data.price, _this.getId());

        });

    }

    fetchPrices(fctn) {
        var _this = this;
        $.ajax({
            dataType: "json",
            url: this.getAdrress(),
            success: function(data) {
                _this.setOpenPrice(data["open"]);
                _this.setLatestPrice(data["last"]);
                fctn(_this.getOpenPrice(), _this.getLatestPrice(), _this.getId());
            }
        });
    }

}