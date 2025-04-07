import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BackIcon = ({ size = 24, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19M5 12L9 16M5 12L9 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BackIcon;
