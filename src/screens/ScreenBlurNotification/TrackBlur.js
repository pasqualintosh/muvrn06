import React from "react";
import { Text, Platform, findNodeHandle, View, Alert } from "react-native";

import Aux from "../../helpers/Aux";

import Blur from "../../components/Blur/Blur";

import Track from "../Track/Track";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import DeviceInfo from "react-native-device-info";
import BackgroundGeolocation from "./../../helpers/geolocation";
import { connect } from "react-redux";
import {
  getTutorialLiveState,
} from "../../domains/login/Selectors";
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

  alertModal = () => {
    this.props.navigation.setParams({ IconLive: <View/> })
    this.props.dispatch(completeTutorial("tutorialLive"));
    const systemName = DeviceInfo.getSystemName();
      const systemVersion = DeviceInfo.getSystemVersion();
      const model = DeviceInfo.getModel();
      const manufacturer = DeviceInfo.getManufacturer();
      const deviceId = DeviceInfo.getDeviceId();

      console.log(model);
      console.log(manufacturer);

      // controllo se è un telefono android huawei o honor e in caso
      // do un alert per spiegare di disabilitare il controllo sul consumo della batteria
      if (
        manufacturer === "HUAWEI" ||
        manufacturer === "HONOR" ||
        model === "HUAWEI" ||
        model === "HONOR"
      
      ) {
        Alert.alert(
          strings('the_system_prev'),
          strings('hey__to_use_muv'),
          [
            {
              text: strings("yes"),
              onPress: () =>
                Platform.OS !== "ios"
                  ? Platform.Version < 23
                    ? BackgroundGeolocation.showLocationSettings()
                    : BackgroundGeolocation.showAppSettings()
                  : BackgroundGeolocation.showAppSettings()
            },
            {
              text: strings("no"),
              onPress: () => alert(strings('muv_may_not_wor')),
              style: "cancel"
            }
          ]
        );
      } else if (
        (manufacturer === "OnePlus" || model === "OnePlus") &&
        parseInt(systemVersion) > 8
      ) {
        Alert.alert(
          strings('the_system_prev'),
          strings('_1006_hey__to_use_muv'),
          [
            {
              text: 'OK', 
              onPress: () => {}
             
            }
          ]
        );
      } 

  }
  componentDidMount() {
    // quando ho caricato il componente, posso dire a blur che è possibile fare il blur usando questa variabile
    this.setState({ viewRef: findNodeHandle(this.view) });

    if (!this.props.tutorialLive) {
      
      const systemName = DeviceInfo.getSystemName();
      const systemVersion = DeviceInfo.getSystemVersion();
      const model = DeviceInfo.getModel();
      const manufacturer = DeviceInfo.getManufacturer();
      const deviceId = DeviceInfo.getDeviceId();

      console.log(model);
      console.log(manufacturer);

      // controllo se è un telefono android huawei o honor e in caso
      // do un alert per spiegare di disabilitare il controllo sul consumo della batteria
      if (
        manufacturer === "HUAWEI" ||
        manufacturer === "HONOR" ||
        model === "HUAWEI" ||
        model === "HONOR" ||  ((manufacturer === "OnePlus" || model === "OnePlus") &&
        parseInt(systemVersion) > 8
      )
      ) {
        this.props.navigation.setParams({ IconLive:  <View  style={{ flexDirection: "row", top: 2,
        alignContent: "center",
        justifyContent: "center"}}><OwnIcon
          name="esclamation_point_icn"
          size={26}
          color={"#FC6754"}
          click={() => this.alertModal()}
          style={{ position: "relative", left: 13 }}
        /><OwnIcon
          name="esclamation_point__triangle_icn"
          size={26}
          color={"#3d3d3d"}
          click={() => this.alertModal()}
          style={{ position: "relative", left: -13 }}
        /></View> })     
      } else {
        this.props.dispatch(completeTutorial("tutorialLive"));
      }
    }

    


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

  static navigationOptions = ({ navigation }) => {
    // const { BackTrack } = navigation.state.params;
    console.log(navigation)

    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {" "}
          Live tracking{" "}
        </Text>
      ),
      headerRight:  navigation.getParam('IconLive',<View/>)
    };
  };

  render() {
    return (
      <Aux>
        <Track
          ref={view => {
            this.view = view;
          }}
          navigation={this.props.navigation}
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

const tutorial = connect((state, props) => {


  return {
   
    tutorialLive: getTutorialLiveState(state)
  };
});

export default tutorial(TrackBlur);
