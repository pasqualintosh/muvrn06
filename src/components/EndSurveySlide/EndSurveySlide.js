import React from "react";
import { View, Text, Dimensions } from "react-native";
import Emoji from "@ardentlabs/react-native-emoji";
import { styles } from "./Style";
import GoOnButton from "./../GoOnButton/GoOnButton";

import { connect } from "react-redux";
import { createAccount } from "./../../domains/register/ActionCreators";

import analytics from "@react-native-firebase/analytics";
async function trackEvent(event, data) {
  await analytics().logEvent(event, { data });
}

class EndSurveySlide extends React.Component {
  getOverallModalSplit = modal_splits => {
    const overall_modal_split = {
      overall_modal_split_walk: 0,
      overall_modal_split_bike: 0,
      overall_modal_split_bus: 0,
      overall_modal_split_car_pooling: 0,
      overall_modal_split_car: 0
    };
    modal_splits.forEach(item => {
      switch (item.label) {
        case "walk":
          overall_modal_split.overall_modal_split_walk = item.value * 4;
          break;
        case "bike":
          overall_modal_split.overall_modal_split_bike = item.value * 4;
          break;
        case "bus":
          overall_modal_split.overall_modal_split_bus = item.value * 4;
          break;
        case "car":
          overall_modal_split.overall_modal_split_car = item.value * 4;
          break;
        case "car_pooling":
          overall_modal_split.overall_modal_split_car_pooling = item.value * 4;
          break;
      }
    });
    return overall_modal_split;
  };
  getMFRModalSplit = modal_splits => {
    const mfr_modal_split = {
      mfr_modal_split_walk: 0,
      mfr_modal_split_bike: 0,
      mfr_modal_split_bus: 0,
      mfr_modal_split_car_pooling: 0,
      mfr_modal_split_car: 0
    };
    modal_splits.forEach(item => {
      switch (item.label) {
        case "walk":
          mfr_modal_split.mfr_modal_split_walk = item.value * 4;
          break;
        case "bike":
          mfr_modal_split.mfr_modal_split_bike = item.value * 4;
          break;
        case "bus":
          mfr_modal_split.mfr_modal_split_bus = item.value * 4;
          break;
        case "car":
          mfr_modal_split.mfr_modal_split_car = item.value * 4;
          break;
        case "car_pooling":
          mfr_modal_split.mfr_modal_split_car_pooling = item.value * 4;
          break;
      }
    });
    return mfr_modal_split;
  };
  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.text}>
          Invite your friends to join the{" "}
          <Text style={styles.strong}>MUVement</Text> and train{" "}
          <Emoji name={"runner"} /> for the&nbsp;
          <Text style={styles.strong}>”International City Tournament”</Text>
        </Text>
        <GoOnButton
          topPosition={{ top: Dimensions.get("window").height * 0.25 }}
          text={"I Will"}
          status={this.props.status}
          handleNextTap={() => {
            console.log(this.props.registerState);
            const overall_modal_split = this.getOverallModalSplit(
              this.props.registerState.generalModalSplit
            );
            const mfr_modal_split = this.getMFRModalSplit(
              this.props.registerState.mostFrequentRaceModalSplit
            );
            const account = {
              ...this.props.registerState,
              ...overall_modal_split,
              ...mfr_modal_split
            };
            console.log(account);
            this.props.dispatch(
              createAccount(account, this.props.handleNextTap)
            );

            trackEvent("end_registration", "User interactions");
            // this.props.handleNextTap();
          }}
        />
      </View>
    );
  }
}

const withRegister = connect(state => {
  return {
    registerState: state.register,
    status: state.login.status ? state.login.status : false
  };
});

export default withRegister(EndSurveySlide);
