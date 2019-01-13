# Beachfinex

> Tired of trading ? Come to Thailand and trade Bitfinex on the beach.

Order Book, Ticker and Trades are implemented according to the challenge and Bitfinex's corresponding widgets. Precision and depth bars scale on order book can be changed (UX can be improved). WebSocket connection controls are handled separately in each container (Book, Ticker, Trades). The market is fixed to tBTCUSD pair.

*I personally wanted to do refactoring after the challenge is finished, so please only inspect the 8 hrs result on `master` branch, not `refactor` branch.*

## Up and Running
  ```
  yarn
  yarn start
  ```
## Defects
1. **(Critical defect. Fixed but overtime)** Unsorted order book on update action.
1. Daily change in percentage is wrongly displayed (must be multiplied by 100).
1. First depth bar's width sometime gets too small and is calculated to 0. So scaling has no effect on it (scale * 0 = 0).

## Can Be Improved
1. Performance optimization on Order Book (Implemented for ease of inspection).
1. Higher order component to recycle repeated WebSocket code in Book, Trades and Ticker containers.
1. Move `subscribing`, `subscribed` states of Book, Trades to its corresponding reducer.
1. Recyclable action rows and better UX for order book actions UI.
1. Recyclable styled components.
1. Better component separation and encapsulation (e.g. more clarity on props passed to BookRow).
1. Better loading state and indicator.
1. Cleaner HTML and decision tree code.
1. Remove unused redux middleware (thunk).
1. Unit tests on all reducers. Some snapshot tests on components and containers using Enzyme.

## Libs
1. React & Redux
1. Immutable (List, Map)
1. BigNumber.js
1. day.js
1. styled-components

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
