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

class AlertFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayResponse: 0,
      question: 0
    }
  }

  alertHonor = () => {
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
        <Image
          style={{
            width: 120,
            height: 120,
            paddingTop: 15,
          }}
          // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
          source={require("../../assets/images/battery.png")}
        />

        <View
          style={{
            width: Dimensions.get("window").width * 0.7,
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 15,
          }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 14,
              fontFamily: "OpenSans-Bold",
              textAlign: "center",
            }}
          >
            {strings("hey__to_use_muv")}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.confermModal(this.props.infoSend)}
          >
            <Image
              source={require("./../../assets/images/check_green_icn.png")}
              style={styles.buttonImageStyle}
            />
          </TouchableOpacity>

          <View style={styles.buttonModalImageStyle} />
          <TouchableOpacity
            onPress={() => this.props.closeModal(this.props.infoSend)}
          >
            <Image
              source={require("./../../assets/images/cancel_icn.png")}
              style={styles.buttonImageStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  alertOnePlus = () => {
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
        <Image
          style={{
            width: 120,
            height: 120,
            paddingTop: 15,
          }}
          // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
          source={require("../../assets/images/battery.png")}
        />

        <View
          style={{
            width: Dimensions.get("window").width * 0.7,
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 15,
          }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 14,
              fontFamily: "OpenSans-Bold",
              textAlign: "center",
            }}
          >
            {strings("_1006_hey__to_use_muv")}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.confermModal(this.props.infoSend)}
          >
            <Image
              source={require("./../../assets/images/check_green_icn.png")}
              style={styles.buttonImageStyle}
            />
          </TouchableOpacity>

          <View style={styles.buttonModalImageStyle} />
          <TouchableOpacity
            onPress={() => this.props.closeModal(this.props.infoSend)}
          >
            <Image
              source={require("./../../assets/images/cancel_icn.png")}
              style={styles.buttonImageStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  getFeedContentFromString = (str, rplc_text) => {
    let first_perc = str.indexOf("%");
    let last_perc = str.indexOf("%", first_perc + 1);
    let introduction = str.substr(0, first_perc);
    let ending = str.substr(last_perc + 1, str.length);

    return (
      <Text>
        {introduction}
        <Text>{rplc_text}</Text>
        {ending}
      </Text>
    );
  };

  selectResponse = (question, id) => {
    this.setState(prevState => {
     
      return {
        arrayResponse: id,
        question: question
      };
    });
    // this.props.confermModal( { id,
    //   question})
   
  };

  confirmAnswer = () => {
    if (this.state.arrayResponse) {
      this.props.confermModal(this.state)
    } else {
      this.props.closeModal(this.props.infoSend)
    }
  }

  continueButton = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          paddingTop: 30,
          paddingBottom: 30
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          locations={[0, 1.0]}
          colors={["#7D4D99", "#6497CC"]}
          style={{
            width: Dimensions.get("window").width * 0.4,
            height: 46,
            borderRadius: 23,
            alignItems: "center",
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            elevation: 1
          }}
        >
          <TouchableHighlight
            onPress={() => this.confirmAnswer()}
            style={{
              width: Dimensions.get("window").width * 0.4,
              height: 46,
              borderRadius: 23,
              alignItems: "center"
            }}

            // disabled={this.props.status === "Inviting" ? true : false}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  // margin: 10,
                  color: "#FFFFFF",
                  fontFamily: "OpenSans-Bold",

                  fontSize: 16
                }}
              >
                continua
              </Text>
            </View>
          </TouchableHighlight>
        </LinearGradient>
      </View>
    );
  };

  renderQuestion = (questions) => {
    console.log(questions);

    return questions.map((elem, index) => (
      <TouchableOpacity
        key={index }
        onPress={() => this.selectResponse(elem.question, elem.id)}
        style={[
          styles.categoriesViewList,
          {
            backgroundColor:
              this.state.arrayResponse == elem.id
                ? "#8EC2E6"
                : "#F7F8F9"
          }
        ]}
      >
        <View style={styles.indexResponse}>
          <Text style={styles.indexResponseText}>{index + 1}</Text>
        </View>
        <View style={styles.viewResponse}>
          <Text style={styles.viewResponseText}>{elem.answer}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  renderChoose = (feed) => {
    if (feed.length && feed[0].questions.length) {
      const question = feed[0].questions[0]
      console.log(feed)
      return (
        <View
          style={{
            width: Dimensions.get("window").width * 0.9,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <View style={styles.categories}>
            
  
            <Text style={styles.TopQuestionTitle}>{question.question}</Text>
  
            <View style={{ height: 30 }} />
            {this.renderQuestion(question.answers)}
            {this.continueButton()}
          </View>
        </View>
      );
    } else {
      return(<View/>)
    }
   
  };

  questionWithAnswer = () => {
    if (this.props.infoAlert) {
      return (
        <View
          style={{
            borderRadius: 10,
            alignItems: "center",
  
            flexDirection: "column",
            justifyContent: "space-between",
            alignContent: 'center',
            alignItems: 'center',
            shadowRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.5,
            borderColor: "#7D4D99",
            borderWidth: 4,
  
            width: Dimensions.get("window").width * 0.9,
            backgroundColor: "white",
          }}
        >
          {this.renderChoose(this.props.infoAlert)}
        </View>
      );
    } else {
      return (<View />)
    }
    
  };

  inviteReceive = () => {
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
            width: Dimensions.get("window").width * 0.7,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
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

              source={
                images[
                  this.props.infoAlert ? this.props.infoAlert.user.avatar : 1
                ]
              }
            />
          </View>
          <Image
            source={require("../../assets/images/puntini_big.gif")}
            style={{
              height: 30,
              width: 48,
            }}
          />
          <Image
            style={{
              width: 100,
              height: 100,
            }}
            // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
            source={require("../../assets/images/carpooling_icn.png")}
          />
        </View>

        <View
          style={{
            width: Dimensions.get("window").width * 0.7,
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 15,
          }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 14,
              fontFamily: "OpenSans-Bold",
              textAlign: "center",
            }}
          >
            {this.getFeedContentFromString(
              strings("id_1_41"),
              this.props.infoAlert
                ? this.props.infoAlert.user.username
                : "Mario"
            )}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.confermModal(this.props.infoSend)}
          >
            <Image
              source={require("./../../assets/images/check_green_icn.png")}
              style={styles.buttonImageStyle}
            />
          </TouchableOpacity>

          <View style={styles.buttonModalImageStyle} />
          <TouchableOpacity
            onPress={() => this.props.closeModal(this.props.infoSend)}
          >
            <Image
              source={require("./../../assets/images/cancel_icn.png")}
              style={styles.buttonImageStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  roleCarPooling = () => {
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
        <Image
          style={{
            width: 120,
            height: 120,
            paddingTop: 15,
          }}
          // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
          source={require("../../assets/images/carpooling_icn.png")}
        />

        <View
          style={{
            width: Dimensions.get("window").width * 0.7,
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 15,
          }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 14,
              fontFamily: "OpenSans-Bold",
              textAlign: "center",
            }}
          >
            {strings("id_1_40")}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.confermModal(this.props.infoSend)}
          >
            <LinearGradient
              start={{ x: 0.2, y: 1.0 }}
              end={{ x: 0.8, y: 0.0 }}
              locations={[0, 1.0]}
              colors={["#7D4D99", "#6497CC"]}
              style={{
                padding: 15,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 35,
                width: Dimensions.get("window").width * 0.5,
                // height: 65,
                alignItems: "center",
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "OpenSans-Bold",
                  color: "#fff",
                  fontWeight: "bold",
                  alignContent: "center",
                }}
              >
                {strings("id_1_19")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  alertMetro = () => {
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
        <Image
          style={{
            width: 120,
            height: 120,
            paddingTop: 15,
          }}
          // source={require("../../assets/images/avatars/0Biker1xhdpi.png")}
          source={require("../../assets/images/gps.png")}
        />

        <View
          style={{
            width: Dimensions.get("window").width * 0.7,
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 15,
          }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 14,
              fontFamily: "OpenSans-Bold",
              textAlign: "center",
            }}
          >
            {strings("id_1_17")}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingBottom: 15,
            width: Dimensions.get("window").width * 0.7,
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.closeModal(this.props.infoSend)}
          >
            <LinearGradient
              start={{ x: 0.2, y: 1.0 }}
              end={{ x: 0.8, y: 0.0 }}
              locations={[0, 1.0]}
              colors={["#7D4D99", "#6497CC"]}
              style={{
                padding: 15,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 35,

                // height: 65,
                alignItems: "center",
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "OpenSans-Bold",
                  color: "#fff",
                  fontWeight: "bold",
                  alignContent: "center",
                }}
              >
                {strings('id_1_18')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.confermModal(this.props.infoSend)}
          >
            <LinearGradient
              start={{ x: 0.2, y: 1.0 }}
              end={{ x: 0.8, y: 0.0 }}
              locations={[0, 1.0]}
              colors={["#7D4D99", "#6497CC"]}
              style={{
                padding: 15,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 35,

                // height: 65,
                alignItems: "center",
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "OpenSans-Bold",
                  color: "#fff",
                  fontWeight: "bold",
                  alignContent: "center",
                }}
              >
                {strings('id_1_19')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderCointaner = () => {
    if (this.props.type == "Answers") {
      return this.questionWithAnswer();
    }   else {
      return this.questionWithAnswer();
    }
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
        {this.renderCointaner()}
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
  inputText: {
    // textDecorationColor: '#FFFFFF',
    color: "#D1D1D1",
    flex: 1,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    textAlign: "left",
    fontSize: 12,
    paddingBottom: 8,
    borderBottomColor: "#707070",
    borderBottomWidth: 1
  },
  viewCicle: {
    width: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  first: {
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3,
    backgroundColor: "#fff"
  },
  indexResponse: {
    height: 53,
    width: 40,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  viewResponse: {
    height: 53,
    width: Dimensions.get("window").width * 0.7 - 40,
    flexDirection: "column",
    justifyContent: "center"
  },
  startView: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  categoriesViewList: {
    marginTop: 15,
    width: Dimensions.get("window").width * 0.7,
    height: 53,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: "#F7F8F9",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 1
  },
  rowListTitle: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",

    flexDirection: "row"
  },
  rowList: {
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",

    flexDirection: "row"
  },
  rowListResponse: {
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",

    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8
  },

  categoriesTitleText: {
    //  alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 20,
    // fontWeight: "bold",
    // left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  TopQuestionTitle: {
    fontSize: 15,
    fontFamily: "OpenSans-Bold",
    color: "#707070",
    textAlign: 'center'
  },
  limitImageTitle: {
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    color: "#D5D5D5"
  },
  indexTitle: {
    fontSize: 25,
    fontFamily: "Montserrat-ExtraBold",
    color: "#000000"
  },
  categoriesView: {
    paddingTop: 10,
    paddingBottom: 10,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    flexDirection: "row"
  },
  categories: {
    //height: 20,
    // width: 60,
    paddingTop: 25,
    paddingBottom: 25,
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  categorieText: {
    //  alignSelf: "flex-start",
    // textAlignVertical: "center",
    // textAlign: "left",
    fontSize: 10,
    // fontWeight: "bold",
    // left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#FFFFFF"
  },
  Question: {
    fontSize: 12,
    textAlign: "left",
    // fontWeight: "bold",
    // left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  indexResponseText: {
    fontSize: 15,
    textAlign: "center",
    // fontWeight: "bold",
    // left: 20,
    color: "#000000",
    fontFamily: "Montserrat-ExtraBold"
  },
  viewResponseText: {
    fontSize: 12,
    textAlign: "left",
    // fontWeight: "bold",
    // left: 20,
    color: "#000000",
    fontFamily: "OpenSans-Regular"
  },
  QuestionResponse: {
    fontSize: 12,
    textAlign: "left",
    // fontWeight: "bold",
    // left: 20,
    color: "#707070",
    fontFamily: "OpenSans-Regular"
  },

  other: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3,

    backgroundColor: "#fff"
  },
  lastPadding: {
    flex: 1,
    height: Dimensions.get("window").height * 0.2,
    flexDirection: "row"
  },
  last: {
    flex: 1,
    height: Dimensions.get("window").height * 0.1,
    flexDirection: "row",
    borderTopColor: "#9D9B9C",
    borderTopWidth: 0.3
  },
  leftFrequentRoute: {
    // alignSelf: "center",
    // textAlignVertical: "center",
    // flex: 1,
    fontSize: 15,
    fontWeight: "bold"
    // left: 20
  },
  left: {
    alignSelf: "flex-start",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  leftDescription: {
    alignSelf: "auto",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 11,
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
  sessionFirst: {
    alignSelf: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    height:
      Dimensions.get("window").height * 0.1 > 100
        ? Dimensions.get("window").height * 0.1
        : 100
  },
  right: {
    alignSelf: "center",
    right: 20,
    fontFamily: "OpenSans-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "#3D3D3D"
  },
  rightAndroid: {
    alignSelf: "center",
    right: 10
  },
  rightText: {
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

export default AlertFeedback;
