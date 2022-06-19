# option-dance-utils

## Installation

use npm
```
npm install @optiondance/utils
```

use yarn
```
yarn add @optiondance/utils
```


## Quick start
### parseInstrumentName

```
import {parseInstrumentName} from '@optiondance/utils/instrument';

let instrument = parseInstrumentName('C-USDC-BTC-20MAY22-25000-P');

/*
instrument = {
    "deliveryType": "CASH",
    "quoteCurrency": "USDC",
    "baseCurrency": "BTC",
    "expirationDate": "2022-05-20T08:00:00.000Z",
    "expirationTimestamp": 1653033600000,
    "strikePrice": "25000",
    "optionType": "PUT"
}*/
```
