# Beachfinex

`Tired of trading? Come to Thailand and trade Bitfinex on the beach.`

Order Book, Ticker and Trades are implemented according to the challenge and Bitfinex's corresponding widgets. Precision and depth bars scale on order book can be changed (UX can be improved). WebSocket connection controls are handled separately in each container (Book, Ticker, Trades). The market is fixed to tBTCUSD pair.

## Up and Running
  ```
  yarn
  yarn start
  ```

## Can Be Improved
1. Performance optimization for better framerates.
1. Higher order component to reduce repeated WebSocket code in Book, Trades and Ticker containers.
1. Better UX for order book actions.
1. Better loading indicator.

## Libs
1. React & Redux
1. Immutable
1. BigNumber.js
1. day.js
1. styled-components

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
