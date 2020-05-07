# wykop-v2-typescript
[![npm version](https://badge.fury.io/js/wykop-v2-typescript.svg)](https://badge.fury.io/js/wykop-v2-typescript)
[![Maintainability](https://api.codeclimate.com/v1/badges/e60b7a455b4fdacaa44c/maintainability)](https://codeclimate.com/github/Vegann/wykop-v2-typescript/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e60b7a455b4fdacaa44c/test_coverage)](https://codeclimate.com/github/Vegann/wykop-v2-typescript/test_coverage)
![Node.js CI](https://github.com/Vegann/wykop-v2-typescript/workflows/Node.js%20CI/badge.svg)
[![dependencies Status](https://david-dm.org/Vegann/wykop-v2-typescript/status.svg)](https://david-dm.org/Vegann/wykop-v2-typescript)

[Read in English](./README.en.md)

### Prosty wrapper dla gównianego API v2 Wykopu

## Instalacja

`yarn add wykop-v2-typescript`  
lub  
`npm install wykop-v2-typescript`

## Dokumentacja API v2

https://www.wykop.pl/dla-programistow/apiv2/


## Inicializacja

```typescript
import wykop from "wykop-v2-typescript"

const wykop = new Wykop({
  appKey: string,
  appSecret: string,
  secure: boolean, // Jeżeli ustawione na 'true' url będzie prefixowane 'https', w przeciwnym wypadku 'http'
  wykopUrl: string // Url api (bez końcowego slasha)
  }
  userkey: string // userkey użytkownika
)
```

## Opcje domyślne

```javascript
{
  appKey: null,
  appSecret: null,
  secure: true,
  wykopUrl: a2.wykop.pl
}
userkey: undefined
```

## Parametry metody `request`

```typescript
wykop.request({
  methods: string[] // Arrayka stringów, zostanie przeparsowana na string/string/
  ,
  namedParams: {
    [key: string]: string | number
  } // Objekt z parametrami, będzie przeparsowany na key/value/key/value
  ,
  apiParams: string[] // Arayka stringów zostanie przeparsowana na string/string/
  ,
  postParams: {
    [key: string]: string | number
  } // Objekt, będzie wysłany w body jako key=value&key=value
})
```

## Przykładowe użycie (bez logowania użytkownika)

- Bez async/await
```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

wykop.request({
  methods: ['Entries', 'Hot'],
  namedParams: { page: 1, period: 6 }
}).then((res) => {
  // Odpowiedź z Wykopu
}).catch((error) => {
  // Jeżeli coś pójdzie nie tak 😁
});
```

- Z async/await

```javascript
// Nie zapomnij żeby umieścić ten kod w asyncowej funkcji
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

try {
  const response = await wykop.request({
    methods: ['Entries', 'Hot'],
    namedParams: { page: 1, period: 6 }
  })
  // Tu możesz zrobić coś z responsem
} catch(err) {
  // Jeżeli coś pójdzie nie tak 😁
}
```

## Przykładowe użycie (z userkey)

- Bez async/await
```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

wykop.request({
  methods: ["Login","Index"],
  postParams: { login: "Vegann", accountkey: "Token from wykop connect" }
}).then(() => {
  // userkey zostanie przechowane w wykop.userkey i użyte przy następnym zapytaniu, nie musisz go podawać po zalogowaniu
  return wykop.request({
    methods: ['Entries', 'Add'],
    postParams: { body: "Body" }
  })
}).then((res) => {
  // Odpowiedź z Wykopu
}).catch((error) => {
  // Jeżeli coś pójdzie nie tak 😁
});
```
- Z async/await
```javascript
// Nie zapomnij wstawić tego w funkcje asynkową
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
  // userkey zostanie przechowane w wykop.userkey, nie musisz go podawać po zalogowaniu
  const res = await wykop.request({
    methods: ['Entries', 'Add'],
    postParams: { body: "Body" }
  })
  // Odpowiedź z Wykop
} catch(err) {
  // Jeżli coś pójdzie nie tak 😁
}
```

## Link do Wykop Connect

- Bez przekierowania

```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

const { url } = wykop.wykopConnectLink();
```

1. Umieść `url` w tagu `a`


- Z przekierowaniem

```javascript
const wykop = new Wykop({
   appKey: 'asdnasdnad',
   appSecret: 'sdakdsajd'
});

const { url, secure } = wykop.wykopConnectLink('http://localhost:8080');
```

1. Po zalogowaniu użytkownik zostanie przekierowany na `http://localhost:8080/?connectData=XXXXXXXXXX`

2. Możesz złapać `XXXXXXXXXX` z urla i zdekodować użytkownika przy pomocy:

```javascript
JSON.parse(atob('XXXXXXXXXX'))
```
3. Użyj `secure` żeby sprawdić przy poprawny użytkownik został zwrócony
