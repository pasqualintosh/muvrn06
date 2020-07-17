import React from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";

import JsonQuery from "json-query";
import Emoji from "@ardentlabs/react-native-emoji";
import { data } from "./../../assets/ListCities";

import PilotCity from "./../PilotCity/PilotCity";
import GoOnButton from "./../GoOnButton/GoOnButton";

import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";

class SelectCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      textInputValue: "",
      showModal: false
    };
  }
  nearestCity = () => {
    if (this.state.city != "") {
      return this.state.city;
    } else {
      return this.props.registerState.nearestCity
        ? this.props.registerState.nearestCity
        : "";
    }
  };
  renderCity(name) {
    return (
      <View>
        <Text>{name}</Text>
      </View>
    );
  }
  renderScrollAutofocus(optionList) {
    if (this.state.showModal)
      return (
        <ScrollView
          style={{
            // opacity: this.state.showModal ? 1 : 0,
            backgroundColor: "#F7F8F9",
            width: Dimensions.get("window").width * 0.8,
            height: 180,
            position: "absolute",
            top: 0,
            left: 0,
            alignSelf: "center"
          }}
        >
          {optionList}
        </ScrollView>
      );
  }
  render() {
    const result =
      this.state.cityName != ""
        ? JsonQuery(`cities[*name~/${this.state.cityName}/i].name`, {
            allowRegexp: true,
            data: data
          }).value
        : "";
    // const optionList =
    //   result.length > 1
    //     ? result.map((item, index) => <Text key={index}>{item}</Text>)
    //     : [].map((item, index) => <Text key={index}>{item}</Text>);
    return (
      <View
        style={
          {
            // width: Dimensions.get("window").width * 0.8,
            // height: Dimensions.get("window").height * 0.65,
            // flexDirection: "column",
            // justifyContent: "flex-start",
            // alignItems: "center"
          }
        }
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            height: 100,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <PilotCity
            nearestCity={
              this.props.registerState.nearestCity
                ? this.props.registerState.nearestCity
                : ""
            }
            handleTap={() => {
              this.setState({ city: "Amsterdam" });
              this.props.dispatch(
                updateState({ nearestCity: "Amsterdam", cityId: 753 })
              );
            }}
            cityName={"Amsterdam"}
            source={require("../../assets/images/cities/amsterdam_logo.png")}
          />
          <PilotCity
            nearestCity={
              this.props.registerState.nearestCity
                ? this.props.registerState.nearestCity
                : ""
            }
            handleTap={() => {
              this.setState({ city: "Barcelona" });
              this.props.dispatch(
                updateState({ nearestCity: "Barcelona", cityId: 617 })
              );
            }}
            cityName={"Barcelona"}
            source={require("../../assets/images/cities/barcelona_logo.png")}
          />
          <PilotCity
            nearestCity={
              this.props.registerState.nearestCity
                ? this.props.registerState.nearestCity
                : ""
            }
            handleTap={() => {
              this.setState({ city: "Fundao" });
              this.props.dispatch(
                updateState({ nearestCity: "Fundao", cityId: 1165 })
              );
            }}
            cityName={"Fundao"}
            source={require("../../assets/images/cities/fundao_logo.png")}
          />
        </View>
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            height: 100,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <PilotCity
            nearestCity={
              this.props.registerState.nearestCity
                ? this.props.registerState.nearestCity
                : ""
            }
            handleTap={() => {
              this.setState({ city: "Ghent" });
              this.props.dispatch(
                updateState({ nearestCity: "Ghent", cityId: 915 })
              );
            }}
            cityName={"Ghent"}
            source={require("../../assets/images/cities/ghent_logo.png")}
          />
          <PilotCity
            nearestCity={
              this.props.registerState.nearestCity
                ? this.props.registerState.nearestCity
                : ""
            }
            handleTap={() => {
              this.setState({ city: "Helsinki" });
              this.props.dispatch(
                updateState({ nearestCity: "Helsinki", cityId: 869 })
              );
            }}
            cityName={"Helsinki"}
            source={require("../../assets/images/cities/helsinki_logo.png")}
          />
          <PilotCity
            nearestCity={
              this.props.registerState.nearestCity
                ? this.props.registerState.nearestCity
                : ""
            }
            handleTap={() => {
              this.setState({ city: "Palermo" });
              this.props.dispatch(
                updateState({ nearestCity: "Palermo", cityId: 1122 })
              );
            }}
            cityName={"Palermo"}
            source={require("../../assets/images/cities/palermo_logo.png")}
          />
        </View>
        {/* 
        <View
          style={{
            width: Dimensions.get("window").width * 0.8,
            height: 100,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
        </View> 
        */}
        {/* 
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate("SelectCity");
          }}
        >
          <View
            style={{
              borderWidth: 1,
              padding: 10,
              height: 30,
              width: Dimensions.get("window").width * 0.3,
              marginLeft: Dimensions.get("window").width * 0.25,
              backgroundColor: "#3D3D3D",
              // color: "#fff",
              borderRadius: 4,
              justifyContent: "center",
              alignItems: "flex-start",
              marginTop: 20
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                fontSize: 12,
                color: "#fff",
                textAlign: "center"
              }}
            >
              <Emoji style={{}} name={"city_sunset"} />
              &nbsp;
              {this.props.registerState.nearestCity
                ? this.props.registerState.nearestCity
                : ""}
            </Text>
          </View>
        </TouchableWithoutFeedback> 
        */}
        <GoOnButton
          handleNextTap={() =>
            this.props.handleNextTap(this.props.registerState.nearestCity)
          }
        />
      </View>
    );
  }
}

// export default SelectCity;

const withRegister = connect(state => {
  return {
    registerState: state.register
  };
});

export default withRegister(SelectCity);
