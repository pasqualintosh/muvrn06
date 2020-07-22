// componente per visualizzare lo sponsor del torneo

import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Platform,
  ImageBackground,
  Linking,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";

import { strings } from "../../config/i18n";

import LinearGradient from "react-native-linear-gradient";
import Aux from "./../../helpers/Aux";
import { styles } from "./Style";

class SponsorInfoTournament extends React.PureComponent {
  //  {/* +"!\n" */}

  detailSponsor = () => {
    this.props.navigation.navigate("DetailSponsorTournamentScreenBlur");
  };
  render() {
    return (
      <View>
        <ImageBackground
          source={require("../../assets/images/wave/sponsor_info_wave_bg.png")}
          style={styles.backgroundImage}
        />
        <ImageBackground
          source={require("../../assets/images/sponsor_logo_muv.png")}
          style={{
            height: 45,
            width: 100,
            left: Dimensions.get("window").width * 0.1,
            position: "absolute",
            top: 45
          }}
        />

        <View style={styles.sponsorContainer}>
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              alignSelf: "center"
            }}
          >
            <Text>
              <Text
                style={{
                  fontFamily: "Montserrat-ExtraBold",
                  marginVertical: 5,
                  color: "#3D3D3D",
                  fontSize: 15,
                  textAlign: "left"
                }}
              >
                {"MUV "}
              </Text>
              <Text
                style={{
                  fontFamily: "OpenSans-Bold",
                  marginVertical: 5,
                  color: "#3D3D3D",
                  fontSize: 13,
                  textAlign: "left"
                }}
              >
                {
                  "is a 100% natural paint that, thanks to its innovative technology, eliminates bacteria, prevents the growth of mold and reduces air pollution bringing air back to purity."
                }
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default SponsorInfoTournament;
