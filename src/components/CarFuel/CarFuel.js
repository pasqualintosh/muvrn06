import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Modal
} from "react-native";
import OwnIcon from "../OwnIcon/OwnIcon";

class CarFuel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderFuelSelectBox(val) {
    if (this.props.carFuelPossibilities.includes(val))
      return (
        <TouchableWithoutFeedback
          onPress={() => this.props.handleCarFuelChange(val)}
        >
          <View
            style={[
              styles.fuelContainer,
              {
                // backgroundColor:
                //   this.props.carFuelAnswer == val
                //     ? "#3d3d3d"
                //     : this.props.checkboxColor
              }
            ]}
          >
            <OwnIcon
              name={`${
                val.toLowerCase() == "petrol_hybrids"
                  ? "hybrid"
                  : val.toLowerCase()
              }_icn`}
              size={38}
              color={
                this.props.carFuelAnswer == val
                  ? "#3d3d3d"
                  : this.props.checkboxColor
              }
            />
            <Text
              style={{
                color:
                  this.props.carFuelAnswer == val
                    ? "#3d3d3d"
                    : this.props.checkboxColor,
                fontFamily: "OpenSans-Regular",
                fontSize: 10,
                marginRight: 7
              }}
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
  }

  render() {
    return (
      <View
        style={{
          height: 133,
          width: Dimensions.get("window").width * 0.8,
          alignSelf: "center"
        }}
      >
        <View
          style={{
            height: 20,
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <Text style={styles.fuelText}>Fuel</Text>
        </View>
        <View
          style={{
            height: 56.5,
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderFuelSelectBox("petrol")}
          {this.renderFuelSelectBox("diesel")}
          {this.renderFuelSelectBox("hybrid")}
        </View>
        <View
          style={{
            height: 56.5,
            width: Dimensions.get("window").width * 0.8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderFuelSelectBox("LPG")}
          {this.renderFuelSelectBox("CNG")}
          {this.renderFuelSelectBox("electric")}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fuelContainer: {
    height: 70,
    width: 70,
    // marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  fuelText: {
    // marginHorizontal: 10,
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 13
  }
});

export default CarFuel;
