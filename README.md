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

```typescript
import wykop from "wykop-v2-typescript"

const wykop = new Wykop({
  appKey: string,
  appSecret: string,
  secure: boolean, // if set to true url will be prefixed with 'https', otherwise 'http'
  wykopUrl: string // base url for wykop (without trailing slash)
  }
  userkey: string // userkey uses for requests
)
```

## Default options

```javascript
{
  appKey: null,
  appSecret: null,
  secure: true,
  wykopUrl: a2.wykop.pl
}
userkey: undefined
```

## Request parameters

```typescript
wykop.request({
  methods: string[] // array with strings, will be parsed as string/string/
  ,
  namedParams: {
    [key: string]: string | number
  } // object with API parameters, will be parsed as key/value/key/value
  ,
  apiParams: string[] // array with strings, will be parsed as string/string/
  ,
  postParams: {
    [key: string]: string | number
  } // object will be send in body as key=value&key=value
})
```

## Example request (without logging user)

- Without async/await
```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

wykop.request({
  methods: ['Entries', 'Hot'],
  namedParams: { page: 1, period: 6 }
}).then((res) => {
  // Response from wykop
}).catch((error) => {
  // Only if something went wrong 😁
});
```

- With async/await

```javascript
// Dont forget to put this code in async function
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

try {
  const response = await wykop.request({
    methods: ['Entries', 'Hot'],
    namedParams: { page: 1, period: 6 }
  })
  // Your code here
} catch(err) {
  // Only if something went wrong 😁
}
```

## Example request (with userkey)

- Without async/await
```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

wykop.request({
  methods: ["Login","Index"],
  postParams: { login: "Vegann", accountkey: "Token from wykop connect" }
}).then(() => {
  // userkey will be stored in wykop.userkey you dont need to provide it once logged in
  return wykop.request({
    methods: ['Entries', 'Add'],
    postParams: { body: "Body" }
  })
}).then((res) => {
  // Response from wykop
}).catch((error) => {
  // Only if something went wrong 😁
});
```
- With async/await
```javascript
// Dont forget to put this code in async function
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

try {
  await wykop.request({
    methods: ["Login","Index"],
    postParams: {
      login: "Vegann",
      accountkey: "Token from wykop connect"
    }
  })
  // userkey will be stored in wykop.userkey you dont need to provide it once logged in
  const res = await wykop.request({
    methods: ['Entries', 'Add'],
    postParams: { body: "Body" }
  })
  // Response from wykop
} catch(err) {
  // Only if something went wrong 😁
}
```

## Getting link for Wykop connect

- Without redirect

```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

const { url } = wykop.wykopConnectLink();
```

Put `url` in `a` tag


- With redirect

```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

const { url, secure } = wykop.wykopConnectLink('http://localhost:8080');
```

1. After user logs in to Wykop will redirect be to `http://localhost:8080/?connectData=XXXXXXXXXX`

2. Then you can catch `XXXXXXXXXX` from url and decode user with:

```javascript
JSON.parse(atob('XXXXXXXXXX'))
```
3. Use `secure` for checking if correct user was returned
