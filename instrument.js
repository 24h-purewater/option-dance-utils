Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

//eg. format BTC-24SEP21-80000-P
export function getInstrumentName(
  deliveryType,
  optionType,
  quoteCurrency,
  baseCurrency,
  expiry,
  strike
) {
  let OT = optionType === "CALL" ? "C" : "P";
  let DT = deliveryType === "PHYSICAL" ? "P" : "C";
  if (optionType === "CALL") DT = "P"; //CALL option only support physical delivery
  let months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  let date = expiry.Format("d");
  let month = expiry.getMonth();
  let year = expiry.Format("yy");
  return `${DT}-${quoteCurrency}-${baseCurrency}-${date}${months[month]}${year}-${strike}-${OT}`;
}

// parse optiondance instrument name, eg. C-USDC-BTC-17JUN22-24000-P
export function parseInstrumentName(name) {
  let idxDeliveryType = 1;
  let idxQuoteCurrency = 2;
  let idxBaseCurrency = 3;
  let idxDay = 4;
  let idxMonth = 5;
  let idxYear = 6;
  let idxStrikePrice = 7;
  let idxOptionType = 8;

  let instrument = {};
  let monthMap = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12",
  };
  let reg =
    /^([CP])-(pUSD|USDC|USDT|BTC|ETH)-(BTC|XIN|ETH)-([\d]{1,2})(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)([\d]{2})-([\d]+)-([CP])$/;
  let match = name.match(reg);
  let day = match[idxDay];
  if (day.length === 1) {
    day = "0" + day;
  }
  let timeString = `20${match[idxYear]}-${
    monthMap[match[idxMonth]]
  }-${day}T16:00:00+08:00`;
  let expirationDate = new Date(timeString);
  let strikePrice = match[idxStrikePrice];
  let deliveryType = "";
  if (match[idxDeliveryType] === "P") {
    deliveryType = "PHYSICAL";
  }
  if (match[idxDeliveryType] === "C") {
    deliveryType = "CASH";
  }
  let optionType = "";
  if (match[idxOptionType] === "P") {
    optionType = "PUT";
  }
  if (match[idxOptionType] === "C") {
    optionType = "CALL";
  }
  if (match.length === 9) {
    instrument = {
      deliveryType: deliveryType,
      quoteCurrency: match[idxQuoteCurrency],
      baseCurrency: match[idxBaseCurrency],
      expirationDate: expirationDate,
      expirationTimestamp: expirationDate.getTime(),
      strikePrice: strikePrice,
      optionType: optionType,
    };
  }
  return instrument;
}
