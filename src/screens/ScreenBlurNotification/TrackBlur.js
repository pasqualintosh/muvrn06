import React from "react";
import { Text, Platform, findNodeHandle, View, Alert } from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";

import Track from "../Track/Track";
import TrackAuto from "../TrackAuto/TrackAuto";



import { connect } from "react-redux";
import { getTutorialLiveState } from "../../domains/login/Selectors";
import { completeTutorial } from "../../domains/login/ActionCreators.js";
import { strings } from "../../config/i18n";

class TrackBlur extends React.Component {
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

    

  }
 

  BackTrack = () => {
    this.props.navigation.navigate(this.props.navigation.state.params.keyBack);
  };

  static navigationOptions = ({ navigation }) => {
    // const { BackTrack } = navigation.state.params;
    console.log(navigation);

    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0,
          }}
        >
          {strings("id_1_02")}
        </Text>
      ),
      headerRight: navigation.getParam("IconLive", <View />),
    };
  };

  render() {
    return (
      <Aux>
        <TrackAuto
          ref={(view) => {
            this.view = view;
          }}
          navigation={this.props.navigation}
          screenProps={{
            animate: this.state.animate,
            BackTrack: this.BackTrack,
          }}
         
        />

        <Blur viewRef={this.state.viewRef} />
      </Aux>
    );
  }
}


export default TrackBlur;
