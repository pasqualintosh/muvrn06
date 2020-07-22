import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ImageBackground,
  NativeModules,
  Share,
  ScrollView,
  TouchableHighlight,
  Alert,
} from "react-native";
import { images } from "./../../components/InfoUserHome/InfoUserHome";

import { strings } from "../../config/i18n";

import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { getStringValuesGarage} from "../../helpers/translateLabelDB"

class AlertListChoose extends React.Component {
  constructor(props) {
    super(props);
  }

  
  getFeedContentFromString = (str, rplc_text) => {
    let first_perc = str.indexOf("%");
    let last_perc = str.indexOf("%", first_perc + 1);
    let introduction = str.substr(0, first_perc);
    let ending = str.substr(last_perc + 1, str.lenght);

    return (
      <Text>
        {introduction}
        <Text>{rplc_text}</Text>
        {ending}
      </Text>
    );
  };

  

  boxList = () => {
    return (
      <View
        style={{
          borderRadius: 10,
          alignItems: "center",

          flexDirection: "column",
          justifyContent: "space-between",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          borderColor: "#3363AD",
          borderWidth: 4,

          width: Dimensions.get("window").width * 0.8,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
            paddingTop: 15,
            width: Dimensions.get("window").width * 0.6,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                width: 60,
                height: 60,
              }}
              // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}

              source={this.props.imageAlert}
            />
          </View>

          <View
            style={{
              width: Dimensions.get("window").width * 0.6 - 80,
              height: 80,
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
          <Text style={{color: "#3d3d3d",
                  fontSize: 20,
                fontFamily: "Montserrat-ExtraBold",
                  textAlign: "left", }}>{this.props.titleAlert}</Text>
          </View>
        </View>
        <ScrollView
        >

        {this.props.listOption.map((elem, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => this.props.confermModal(elem, this.props.paramAlert , index)}
          >
            <View
              style={{
                width: Dimensions.get("window").width * 0.6,
                alignContent: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: 15,

                borderTopWidth: index ? 1 : 0,
                borderTopColor: "#3363AD",
              }}
            >
              <Text
                style={{
                  color: "#3d3d3d",
                  fontSize: 20,
                  fontFamily:
                    elem == this.props.valueAlert
                      ? "OpenSans-Bold"
                      : "OpenSans-Regular",
                  textAlign: "center",
                }}
              >
                {getStringValuesGarage(elem)}
              </Text>
            </View>
            
          </TouchableOpacity>
        ))}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 15,
          }}
        />
      </View>
    );
  };




  renderCointaner = () => {
    return this.inviteReceive();
  };

  render() {
    return (
      <Modal
        isVisible={this.props.isModalVisible}
        onSwipeComplete={() => {
          this.props.closeModal(this.props.infoSend);
        }}
        onBackButtonPress={() => {
          this.props.closeModal(this.props.infoSend);
        }}
        onBackdropPress={() => {
          this.props.closeModal(this.props.infoSend);
        }}
        swipeDirection="left"
        //useNativeDriver={true}
        style={{
          borderRadius: 10,
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          shadowRadius: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,

          // backgroundColor: "white"
        }}
        backdropOpacity={0.7}
      >
        {this.boxList()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  buttonImageStyle: {
    width: 50,
    height: 50,
  },
  buttonModalImageStyle: {
    width: 30,
    height: 30,
  },
  buttonRegister: {
    width: Dimensions.get("window").width * 0.3,
    height: 44,
    borderRadius: 22,
    borderColor: "#3363AD",
    borderWidth: 1,

    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  imagesContainer: {
    height: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#637FB8",
  },
  weekDayContainer: {
    // marginTop: 120,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  timeContainer: {
    height: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("window").width * 0.9,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeView: {
    height: 40,
    width: Dimensions.get("window").width * 0.3,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 10,
  },
  startTimeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 18,
    color: "#637FB8",
  },
  slashTimeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 18,
    color: "#637FB8",
  },
  endTimeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 18,
    color: "#637FB8",
  },

  ftText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 17,
    color: "#3d3d3d",
    paddingLeft: 8,
  },
  ftTypeText: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 17,
    color: "#3d3d3d",
    paddingLeft: 8,
  },
  ftTypes: {
    width: Dimensions.get("window").width * 0.9,

    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  Value: {
    color: "#FFFFFF",
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
  ValueDescr: {
    color: "#9D9B9C",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "OpenSans-Bold",
  },
  cardContainer: {
    width: Dimensions.get("window").width * 0.9,
    // + 45 cosi i punti sono piu sotto e ha piu spazio per fare il giro della card
    height: Dimensions.get("window").height * 0.55 + 25,
  },
  card: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    backgroundColor: "#FE474C",
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cardPadding: {
    width: Dimensions.get("window").width * 0.8 - 8,
    height: 36,
    backgroundColor: "#3363AD",
    borderColor: "#F7F8F9",
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,

    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cardPaddingMap: {
    width: Dimensions.get("window").width * 0.8,
    height: 40,
    backgroundColor: "#3363AD",

    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    shadowOpacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  card1: {
    backgroundColor: "#FE474C",
  },
  card2: {
    backgroundColor: "#FEB12C",
  },
  label: {
    lineHeight: 470,
    textAlign: "center",
    fontSize: 55,
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.55,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#3363AD",
    flexDirection: "column",
  },
  MapContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.9 - 2,
    height: Dimensions.get("window").height * 0.55 - 2,
    borderRadius: 4,
  },
  content: {
    marginTop: 14,
    width: Dimensions.get("window").width * 0.83,
    // height: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.45,
    backgroundColor: "#3d3d3d",
  },
  avatarImage: {
    flex: 1,
    // position: "absolute",
    width: 214,
    height: 350,
    alignSelf: "center",
  },
  nameText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
  levelText: {
    color: "#E83475",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Montserrat-ExtraBold",
  },
});

if (NativeModules.RNDeviceInfo.model.includes("iPad")) {
  Object.assign(styles, {
    avatarImage: {
      flex: 1,
      // position: "absolute",
      width: 102,
      height: 168,
      alignSelf: "center",
    },
    cardContainer: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
    },
    card: {
      width: Dimensions.get("window").width * 0.8,
      height: Dimensions.get("window").height * 0.45,
      backgroundColor: "#FE474C",
      borderRadius: 5,
      shadowColor: "rgba(0,0,0,0.5)",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.5,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      // flex: 1,
      // backgroundColor: "#fff",
      // justifyContent: "flex-start",
      // alignItems: "center",
      // width: Dimensions.get("window").width * 0.8,
      // height: Dimensions.get("window").height * 0.45,
      // borderRadius: 4

      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
      width: Dimensions.get("window").width * 0.9,
      height: Dimensions.get("window").height * 0.55,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#3363AD",
      flexDirection: "column",
    },
    content: {
      marginTop: 14,
      width: Dimensions.get("window").width * 0.73,
      height: Dimensions.get("window").height * 0.35,
      backgroundColor: "#3d3d3d",
    },
    nameText: {
      color: "#fff",
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold",
    },
    levelText: {
      color: "#E83475",
      fontSize: 16,
      textAlign: "center",
      fontFamily: "Montserrat-ExtraBold",
    },
  });
}

export default AlertListChoose;
