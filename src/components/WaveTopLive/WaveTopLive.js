import * as React from "react"
import Svg, { Defs, Path } from "react-native-svg"

// function WaveTopLive(props) {
//     return (
//         <Svg viewBox="0 0 117.5 50" preserveAspectRatio="xMaxYMax slice"  {...props} >
//           <Path
//             d="M117.5 0H0c2 18.4 6.6 37.2 16.7 43.3 21.7 13.1 59.5 2.6 77.3-5.1 5.5-2.4 11.9-6.5 23.5-4V0z"
//             opacity={0.4}
//             fill="#6aba7e"
//             // scale={props.scale}
//           />
//         </Svg>
//       )
//     }

class WaveTopLive extends React.Component {
    render (props) {
    return (
      <Svg viewBox="0 0 300 50" preserveAspectRatio="xMaxYMax slice" {...this.props}>
        <Path
          d="M300 0H.6c18.2 13.3 72 49.1 124.7 48.6 64.7-.7 89.1-44.3 110.2-44.3s27.1 3.6 52.8 23.4c3.8 3 7.7 4.8 11.6 5.9V0z"
          opacity={0.4}
          fill={this.props.colors[0]}
        />
      </Svg>
    )
  }
}


  WaveTopLive.defaultProps = {
    colors: [`rgba(108, 186, 126, 1)`, `rgba(108, 186, 126, 0.4)`]
  };

export default WaveTopLive
