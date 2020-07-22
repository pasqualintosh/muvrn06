/**
 * scena per il riassunto delle domande più frequenti
 * @author push
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Alert,
  Platform,
  Linking,
  NativeModules,
  FlatList
} from "react-native";
import DeviceInfo from "react-native-device-info";

import { strings } from "../../config/i18n";
import Icon from "react-native-vector-icons/Ionicons";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);



class FAQScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      dataScroll: [],
      test: false,
      statusQuestion: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]
    };
  }

  componentWillMount = async () => {
    systemVersion = DeviceInfo.getSystemVersion();
model = DeviceInfo.getModel();
manufacturer = await DeviceInfo.getManufacturer();

TopQuestion = [
  {
    question: strings("id_12_05"),
    response: strings("id_12_06")
  },
  {
    question: strings("id_12_31"),
    response: strings("id_12_32")
  },
  Platform.OS === "ios"
    ? {
        question: strings("id_12_25"),
        response: strings("id_12_26")
      }
    : manufacturer === "HUAWEI" ||
      manufacturer === "HONOR" ||
      model === "HUAWEI" ||
      model === "HONOR"
    ? {
        question: strings("id_12_19"),
        response: strings("id_12_20")
      }
    : manufacturer === "OnePlus" || model === "OnePlus"
    ? {
        question: strings("id_12_21"),
        response: strings("id_12_22")
      }
    : manufacturer === "Nokia" || model === "Nokia"
    ? {
        question: strings("id_12_23"),
        response: strings("id_12_24")
      }
    : {
        question: strings("id_12_25"),
        response: strings("id_12_26")
      }
];

MUVGeneralFeatures = [
  {
    question: strings("id_12_01"),
    response: strings("id_12_02")
  },
  {
    question: strings("id_12_03"),
    response: strings("id_12_04")
  },
  {
    question: strings("id_12_05"),
    response: strings("id_12_06")
  },
  {
    question: strings("id_12_07"),
    response: strings("id_12_08")
  },
  {
    question: strings("id_12_09"),
    response: strings("id_12_10")
  },
  {
    question: strings("id_12_11"),
    response: strings("id_12_12")
  }
];

MUVDynamicsFeatures = [
  {
    question: strings("id_12_13"),
    response: strings("id_12_14")
  },
  {
    question: strings("id_12_15"),
    response: strings("id_12_16")
  },
  // {
  //   question: "How do I enroll in a Special Training Session?",
  //   response:
  //     "You receive a notification when a new STS is available. You can enroll by selecting it and then doing SLIDE TO ACCEPT.\nThen, the STS will be added to the ACTIVE section and you'll be officially on board."
  // },
  {
    question: strings("id_12_17"),
    response: strings("id_12_18")
  }
  // {
  //   question: "How do Weekly Challenges work?",
  //   response:
  //     "The Weekly Challenge is the main game dynamic of MUV. The goal is to score  as many points as possible on a weekly basis: Monday to Sunday.\nEach user plays two challenges, the one among users in their own city and the global one among all MUV users.\nAt the end of each week the top three in the ranking for any challenge are rewarded with gold, silver and bronze trophies respectively."
  // },
  // {
  //   question: "What are trophies and where do I find them?",
  //   response:
  //     "Trophies are virtual rewards (badges) and are given to players who each week reach the top three of the weekly city and global rankings.\nThey are collected in the TROPHIES section."
  // },
  // {
  //   question: "How does the Sustainable City Tournament work?",
  //   response:
  //     "The Sustainable City Tournament is the first international competition among cities aimed at awarding the most sustainable one.\nThe selected cities compete in 1vs1 weekly matches, from Monday to Sunday, according to a schedule set up at the start of the tournament. The team that scores the most points wins the game and advances in the ranking.\nAt the end of the regular season, the best ranked teams will qualify for the final phase, the playoffs, where they will compete for the title of champion through a series of knockout matches."
  // },
  // {
  //   question: "How do Tournament matches work?",
  //   response:
  //     "Each match has a weekly duration and at the end the city with the most points wins.\nPoints are calculated by adding to those scored by the best 3 players the average of the remaining ones. By clicking on the LIVE button during a match you can see the points scored by each player."
  // },
  // {
  //   question: "What happens if my city wins the Tournament?",
  //   response:
  //     "If your team wins the Sustainable City Tournamen in addition to glory, there could be rewards for the best players who have led their city to triumph offered .\nIn the BEST PLAYERS section you will find all the players who at least once have ended up in the weekly top 3 of their own city and, depending on their position in this particular ranking, they will receive gifts or discounts in the event of a final victory of the city.\nNeither Apple nor Google is a sponsor of the Sustainable City Tournament."
  // }
];

SolvingCommonProblems = [
  // {
  //   question:
  //     "Why does the app often stop working while it's in the background and I'm tracking a trip? I use an Android Huawei/Honor phone.",
  //   response:
  //     'Traditionally Huawei has a problem with managing background processes and this often leads to killings of apps working in background.\nTo solve the problem you need to follow these steps: \nPhone settings > Battery > App launch and then set MUV to "Manage manually" and make sure everything is turned on. '
  // },
  // {
  //   question:
  //     "Why does the app often stop working while it's in the background and I'm tracking a trip? I use an Android OnePlus phone.",
  //   response:
  //     "OnePlus recently introduced one of the most severe background limits on Android devices. Not only users need to enable extra settings to make their apps work properly, but those settings even get randomly reset so users are required to re-enable them on a regular basis.\nTo solve the problem you need to follow these steps: \nOpen the OnePlus multitasking menu, then select the icon at the top right of MUV; as soon as the window opens, select the LOCK option."
  // },

  {
    question: strings("id_12_19"),
    response: strings("id_12_20")
  },
  {
    question: strings("id_12_21"),
    response: strings("id_12_22")
  },
  {
    question: strings("id_12_23"),
    response: strings("id_12_24")
  },
  {
    question: strings("id_12_25"),
    response: strings("id_12_26")
  },
  {
    question: strings("id_12_27"),
    response: strings("id_12_28")
  },
  {
    question: strings("id_12_29"),
    response: strings("id_12_30")
  },
  {
    question: strings("id_12_31"),
    response: strings("id_12_32")
  },
  // {
  //   question: strings("id_12_33"),
  //   response: strings("id_12_34")
  // },
  {
    question: strings("id_12_35"),
    response: strings("id_12_36")
  },
  {
    question: strings("id_12_37"),
    response: strings("id_12_38")
  }
];

MUVCategories = [
  strings("id_12_40"),
  strings("id_12_41"),
  strings("id_12_42")
];

dataScroll = [
  {
    type: "search",
    faq:MUVCategories
  },
  {
    type: "list",
    indexStart: 0,
    title: strings("id_12_39"),
    faq: TopQuestion
  },
  {
    type: "list",
    indexStart: 3,
    title: strings("id_12_40"),
    faq: MUVGeneralFeatures
  },
  {
    type: "list",
    indexStart: 9,
    title: strings("id_12_41"),
    faq: MUVDynamicsFeatures
  },
  {
    type: "list",
    indexStart: 18,
    title: strings("id_12_42"),
    faq: SolvingCommonProblems
  },
  {
    type: "last"
  }
];

this.setState({ dataScroll})

  }

  

  renderCategoria = (categorie, index) => {
    return (
      <View style={styles.categories} key={index}>
        <View style={styles.categoriesViewList}>
          <View style={styles.rowListTitle}>
            <Text style={styles.TopQuestionTitle}>{categorie.title}</Text>
          </View>
        </View>
        {this.renderQuestion(categorie.faq, categorie.indexStart)}
      </View>
    );
  };

  renderQuestion = (questions, indexStart) => {
    return questions.map((elem, index) => (
      <TouchableOpacity
        key={index + indexStart}
        onPress={() => this.openQuestion(index + indexStart)}
      >
        <View style={styles.categoriesViewList}>
          <View style={styles.rowList}>
            <View style={styles.viewCicle}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "#5FC4E2",
                  borderRadius: 3,
                  opacity: this.state.statusQuestion[index + indexStart] ? 0 : 1
                }}
              />
            </View>
            <View style={{ width: Dimensions.get("window").width * 0.9 - 50 }}>
              <Text style={styles.Question}>{elem.question}</Text>
            </View>
          </View>
          {this.state.statusQuestion[index + indexStart] ? (
            <View>
              <View style={styles.rowListResponse}>
                <View style={styles.viewCicle}>
                  <View
                    style={{
                      width: 6,
                      flex: 1,
                      backgroundColor: "#5FC4E2",
                      borderRadius: 3
                    }}
                  />
                </View>
                <View
                  style={{ width: Dimensions.get("window").width * 0.9 - 50 }}
                >
                  <Text style={styles.QuestionResponse}>{elem.response}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
    ));
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("id_12_43")}
        </Text>
      )
    };
  };

  openQuestion = (index = 0) => {
    let NewState = this.state.statusQuestion;
    NewState[index] = !NewState[index];
    this.setState({
      statusQuestion: NewState
    });
  };

  renderDynamics = () => {
    return this.MUVDynamicsFeatures.map((elem, index) => (
      <TouchableOpacity
        key={index + 5}
        onPress={() => this.openQuestion(index + 5)}
      >
        <View style={styles.categoriesViewList}>
          <View style={styles.rowList}>
            <View style={styles.viewCicle}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "#5FC4E2",
                  borderRadius: 3,
                  opacity: this.state.statusQuestion[index + 5] ? 0 : 1
                }}
              />
            </View>
            <View style={{ width: Dimensions.get("window").width * 0.9 - 50 }}>
              <Text style={styles.Question}>{elem.question}</Text>
            </View>
          </View>
          {this.state.statusQuestion[index + 5] ? (
            <View>
              <View style={styles.rowListResponse}>
                <View style={styles.viewCicle}>
                  <View
                    style={{
                      width: 6,
                      flex: 1,
                      backgroundColor: "#5FC4E2",
                      borderRadius: 3
                    }}
                  />
                </View>
                <View
                  style={{ width: Dimensions.get("window").width * 0.9 - 50 }}
                >
                  <Text style={styles.QuestionResponse}>{elem.response}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
    ));
  };
  renderProblem = () => {
    return this.SolvingCommonProblems.map((elem, index) => (
      <TouchableOpacity
        key={index + 14}
        onPress={() => this.openQuestion(index + 14)}
      >
        <View style={styles.categoriesViewList}>
          <View style={styles.rowList}>
            <View style={styles.viewCicle}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "#5FC4E2",
                  borderRadius: 3,
                  opacity: this.state.statusQuestion[index + 14] ? 0 : 1
                }}
              />
            </View>
            <View style={{ width: Dimensions.get("window").width * 0.9 - 50 }}>
              <Text style={styles.Question}>{elem.question}</Text>
            </View>
          </View>
          {this.state.statusQuestion[index + 14] ? (
            <View>
              <View style={styles.rowListResponse}>
                <View style={styles.viewCicle}>
                  <View
                    style={{
                      width: 6,
                      flex: 1,
                      backgroundColor: "#5FC4E2",
                      borderRadius: 3
                    }}
                  />
                </View>
                <View
                  style={{ width: Dimensions.get("window").width * 0.9 - 50 }}
                >
                  <Text style={styles.QuestionResponse}>{elem.response}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
    ));
  };

  renderGeneral = () => {
    return this.MUVGeneralFeatures.map((elem, index) => (
      <TouchableOpacity key={index} onPress={() => this.openQuestion(index)}>
        <View style={styles.categoriesViewList}>
          <View style={styles.rowList}>
            <View style={styles.viewCicle}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "#5FC4E2",
                  borderRadius: 3,
                  opacity: this.state.statusQuestion[index] ? 0 : 1
                }}
              />
            </View>
            <View style={{ width: Dimensions.get("window").width * 0.9 - 50 }}>
              <Text style={styles.Question}>{elem.question}</Text>
            </View>
          </View>
          {this.state.statusQuestion[index] ? (
            <View>
              <View style={styles.rowListResponse}>
                <View style={styles.viewCicle}>
                  <View
                    style={{
                      width: 6,
                      flex: 1,
                      backgroundColor: "#5FC4E2",
                      borderRadius: 3
                    }}
                  />
                </View>
                <View
                  style={{ width: Dimensions.get("window").width * 0.9 - 50 }}
                >
                  <Text style={styles.QuestionResponse}>{elem.response}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
    ));
  };

  scroll = indexElement => {
    if (this.FAQScrollView) {
      this.FAQScrollView.scrollToIndex({ index: indexElement });
    }
  };

  renderSearch = (list, index) => {
    return (
      <View style={styles.categories} key={index}>
        <View
          style={{
            paddingTop: 25,
            paddingBottom: 10
          }}
        >
          <Text style={styles.categoriesTitleText}>{strings("id_12_44")}</Text>
        </View>

        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            justifyContent: "center",
            flexDirection: "row"
          }}
          showsHorizontalScrollIndicator={false}
          style={{
            // backgroundColor: "red",
            paddingTop: 15,
            paddingBottom: 15,
            width: Dimensions.get("window").width,

            width: Dimensions.get("window").width
          }}
        >
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            {list.map((search, indexElement) => (
              <TouchableOpacity onPress={() => this.scroll(indexElement + 2)} key={indexElement}>
                <View style={styles.categorie}>
                  <Text style={styles.categorieText}>{search}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  paddingEnd = (index) => {
    return <View style={{ height: 200 }} key={index}/>;
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: "#fff"
        }}
      >
        <FlatList
          style={{
            backgroundColor: "#fff",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width
          }}
          showsVerticalScrollIndicator={false}
          // scrollEventThrottle={10}

          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          // onScroll={this.handleScroll.bind(this)}
          ref={ref => (this.FAQScrollView = ref)}
          // initialScrollIndex={this.state.index}
          keyExtractor={(item, index) => index.toString()}
          // onScrollEndDrag={this.handleScrollHeader.bind(this)}
          data={this.state.dataScroll}
          renderItem={({ item, index }) => {
            console.log(item);
            if (item.type == "search") {
              return this.renderSearch(item.faq, index);
            } else if (item.type == "list") {
              return this.renderCategoria(item, index);
            } else {
              return this.paddingEnd(index);
            }
          }}
        />
      </View>
    );
  }
}

export default FAQScreen;

const styles = StyleSheet.create({
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
  categories: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  categoriesViewList: {
    paddingTop: 15,
    paddingBottom: 15,
    width: Dimensions.get("window").width,
    justifyContent: "flex-start",
    flexDirection: "column",
    borderBottomColor: "#9D9B9C",
    borderBottomWidth: 0.3
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
    // textAlignVertical: "center",
    // textAlign: "left",
    fontSize: 12,
    // fontWeight: "bold",
    // left: 20,
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  TopQuestionTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-ExtraBold",
    color: "#3D3D3D"
  },
  categoriesView: {
    paddingTop: 10,
    paddingBottom: 10,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    flexDirection: "row"
  },
  categorie: {
    //height: 20,
    // width: 60,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#5FC4E2",
    borderRadius: 15
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
