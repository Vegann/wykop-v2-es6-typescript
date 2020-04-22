# wykop-v2-typescript (WIP)
[![Maintainability](https://api.codeclimate.com/v1/badges/e60b7a455b4fdacaa44c/maintainability)](https://codeclimate.com/github/Vegann/wykop-v2-typescript/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e60b7a455b4fdacaa44c/test_coverage)](https://codeclimate.com/github/Vegann/wykop-v2-typescript/test_coverage)
![Node.js CI](https://github.com/Vegann/wykop-v2-typescript/workflows/Node.js%20CI/badge.svg)
[![dependencies Status](https://david-dm.org/Vegann/wykop-v2-typescript/status.svg)](https://david-dm.org/Vegann/wykop-v2-typescript)


### Simple, minimal wrapper for shitty wykop api v2

## Instalation

coming soon

## Wykop Api v2 documentation

https://www.wykop.pl/dla-programistow/apiv2/


## Initialization

```javascript
import wykop from "wykop-v2-typescript"


const wykop = new Wykop({
  appKey: string,
  appSecret: string,
  secure: boolean, // if set to true url will be prefixed with 'https', otherwise 'http'
  wykopUrl: string // base url for wykop (without trailing slash)
})
```

## Default options

```javascript
{
  appKey: null,
  appSecret: null,
  secure: true,
  wykopUrl: a2.wykop.pl
}
```

## Request parameters

```javascript
wykop.request(
  // array with strings, will be parsed as string/string/
  ,
  // object with API parameters, will be parsed as key/value/key/value
  ,
  // object will be parsed as POST parameters key=value&key=value
)
```

## Example request (without logging user)

- Without async/await
```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad', appSecret: 'sdakdsajd'
});

wykop.request(
  ['Entries', 'Hot'],
  { page: 1, period: 6 }
).then((res) => {
  // Response from wykop
}).catch((error) => {
  // Only if something went wrong 😁
});
```

- With async/await

```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad', appSecret: 'sdakdsajd'
});
try {
  const response = wykop.request(
  ['Entries', 'Hot'],
  { page: 1, period: 6 }
)
  // Your code here
} catch(err) {
  // Only if something went wrong 😁
}
```

## Getting link for Wykop connect

- Without redirect

```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad', appSecret: 'sdakdsajd'
});

const link = wykop.wykopConnectLink();

```
Put this link in `a` tag

- With redirect

```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad', appSecret: 'sdakdsajd'
});

const link = wykop.wykopConnectLink('http://localhost:8080');
```

When user logs in Wykop will redirect they to `http://localhost:8080/?connectData=XXXXXXXXXX`

Then you can catch `XXXXXXXXXX` from url and decode user with:

```javascript
JSON.parse(atob('XXXXXXXXXX'))
```

TODO:

- [ ] complete README with real-life examples
- [ ] add parsing postParams when the user tries to add a new entry
