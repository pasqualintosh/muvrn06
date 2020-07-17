import React from "react";
import { findNodeHandle } from "react-native";
import { createStackNavigator, withNavigation } from "react-navigation";
import MapScreen from "../../MapScreen/MapScreen";
import Aux from "../../../helpers/Aux";
import Track from "../../Track/Track";
import Blur from "../../../components/Blur/Blur";

const TrackingStack = createStackNavigator(
  {
    Track: {
      screen: Track
    },
    Mappa: {
      screen: MapScreen
    }
  },
  {
    initialRouteName: "Track"
  }
);

// qui non c'e la notifica dei punti
class Tracking extends React.Component {
  // questa struttura si deve ripete per ogni tab della tabBar altrimenti il blur e la notifica non sono presenti
  constructor(props) {
    super(props);
    this.state = { viewRef: null, animate: false };
    // this.animation = setInterval(() => {
    //   this.animateCurve();
    // }, 1500);
  }
  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });
    // gestione lifecycle della navigazione per evitare che
    // un animazione ripetuta nel tempo venga processata
    // anche fuori da questa pagina
    this.subs = [
      this.props.navigation.addListener("willFocus", () => {
        // console.log("willfocus");
      }),
      this.props.navigation.addListener("willBlur", () => {
        // clearInterval(this.animation);
      }),
      this.props.navigation.addListener("didFocus", () => {
        // console.log("didfocus");
        // this.animation();
      }),
      this.props.navigation.addListener("didBlur", () => {})
    ];
  }
  // animateCurve = () => {
  //   this.setState({ animate: true });
  // };

  BackTrack = () => {
    this.props.navigation.navigate(this.props.navigation.state.params.keyBack);
  };
  render() {
    return (
      <Aux>
        <TrackingStack
          ref={view => {
            this.view = view;
          }}
          screenProps={{
            animate: this.state.animate,
            BackTrack: this.BackTrack
          }}
        />
        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}

export default withNavigation(Tracking);
