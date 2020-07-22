import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  StatusBar
} from "react-native";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import JsonQuery from "json-query";
import { data } from "./../../assets/ListCities";

import MapView from "react-native-maps";
import { updateState } from "./../../domains/register/ActionCreators";
import { updateProfileNew } from "./../../domains/login/ActionCreators";
import { connect } from "react-redux";

import { strings } from "../../config/i18n";

class ChangeCity extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_13_68")}
        </Text>
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      cityName: "",
      showModal: false,
      latitude: 0,
      longitude: 0,
      result: "",
      point_lat: 0,
      point_lon: 0,
      selectedCityName: ""
    };
    this.mapRef = null;
  }
  componentWillMount() {
    if (
      this.props.registerState.nearestCityLat != undefined &&
      this.props.registerState.nearestCityLat != null
    ) {
      this.setState({
        selectedCityName: this.props.registerState.nearestCity,
        latitude: this.props.registerState.nearestCityLat,
        longitude: this.props.registerState.nearestCityLon,
        point_lat: this.props.registerState.nearestCityLat,
        point_lon: this.props.registerState.nearestCityLon
      });
    } else if (
      this.props.registerState.map_position != undefined &&
      this.props.registerState.map_position != null
    ) {
      this.setState({
        latitude: this.props.registerState.map_position.latitude,
        longitude: this.props.registerState.map_position.longitude
      });
    }
  }
  componentWillUnmount() {}
  renderScrollAutofocus(optionList) {
    if (this.state.showModal && this.state.result != "")
      return (
        <View
          style={{
            backgroundColor: "#fff",
            width: Dimensions.get("window").width * 0.95,
            // height: 250,
            alignSelf: "center",
            position: "absolute",
            top: Platform.OS === "ios" ? 60 : 40,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ScrollView>{optionList}</ScrollView>
        </View>
      );
  }
  renderPoints() {
    if (this.state.selectedCityName != "") {
      console.log("object");
      return (
        <MapView.Marker
          coordinate={{
            latitude: this.state.point_lat,
            longitude: this.state.point_lon
          }}
          image={require("./../../assets/images/Map_pin_1.png")}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      );
    }
  }
  renderCircle() {
    if (this.state.selectedCityName != "") {
      console.log("object");
      return (
        <MapView.Circle
          center={{
            latitude: this.state.point_lat,
            longitude: this.state.point_lon
          }}
          radius={100}
          fillColor="rgba(255, 255, 255, 0.52)"
          strokeColor="rgba(0, 0, 0, 0.33)"
          zIndex={-1}
        />
      );
    }
  }
  renderLongPressPhrase() {
    if (this.state.selectedCityName != "")
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.goBack(null);
          }}
        >
          <View
            style={{
              position: "absolute",
              top: Dimensions.get("window").height * 0.3,
              right: Dimensions.get("window").width * 0.1,
              width: Dimensions.get("window").width * 0.8,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              padding: 10,
              backgroundColor: "#fff",
              borderRadius: 3
            }}
          >
            <Text
              style={{
                fontFamily: "OpenSans-Regular",
                fontWeight: "400",
                color: "#3d3d3d",
                fontSize: 12,
                fontWeight: "bold"
              }}
            >
              {this.state.selectedCityName}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
  }
  render() {
    const result =
      this.state.cityName != ""
        ? JsonQuery(`cities[*name~/${this.state.cityName}/i]`, {
            allowRegexp: true,
            data: data
          }).value
        : "";
    const optionList =
      result.length > 0
        ? result.map((item, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                // console.log("object");
                // console.log(item);
                this.setState({
                  cityName: item.name,
                  showModal: false,
                  latitude: item.lat,
                  longitude: item.lon,
                  point_lat: item.lat,
                  point_lon: item.lon,
                  selectedCityName: item.name
                });
                this.mapRef.animateToCoordinate(
                  {
                    latitude: item.lat,
                    longitude: item.lon
                  },
                  1000
                );
                if (this.props.navigation.state.params) {
                  this.props.navigation.state.params.changeState(
                    item.name,
                    "cityName",
                    () => {}
                  );
                }
                this.props.dispatch(
                  updateProfileNew({
                    data: {
                      city: item.id
                    }
                  })
                );
                // this.props.dispatch(
                //   updateState({
                //     cityName: item.name,
                //     nearestCity: item.name,
                //     city: item.name,
                //     cityId: item.id,
                //     nearestCityLat: item.lat,
                //     nearestCityLon: item.lon,
                //     autocompleteCityName: item.name
                //   })
                // );
                // this.props.navigation.goBack();
              }}
            >
              <View
                style={{
                  borderBottomColor: "#3D3D3D20",
                  borderBottomWidth: 0.5,
                  width: Dimensions.get("window").width * 0.95,
                  height: 40,
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff"
                  // marginTop:
                  //   Platform.OS == "ios"
                  //     ? Dimensions.get("window").height === 812 ||
                  //       Dimensions.get("window").width === 812
                  //       ? 75
                  //       : 60
                  //     : 0
                }}
              >
                <Text
                  style={{
                    fontFamily: "OpenSans-Regular",
                    fontWeight: "400",
                    color: "#3d3d3d95",
                    fontSize: 16
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))
        : [].map((item, index) => <Text key={index}>{item}</Text>);

    return (
      <View
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "#fff"
          // justifyContent: "center",
          // alignItems: "center"
        }}
      >
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <MapView
          ref={ref => {
            this.mapRef = ref;
          }}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            position: "absolute",
            top: 0
          }}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
          loadingEnabled
        >
          {this.renderPoints()}
          {this.renderCircle()}
        </MapView>
        {this.renderLongPressPhrase()}

        <Input
          autoCorrect={false}
          placeholder={strings("id_13_69")}
          leftIcon={<Icon name="ios-search" size={18} color="#3D3D3D" />}
          containerStyle={{
            width: Dimensions.get("window").width * 0.95,
            height: 40,
            backgroundColor: "#fff",
            position: "absolute",
            top: Platform.OS === "ios" ? 20 : 10,
            alignSelf: "center"
          }}
          value={this.state.cityName}
          onChangeText={cityName => {
            this.setState({ cityName, result });
            if (cityName == "") this.setState({ result: "" });
          }}
          onFocus={() => {
            const flag = this.state.showModal;
            this.setState({ showModal: !flag });
          }}
          // onEndEditing={() => {
          //   this.setState({ showModal: false });
          // }}
        />
        {this.renderScrollAutofocus(optionList)}
        {/* 
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <View style={{ width: 100, height: 40, backgroundColor: "#abc" }}>
                <Text>go back</Text>
              </View>
            </TouchableWithoutFeedback> 
          */}
      </View>
    );
  }
}

const withRegister = connect(state => {
  return {
    registerState: state.register
  };
});

export default withRegister(ChangeCity);

// export default ChangeCity;
