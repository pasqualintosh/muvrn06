import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

class MotoCC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderCcCheckBox(val) {
    let string = val.replace(/_/g, "-");
    string = string.replace(/more/g, "> ");
    string = string.replace(/less/g, "< ");
    if (this.props.motoCCPossibilities.includes(val)) {
      return (
        <View style={styles.answerBoxes}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.handleMotoCCChange(val);
            }}
          >
            <View style={styles.checkboxesContainer}>
              <View
                style={[
                  styles.checkboxes,
                  {
                    backgroundColor: this.props.checkboxColor
                  }
                ]}
              >
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 0.0, y: 1 }}
                  locations={[0, 1.0]}
                  colors={["#E82F73", "#F49658"]}
                  style={[
                    styles.checkboxes,
                    {
                      opacity: this.props.motoCCAnswer == val ? 1 : 0
                    }
                  ]}
                />
              </View>
              <Text style={styles.checkboxesText}>{string}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    } else if (val == "x") {
      return (
        <View style={styles.answerBoxes}>
          <View style={styles.checkboxesContainer} />
        </View>
      );
    }
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
          <Text style={styles.ccText}>Cubic Capacity</Text>
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
          {this.renderCcCheckBox("less_50cm3")}
          {this.renderCcCheckBox("more_51cm3")}
          {this.renderCcCheckBox("51_250cm3")}
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
          {this.renderCcCheckBox("251_750cm3")}
          {this.renderCcCheckBox("more_751cm3")}
          {this.renderCcCheckBox("x")}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ccContainer: {
    height: 50,
    width: 50,
    marginHorizontal: 10
  },
  ccText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    color: "#3d3d3d",
    fontSize: 13
  },
  checkboxes: {
    height: 20,
    width: 20
    // backgroundColor: this.props.checkboxColor
  },
  checkboxesText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#3d3d3d",
    fontSize: 11,
    marginLeft: 6
  },
  checkboxesContainer: {
    height: 20,
    width: Dimensions.get("window").width * 0.25,
    flexDirection: "row"
  },
  answerBoxes: {
    height: 20,
    width: Dimensions.get("window").width * 0.25,
    marginVertical: 5,
    marginHorizontal: 5
  }
});

export default MotoCC;
