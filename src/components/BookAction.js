import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { actionCreators } from '../reducers/book';

const precisions = ['P0', 'P1', 'P2', 'P3'];

const BookAction = ({
  precision, changePrecision, zoomIn, zoomOut, zoom,
}) => (
  <>
    <div>
      {precisions.map(prec => (
        <button
          onClick={() => changePrecision(prec)}
          type="button"
          key={prec}
        >
          {prec}
        </button>
      ))}
      {' '}
      <b>Current Precision: {precision}</b>
    </div>
    <div>
      <b>Current Zoom: {zoom.toFixed(1)}X</b>
      {' '}
      <button onClick={zoomIn} type="button">
        Zoom In +
      </button>
      <button onClick={zoomOut} type="button">
        Zoom out -
      </button>
    </div>
  </>
);

BookAction.propTypes = {
  precision: PropTypes.string.isRequired,
  changePrecision: PropTypes.func.isRequired,
  zoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    zoom: state.book.zoom,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    zoomIn: () => dispatch(actionCreators.zoomIn()),
    zoomOut: () => dispatch(actionCreators.zoomOut()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookAction);
