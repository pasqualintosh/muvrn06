import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import RedFlagChallenges from "./../RedFlagChallenges/RedFlagChallenges";
import { connect } from "react-redux";
import {
  getChallenges,
  getChallengesRewards,
  getChallengeRankingByUser,
  getChallengesRewardsByUser,
  getChallengesAllowed
} from "./../../domains/challenges/ActionCreators";

class ChallengeTrainingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (this.props.navigation) {
            let t = new Date(),
              start_time = new Date(this.props.challenge.start_time);
            // start_time = new Date("2020-03-06 18:00:00");
            this.props.dispatch(getChallenges());
            this.props.dispatch(getChallengesAllowed());
            this.props.dispatch(getChallengesRewards());
            this.props.dispatch(getChallengesRewardsByUser());
            this.props.dispatch(getChallengeRankingByUser());
            this.props.navigation.navigate("DetailChallengeScreen", {
              challenge: {
                ...this.props.challenge,
                active: this.props.active ? this.props.active : false,
                waiting: start_time > t ? true : false
              }
            });
          }
        }}
      >
        <View
          style={[
            styles.mainContainer,
            {
              borderColor: this.props.active ? "#F37B59" : "#000",
              borderWidth: this.props.active ? 1 : 0
            }
          ]}
        >
          <View style={styles.topContainer}>
            <RedFlagChallenges width={36} height={25} />

            <Image
              source={require("../../assets/images/challenge_eni_prima.png")}
              resizeMode={"contain"}
              style={{
                width: Dimensions.get("window").width * 0.89,
                height: (Dimensions.get("window").width * 0.89) / 3.95833333
              }}
            />
          </View>

          <Image
            source={require("../../assets/images/wave_challenge_card.png")}
            resizeMode={"contain"}
            style={styles.waveContainer}
          />
          {/* <View style={styles.topImgContainer}> */}
          {/* </View> */}
          <View style={styles.bottomImgContainer}>
            <Text style={styles.bottomText}>{this.props.name}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.24,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#F7F8F9",
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2,
    marginVertical: 5
  },
  topContainer: {
    width: Dimensions.get("window").width * 0.89,
    height: Dimensions.get("window").height * 0.24 * 0.65 - 0.05,
    backgroundColor: "#fff",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  topImgContainer: {
    width: Dimensions.get("window").width * 0.89,
    height: Dimensions.get("window").height * 0.24 * 0.3 - 0.05,
    // backgroundColor: "#F7F8F9",
    // borderTopLeftRadius: 6,
    // borderTopRightRadius: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  waveContainer: {
    width: Dimensions.get("window").width * 0.89,
    height: (Dimensions.get("window").width * 0.89) / 16
    // height: Dimensions.get("window").height * 0.24 * 0.34 - 0.05
    // backgroundColor: "#3e3",
    // borderTopLeftRadius: 6,
    // borderTopRightRadius: 6,
  },
  bottomImgContainer: {
    width: Dimensions.get("window").width * 0.89,
    height:
      Dimensions.get("window").height * 0.24 * 0.34 -
      0.05 -
      (Dimensions.get("window").width * 0.89) / 16,
    backgroundColor: "#F7F8F9",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  bottomText: {
    color: "#3d3d3d",
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 14
  }
});

const withData = connect(state => {
  return {};
});

export default withData(ChallengeTrainingContainer);

// export default ChallengeTrainingContainer;
