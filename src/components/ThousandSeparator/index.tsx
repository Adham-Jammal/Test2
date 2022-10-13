/* eslint-disable */
import React from 'react';

const ThousandSeparator = ({ number, currency }: any) => {
  let num_parts = number.toString().split('.');
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (
    <>
      {' '}
      {num_parts.join('.')} {currency}{' '}
    </>
  );
};

export default ThousandSeparator;
