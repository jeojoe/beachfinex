# Beachfinex

`Tired of trading? Come to Thailand and trade Bitfinex on the beach.`

Order Book, Ticker and Trades are implemented according to the challenge and Bitfinex's corresponding widgets. Precision and depth bars scale on Order Book can be changed (UX can be improved). WebSocket connection controls are handled separately in each container (Order Book, Ticker, Trades). The market is fixed to tBTCUSD pair.

## Can be improved
1. Performance Optimization
1. Higher Order Component to reduce repeated WebSocket code in Book, Trades and Ticker containers.
1. Better UX for Order Book actions
1. Better Loading Indicator

## Libs
1. React & Redux
1. Immutable
1. BigNumber.js
1. day.js
1. styled-components

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
