import React from "react";
import {
  View,
  Text as TextReact,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import Geocoder from "./../../components/Geocoder/Geocoder";
import { images } from "./../../components/InfoUserHome/InfoUserHome";
import { strings } from "../../config/i18n";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import pointsDecimal from "./../../helpers/pointsDecimal";

class ProfileScreenCardsFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city_name: "",
      total_points: 0
    };
  }

  componentWillMount() {
    try {
      console.log(this.props.loginState.mostFrequentRoute[0].end_point);

      Geocoder.init("AIzaSyC3cg3CWrVwdNa1ULzzlxZ-gy-4gCp080M");
      Geocoder.from({
        latitude: this.props.loginState.mostFrequentRoute[0].end_point.latitude,
        longitude: this.props.loginState.mostFrequentRoute[0].end_point
          .longitude
      })
        .then(json => {
          this.setState({
            city_name: json.results[2].address_components[2].long_name
          });
        })
        .catch(error => console.warn(error));
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const points = this.props.profile.points
      ? pointsDecimal(this.props.profile.points)
      : 0;
    return (
      <View
        style={[
          styles.footerMainContainer,
          this.props.style,
          { flexDirection: "column" }
        ]}
      >
        <TextReact
          style={[
            styles.centerBoldText,
            { fontSize: this.props.profile.points >= 100000 ? 22 : 30 }
          ]}
        >
          {points}
        </TextReact>
        <TextReact style={[styles.centerText, { fontSize: 14, top: -8 }]}>
          {strings("id_5_01").toLocaleUpperCase()}
        </TextReact>
      </View>
    );
  }

  noRender() {
    const points = this.props.profile.points
      ? pointsDecimal(this.props.profile.points)
      : 0;
    return (
      <View style={[styles.footerMainContainer, this.props.style]}>
        <View style={styles.leftTextContainer}>
          <View style={[styles.textContainer, { alignItems: "flex-end" }]}>
            <TextReact style={[styles.centerText, { fontSize: 10 }]}>
              {strings("id_5_01").toLocaleUpperCase()}
            </TextReact>
            <TextReact
              style={[
                styles.centerBoldText,
                { fontSize: this.props.profile.points >= 100000 ? 20 : 28 }
              ]}
            >
              {points}
            </TextReact>
          </View>
        </View>

        <View
          style={{
            width: 60,
            height: 40,
            alignSelf: "center"
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              alignSelf: "center",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              shadowRadius: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.5,
              elevation: 2,
              borderRadius: 30
            }}
          >
            <Image
              style={{
                width: 30,
                height: 30,
                alignSelf: "center"
              }}
              source={require("../../assets/images/Eni_logo.png")}
            />
          </View>
        </View>

        <View style={styles.rightTextContainer}>
          <View style={styles.textContainer}>
            <TextReact style={styles.centerText}>
              {strings("id_5_02").toLocaleUpperCase()}
            </TextReact>
            <TextReact style={[styles.centerBoldText, { fontSize: 18 }]}>
              {this.state.city_name.toLocaleUpperCase()}
            </TextReact>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerMainContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.1,

    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  leftTextContainer: {
    width: 120,
    flexDirection: "column",
    justifyContent: "space-around"
  },
  textContainer: {
    // flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start"
  },
  modalSplitText: {
    color: "#3D3D3D",
    fontSize: 10,
    marginRight: 10,
    textAlignVertical: "center",
    fontFamily: "OpenSans-Regular"
  },
  modalSplitResponse: {
    color: "#3D3D3D",
    fontSize: 13,
    fontWeight: "700",
    textAlignVertical: "center",
    fontFamily: "OpenSans-Regular"
  },
  overall: {
    color: "#3D3D3D",
    fontSize: 25,
    textAlignVertical: "center",
    fontFamily: "Montserrat-ExtraBold"
  },
  modalSplitTextWhite: {
    color: "#ffffff",
    fontSize: 10,
    marginRight: 10,
    textAlignVertical: "center",
    fontFamily: "OpenSans-Regular"
  },
  modalSplitResponseWhite: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    textAlignVertical: "center",
    fontFamily: "OpenSans-Regular"
  },
  centerText: {
    color: "#3D3D3D",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "OpenSans-Regular"
  },
  centerBoldText: {
    color: "#3D3D3D",
    fontFamily: "Montserrat-ExtraBold"
  },
  rightTextContainer: {
    width: 120,
    flexDirection: "column",
    justifyContent: "space-around"
  }
});

const getStandings = state => state.standings;

const getStandingsState = createSelector(
  [getStandings],
  standings => standings
);

const withData = connect(state => {
  return {
    standingsState: getStandingsState(state)
  };
});

export default withData(ProfileScreenCardsFooter);

// export default ProfileScreenCardsFooter;
