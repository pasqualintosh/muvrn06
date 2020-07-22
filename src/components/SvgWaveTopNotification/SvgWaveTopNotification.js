import * as React from "react"
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

class SvgWaveTopNotification extends React.Component {
  render (props) {
  return (
    <Svg width={476} height={25} viewBox="0 0 476 25"  preserveAspectRatio="xMaxYMax slice" {...props}>
      <Defs>
        <ClipPath id="prefix__a">
          <Path d="M0 0h476v25H0z" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#prefix__a)">
        <G
          transform="translate(.004 .001)"
          filter="url(#prefix__b)"
          data-name="Group 7105"
        >
          <Path
          fill={this.props.color}
            data-name="Path 5905"
            d="M-2.739 153.822c5.785 24.635 86.08-3.283 130.368-3.671s57.477 14.959 84.645 14.661 53.555-15.586 107-14.661 72.47 18.693 102.565 18.094 53.693-14.423 53.693-14.423l11.333-134.484s9.514-15.391-11.333-11.84S285.48 4.111 244.523 3.811c-40.507-.3-84.1 5.667-159.473 5.939S6.277 5.656-24.736 3.811-9.19 130.384-9.089 133.029s.564-3.84 6.35 20.793z"
          />
        </G>
      </G>
    </Svg>
  )
}
}

export default SvgWaveTopNotification
