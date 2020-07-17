/**
 * scena per spiegare come risolvere i problemi con oneplus
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Platform
} from "react-native";

import { strings } from "../../config/i18n";

import LogOut from "../../components/LogOut/LogOut";

class OneplusScreen extends React.Component {
  constructor() {
    super();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {/* {strings("change_muv_lang")} */}
          {"FAQ Oneplus"}
        </Text>
      )
      // headerRight: <LogOut />
    };
  };

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <View
        style={{
          backgroundColor: "#fff"
        }}
      >
        <ScrollView
          style={{
            backgroundColor: "#fff",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
        >
          <View style={styles.other}>
            <Text style={styles.Left}>{"1° open multitasking"}</Text>
          </View>
          <Image
            source={require("../../assets/images/faq/1.jpg")}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width * 1.33
            }}
          />
          <View style={styles.other}>
            <Text style={styles.Left}>{"2° open multitasking"}</Text>
          </View>
          <Image
            source={require("../../assets/images/faq/2.jpg")}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width * 1.33
            }}
          />
          <View style={styles.other}>
            <Text style={styles.Left}>{"3° open multitasking"}</Text>
          </View>
          <Image
            source={require("../../assets/images/faq/3.jpg")}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width * 1.33
            }}
          />
          <View style={styles.other}>
            <Text style={styles.Left}>{"4° open multitasking"}</Text>
          </View>
          <Image
            source={require("../../assets/images/faq/4.jpg")}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width * 1.33
            }}
          />
          <View style={{ height: 200 }} />
        </ScrollView>
      </View>
    );
  }
}

export default OneplusScreen;

const styles = StyleSheet.create({
  first: {
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },
  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    // borderTopColor: "#5F5F5F",
    // borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3
  },
  LeftFrequentRoute: {
    fontSize: 15,
    fontWeight: "bold"
    // alignSelf: "center",
    // textAlignVertical: "center",
    // flex: 1,
    // left: 20
  },
  Left: {
    alignSelf: "center",
    textAlignVertical: "center",
    flex: 1,
    fontSize: 12,

    left: 20,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  LeftTitle: {
    alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "left",

    fontSize: 12,
    fontWeight: "bold",
    left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  LeftDescr: {
    alignSelf: "auto",
    textAlignVertical: "center",
    textAlign: "left",

    fontSize: 9,

    left: 20,
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  session: {
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    height: Dimensions.get("window").height * 0.1
  },
  Right: {
    alignSelf: "center",
    right: 20,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  RightAndroid: {
    alignSelf: "center",
    right: 10
  },
  RightText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  centerTextContainer: {
    // width: 200,
    // height: 200,
    position: "absolute",
    top: Dimensions.get("window").height * 0.1 + 190
  },
  centerValue: {
    fontFamily: "Montserrat-ExtraBold",
    color: "#3F3F3F",
    fontSize: 37,
    textAlign: "center",
    textAlignVertical: "center"
  },
  centerTextParam: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#9D9B9C",
    fontSize: 9,
    fontWeight: "bold"
  },
  iconText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    color: "#fff",
    fontSize: 10,
    textAlignVertical: "center"
  },
  mfrText: {
    fontFamily: "OpenSans-Regular",
    // color: "black",
    marginRight: 0,
    fontWeight: "bold",
    color: "#3D3D3D",
    fontSize: 13,
    textAlign: "center"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,

    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContentAndroid: {
    width: 120,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
});
