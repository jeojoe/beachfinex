import React from 'react';
import styled from 'styled-components';

import Ticker from './Ticker';
import Book from './Book';
import Trades from './Trades';

import beach from '../images/beach.jpg';

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background-position: bottom;
  background-size: cover;
  background-image: url('${beach}');
  overflow-y: scroll;
  padding: 15px 3% 0;
`;

const BlackBox = styled.div`
  background-color: rgba(0,0,0,0.5);
  border-radius: 5px;
  padding: 10px;
  overflow-y: scroll;
  margin-bottom: 15px;
`;

const Header = styled.h1`
  font-family: 'Shrikhand', cursive;
  color: #fff;
  text-shadow: -3px 0 #000, 0 3px #000, 3px 0 #000, 0 -3px #000;
  margin: 0;
`;

const App = () => (
  <Background>
    <Header>Beachfinex</Header>
    <BlackBox>
      <Ticker />
    </BlackBox>
    <div className="row">
      <div className="col-2">
        <BlackBox>
          <Book />
        </BlackBox>
      </div>
      <div className="col-1">
        <BlackBox>
          <Trades />
        </BlackBox>
      </div>
    </div>
  </Background>
);

export default App;
