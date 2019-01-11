import styled from 'styled-components';

const HeaderRow = styled.div`
  display: flex;
  padding: 0 5px;
  & p {
    color: #fff;
    font-weight: bold;
    font-size: 12px;
    flex: 25%;
    margin: 0 0 3px;
    text-align: ${props => (props.side === 'bids' ? 'right' : 'left')};
    &.count {
      flex: 15%;
    }
    &.price {
      flex: 35%;
    }
  }
`;

export default HeaderRow;
