import React from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";

import JsonQuery from "json-query";
import Emoji from "@ardentlabs/react-native-emoji";
import { data } from "./../../assets/ListCities";

import PilotCity from "./../PilotCity/PilotCity";

import LinearGradient from "react-native-linear-gradient";

import Icon from "react-native-vector-icons/Ionicons";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

import { strings } from "../../config/i18n";

import { connect } from "react-redux";
import { updateState } from "./../../domains/register/ActionCreators";

class SelectCityScroll extends React.Component {
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
        style={[
          {
            height: 400
          },
          this.props.style
        ]}
      >
        <ScrollView
          style={[
            {
              height: 255,
              width: Dimensions.get("window").width
            },
            styles.flatListContainer,
            this.props.style
          ]}
          contentContainerStyle={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              height: 30
            }}
          />
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
                  updateState({
                    nearestCity: "Amsterdam",
                    cityId: 753,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Amsterdam"}
              source={require("../../assets/images/cities/amsterdam.png")}
              sourceBn={require("../../assets/images/cities/amsterdam_bn.png")}
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
                  updateState({
                    nearestCity: "Barcelona",
                    cityId: 617,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Barcelona"}
              source={require("../../assets/images/cities/barcelona.png")}
              sourceBn={require("../../assets/images/cities/barcelona_bn.png")}
            />
            <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Cagliari" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Cagliari",
                    cityId: 551,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Cagliari"}
              source={require("../../assets/images/cities/cagliari.png")}
              sourceBn={require("../../assets/images/cities/cagliari_bn.png")}
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
          {/* <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Dudelange" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Dudelange",
                    cityId: 1172,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Dudelange"}
              source={require("../../assets/images/cities/dudelange.png")}
              sourceBn={require("../../assets/images/cities/dudelange_bn.png")}
            /> */}
          <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Fundao" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Fundao",
                    cityId: 1165,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Fundao"}
              source={require("../../assets/images/cities/fundao.png")}
              sourceBn={require("../../assets/images/cities/fundao_bn.png")}
            />
            <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Ghent" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Ghent",
                    cityId: 915,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Ghent"}
              source={require("../../assets/images/cities/ghent.png")}
              sourceBn={require("../../assets/images/cities/ghent_bn.png")}
            />
            <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Gliwice" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Gliwice",
                    cityId: 348,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Gliwice"}
              source={require("../../assets/images/cities/gliwice.png")}
              sourceBn={require("../../assets/images/cities/gliwice_bn.png")}
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
                this.setState({ city: "Helsinki" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Helsinki",
                    cityId: 869,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Helsinki"}
              source={require("../../assets/images/cities/helsinki.png")}
              sourceBn={require("../../assets/images/cities/helsinki_bn.png")}
            />
            <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Katowice" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Katowice",
                    cityId: 418,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Katowice"}
              source={require("../../assets/images/cities/katowice.png")}
              sourceBn={require("../../assets/images/cities/katowice_bn.png")}
            />
            <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Milano" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Milano",
                    cityId: 478,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Milano"}
              source={require("../../assets/images/cities/milano.png")}
              sourceBn={require("../../assets/images/cities/milano_bn.png")}
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
                this.setState({ city: "München" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "München",
                    cityId: 934,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"München"}
              source={require("../../assets/images/cities/munich.png")}
              sourceBn={require("../../assets/images/cities/munich_bn.png")}
            />
            <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Oostende" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Oostende",
                    cityId: 1170,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Oostende"}
              source={require("../../assets/images/cities/oostende.png")}
              sourceBn={require("../../assets/images/cities/oostende_bn.png")}
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
                  updateState({
                    nearestCity: "Palermo",
                    cityId: 1122,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Palermo"}
              source={require("../../assets/images/cities/palermo.png")}
              sourceBn={require("../../assets/images/cities/palermo_bn.png")}
            />
           
            
            
            
          </View>

          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              height: 100,
              flexDirection: "row",
              justifyContent: "flex-start",
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
                this.setState({ city: "Roma" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Roma",
                    cityId: 547,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Roma"}
              source={require("../../assets/images/cities/roma.png")}
              sourceBn={require("../../assets/images/cities/roma_bn.png")}
            />
            <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Šabac" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Šabac",
                    cityId: 1169,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Šabac"}
              source={require("../../assets/images/cities/sabac.png")}
              sourceBn={require("../../assets/images/cities/sabac_bn.png")}
            />
            <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Sosnowiec" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Sosnowiec",
                    cityId: 635,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Sosnowiec"}
              source={require("../../assets/images/cities/sosnowiec.png")}
              sourceBn={require("../../assets/images/cities/sosnowiec_bn.png")}
            />
            
            
            
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              height: 100,
              flexDirection: "row",
              justifyContent: "flex-start",
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
                this.setState({ city: "Teresina" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Teresina",
                    cityId: 1168,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Teresina"}
              source={require("../../assets/images/cities/teresina.png")}
              sourceBn={require("../../assets/images/cities/teresina_bn.png")}
            />
            {/* <PilotCity
              nearestCity={
                this.props.registerState.nearestCity
                  ? this.props.registerState.nearestCity
                  : ""
              }
              handleTap={() => {
                this.setState({ city: "Veszprém" });
                this.props.dispatch(
                  updateState({
                    nearestCity: "Veszprém",
                    cityId: 791,
                    autocompleteCityName: ""
                  })
                );
              }}
              cityName={"Veszprém"}
              source={require("../../assets/images/cities/veszprem.png")}
              sourceBn={require("../../assets/images/cities/veszprem_bn.png")}
            /> */}
            
            
            
          </View>

          <View
            style={{
              height: 140,
              backgroundColor: "transparent",
              alignContent: "center",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                alignContent: "center",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width * 0.8,
                  alignContent: "center",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "400",
                    fontSize: 11,
                    color: "#3D3D3D",
                    textAlign: "center"
                  }}
                >
                  {strings("if_it_s_not_amo")}
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                alignContent: "center",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.navigate("SelectCity");
                }}
              >
                <View>
                  <LinearGradient
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 0.0, y: 1.0 }}
                    locations={[0, 1.0]}
                    colors={["#F9B224", "#FFCC00"]}
                    style={{
                      borderWidth: 1,
                      padding: 10,
                      height: 45,
                      width: Dimensions.get("window").width * 0.6,

                      // backgroundColor: "#3D3D3D",
                      // color: "#fff",
                      borderRadius: 4,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",

                      borderColor: "transparent",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      elevation: 1
                    }}
                  >
                    {/* <Emoji style={{}} name={"city_sunset"} /> */}
                    <OwnIcon
                      name="city_icn"
                      size={22}
                      color="#3D3D3D"
                      style={{}}
                    />
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        fontSize: 15,
                        color: "#3d3d3d",
                        textAlign: "center",
                        marginRight: Dimensions.get("window").width * 0.2
                      }}
                    >
                      {this.props.registerState.nearestCity
                        ? this.props.registerState.nearestCity
                        : strings("choose")}
                      {/* {this.props.registerState.nearestCity
                        ? this.props.registerState.nearestCity
                        : strings("choose")} */}
                      {/* {strings("choose")} */}
                      {/* {this.props.registerState.autocompleteCityName != ""
                        ? this.props.registerState.autocompleteCityName
                        : strings("choose")} */}
                    </Text>
                    <Icon
                      name="md-arrow-forward"
                      size={18}
                      color="#3d3d3d"
                      style={{}}
                    />
                  </LinearGradient>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              height: 100,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          />

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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

// export default SelectCity;

const withRegister = connect(state => {
  return {
    registerState: state.register
  };
});

export default withRegister(SelectCityScroll);
