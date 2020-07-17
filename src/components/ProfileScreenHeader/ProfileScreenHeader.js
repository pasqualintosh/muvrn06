import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import { strings } from "../../config/i18n";

class ProfileScreenHeader extends React.Component {
  render() {
    return (
      <View style={styles.endFlex}>
        <View style={styles.mainContainer}>
          <TouchableWithoutFeedback
            onPress={() => this.props.handleChangePage("myself")}
          >
            <View style={styles.sideContainer}>
              <Text
                style={[
                  styles.text,
                  { color: this.props.page == "myself" ? "#fff" : "#9D9B9C" }
                ]}
              >
                {strings("myself").toLocaleUpperCase()}
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor:
                      this.props.page == "myself" ? "#fff" : "#9D9B9C"
                  }
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.props.handleChangePage("trainings")}
          >
            <View style={styles.sideContainer}>
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      this.props.page == "trainings" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              >
                {strings("trainings").toLocaleUpperCase()}
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor:
                      this.props.page == "trainings" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.props.handleChangePage("friends")}
          >
            <View style={styles.sideContainer}>
              <Text
                style={[
                  styles.text,
                  {
                    color: this.props.page == "friends" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              >
                {strings("friends").toLocaleUpperCase()}
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor:
                      this.props.page == "friends" ? "#3D3D3D" : "#9D9B9C"
                  }
                ]}
              />
            </View>
          </TouchableWithoutFeedback> 
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get("window").width,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  endFlex: {
    width: Dimensions.get("window").width,
    height: 40,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  sideContainer: {
    width: Dimensions.get("window").width * 0.33,
    // width: Dimensions.get("window").width * 0.5,
    height: 40,
    // backgroundColor: "#6397CB",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  text: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#fff",
    fontSize: 10,
    marginVertical: 10
  },
  underline: {
    width: Dimensions.get("window").width * 0.25,
    height: 6,
    backgroundColor: "#FFFFFF"
    //marginVertical: 4
  }
});

export default ProfileScreenHeader;
