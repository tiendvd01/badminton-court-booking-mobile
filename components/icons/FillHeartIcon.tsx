import React from 'react';
import Svg, { Path } from 'react-native-svg';

const FillHeartIcon = ({ size = 24, color = "black" }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path
      d="M8.444,27L24,42l15.556-15c2.7-2.033,4.444-5.256,4.444-8.889C44,11.978,39.022,7,32.889,7 
      C29.256,7,26.022,8.756,24,11.456C21.978,8.756,18.744,7,15.111,7C8.978,7,4,11.978,4,18.111
      C4,21.744,5.744,24.967,8.444,27z"
      fill={color}
    />
  </Svg>
);

export default FillHeartIcon;