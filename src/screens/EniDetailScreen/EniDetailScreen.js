import React from "react";
import {
  Text,
  Dimensions,
  Platform,
  View,
  ScrollView,
  ImageBackground,
  Image
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { getMostFrequentRoute } from "./../../domains/login/ActionCreators";
import CityScreenCards from "./..//CityScreenCards/CityScreenCards";
import CO2Wave from "../../components/CO2Wave/CO2Wave";
import { strings } from "../../config/i18n";

class EniDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_8_01")}
        </Text>
      )
    };
  };

  componentWillMount() {
    // this.props.dispatch(getStats());
  }

  renderCo2Section() {
    return (
      <View>
        <View
          style={{
            backgroundColor: "#8EC99C",
            width: Dimensions.get("window").width,
            height: 125,
            top: 55,
            justifyContent: "flex-end",
            alignItems: "flex-start",
            position: "absolute"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              justifyContent: "flex-end",
              alignItems: "flex-start",
              position: "absolute",
              alignSelf: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#FFFFFF",
                fontSize: 13
              }}
            >
              {strings("id_8_07")}
            </Text>
          </View>
        </View>
        <ImageBackground
          source={require("../../assets/images/light_green_wave_bottom.png")}
          style={{
            height: 35,
            width: Dimensions.get("window").width,
            top: 178,
            position: "absolute"
          }}
        />
        <View
          style={{
            backgroundColor: "#6CBA7E",
            width: Dimensions.get("window").width,
            height: 70,
            top: -25,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-ExtraBold",
                color: "#fff",
                fontSize: 19,
                textAlign: "left"
              }}
            >
              {strings("id_8_02").toLocaleUpperCase()}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            top: -25,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#6CBA7E"
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: Dimensions.get("window").width * 0.6,
                height: 40,
                alignItems: "flex-start",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontFamily: "OpenSans-Regular",
                  fontWeight: "400",
                  color: "#FFFFFF",
                  fontSize: 13
                }}
              >
                {strings("id_8_03")}
              </Text>
            </View>

            <View
              style={{
                width: Dimensions.get("window").width * 0.2,
                height: 40,
                alignItems: "flex-end",
                justifyContent: "center"
              }}
            >
              <Image
                source={require("../../assets/images/puntini.gif")}
                style={{
                  height: 25 * 0.4,
                  width: 40 * 0.4
                }}
              />
            </View>
          </View>

          {/* <View style={{ width: 30, height: 30, backgroundColor: "#e33" }} /> */}
        </View>
        <ImageBackground
          source={require("../../assets/images/green_on_light_green_wave.png")}
          style={{
            height: 35,
            width: Dimensions.get("window").width,
            top: -25
          }}
        />

        {/* <View style={{ width: 30, height: 30, backgroundColor: "#e33" }} /> */}
      </View>
    );
  }

  render() {
    // const city = this.props.navigation.getParam("city", 6);
    // const cityName = this.props.navigation.getParam("cityName", "palermo");
    // const city_id = this.props.navigation.getParam("cityId", 0);
    const city = 19;
    const cityName = "Eni";
    const city_id = 19;

    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "transparent"
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 1.0]}
          colors={["#6C6C6C", "#3D3D3D"]}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
        >
          <ScrollView
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height
            }}
            showsVerticalScrollIndicator={false}
            ref={ref => (this.ref = ref)}
          >
            <View
              style={{
                width: Dimensions.get("window").width,
                height: 150,
                position: "absolute",
                top: Dimensions.get("window").height * 0.55 - 150 + 10,
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <ImageBackground
                source={require("../../assets/images/wave/green_wave_top.png")}
                style={{ height: 35, width: Dimensions.get("window").width }}
              />
              <View
                style={{
                  backgroundColor: "#6CBA7E",
                  width: Dimensions.get("window").width,
                  height: 115
                }}
              ></View>
            </View>
            <CityScreenCards
              city={cityName.toUpperCase()}
              cityId={city}
              city_id={city_id}
            />

            {this.renderCo2Section()}

            <View
              style={{
                height: 200,
                backgroundColor: "transparent"
              }}
            />
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}

export default EniDetailScreen;
