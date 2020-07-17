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

  systemVersion = DeviceInfo.getSystemVersion();
  model = DeviceInfo.getModel();
  manufacturer = DeviceInfo.getManufacturer();

class FAQScreen extends React.Component {
  constructor() {
    super();
    this.state = {
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



  TopQuestion = [
    {
      question: "Well, how does it work?",
      response:
        "MUV allows you to track sustainable trips and challenge yourself in various game modes.\nPressing the PLAY button and choosing your preferred transit mode (walking, cycling, public transport) the tracking phase will start. During this phase you will earn points based on the distance travelled and the means of transport chosen. If you have changed means of transport by pressing the PAUSE button you can switch to another mode."
    },
    {
      question: "Why was my trip on public transport not considered valid?",
      response: `We apologise for the inconvenience, as you may have noticed this service is still in beta.\nThe error in validating the trip (unless you cheated) is due to the fact that the GPS point measurements have not found a match with a trip in the OpenStreetMap public transport database that we use as a reference.\nThis can be due to several reasons: lack of coverage or weak GPS signal, poor GPS accuracy of the phone, errors due to lack of lines or stops in a given city.\nAt the moment, we are working on a new algorithm that aims to be faster and more accurate; in the meantime, if you want to help us, report the trip from the dedicated button within the trip summary feed card to let us analyse your use case.`
    },
    Platform.OS === "ios"
      ? {
          question:
            "Why the app, after having tracked me, didn't give me any points at the end of the route? I use an iPhone",
          response:
            'This problem could be due to the non-enabling of ""Motion & Fitness"" tracking. \nSolving it is easy:\nGo to Settings > Privacy > Motion & Fitness, then enable the "Fitness tracking" (if necessary) and do the same for MUV.'
        }
      : manufacturer === "HUAWEI" ||
        manufacturer === "HONOR" ||
        model === "HUAWEI" ||
        model === "HONOR"
      ? {
          question:
            "Why does the app often stop working while it's in the background and I'm tracking a trip? I use an Android Huawei/Honor phone.",
          response:
            'Traditionally Huawei has a problem with managing background processes and this often leads to killings of apps working in background.\nTo solve the problem you need to follow these steps: \nPhone settings > Battery > App launch and then set MUV to "Manage manually" and make sure everything is turned on. '
        }
      : manufacturer === "OnePlus" || model === "OnePlus"
      ? {
          question:
            "Why does the app often stop working while it's in the background and I'm tracking a trip? I use an Android OnePlus phone.",
          response:
            "OnePlus recently introduced one of the most severe background limits on Android devices. Not only users need to enable extra settings to make their apps work properly, but those settings even get randomly reset so users are required to re-enable them on a regular basis.\nTo solve the problem you need to follow these steps: \nOpen the OnePlus multitasking menu, then select the icon at the top right of MUV; as soon as the window opens, select the LOCK option."
        }
      : manufacturer === "Nokia" || model === "Nokia"
      ? {
          question:
            "Why does the app often stop working while it's in the background and I'm tracking a trip? I use an Android Nokia phone.",
          response:
            "Although most of the problems related to stopping background apps were solved in March 2019, some Nokia phones still kill any background process after 20 minutes if the screen is off.\nTo fix this issue, please do the following:\n- Go to Phone settings > Apps > See all apps\n- Tap on the right top corner menu > Show system\n- Find Power saver app in the list, select it and Force close. It will remain stopped for a while, but will restart itself eventually."
        }
      : {
          question:
            "How did I get far fewer points than I usually get when I do the same trip?",
          response:
            "There are two main reasons for this:\n1. MUV trips are validated segment by segment and then, when you press STOP, with a final validation process. If it finds inaccuracies or conflicting data then it may not consider some segments valid and thus reduce the total number of points awarded for the trip.\n2. Each user has a certain number of ideal kms to cover in a sustainable way every day for each transit mode. When this threshold is reached, the point conversion algorithm becomes less rewarding. If you have already done several trips today, it is possible that you already reached this level. "
        }
  ];

  MUVGeneralFeatures = [
    {
      question: "What is MUV?",
      response:
        "MUV stands for Mobility Urban Values and is a platform that aims to improve cities by turning sustainable mobility into a sport and citizens into athletes."
    },
    {
      question: "Who can play?",
      response:
        "The app is completely free and can be downloaded worldwide. For privacy reasons only people over the age of 17 can register an account and start playing."
    },
    {
      question: "What exactly are frequent trips?",
      response:
        "These are the trips you travel daily or multiple days a week. These trips contribute to most of your CO2 emissions, so an improvement in your usual mobility habits can produce a measurable positive impact for your city."
    },
    
    {
      question: "Well, how does it work?",
      response:
        "MUV allows you to track sustainable trips and challenge yourself in various game modes.\nPressing the PLAY button and choosing your preferred transit mode (walking, cycling, public transport) the tracking phase will start. During this phase you will earn points based on the distance travelled and the means of transport chosen. If you have changed means of transport by pressing the PAUSE button you can switch to another mode."
    },
    {
      question: "Why is it important to add frequent trips?",
      response:
        "For us it's essential to know all of your routinely traveling because by analysing such trips, we are able to evaluate your impact in terms of CO2 reductions as well as to estimate the improvement of your sustainable behaviours."
    },
    {
      question: "How is personal data handled?",
      response:
        "All personal data you provide us with is stored, managed and processed in accordance with the GDPR, the EU regulation for the protection of personal data of European citizens. For more information, please refer to our Privacy Policy (https://www.muvapp.eu/muv/privacy-policy.html)."
    }
  ];

  MUVDynamicsFeatures = [
    {
      question: "How do Training Sessions work?",
      response:
        "Training is the simplest game dynamic of MUV, it consists of a series of challenges that the user is required to complete individually. It is divided into 4 levels (Newbie, Rookie, Pro and Star) and each level consists of 4 training sessions.\nIn the ACTIVE section you can see the session currently active and which events you need to complete to finalise it. Once a training session is over, you will be rewarded with some coins and move on to the next one.\nOnce you have completed all the sessions within one level, you will get to the next level.\nWhile the first sessions are free, the following ones have a cost. To unlock them you will have to pay a certain amount of coins."
    },
    {
      question: "What are Special Training Sessions?",
      response:
        "They are special challenges that are launched from time to time among all users in a given city or community. Differently from normal Training Sessions, they are promoted by sponsors who offer gifts and discounts to the winners.\nEach STS has its specific rules, that are explained from time to time directly on the training tab, and a specific lifespan that makes it disappear as it expires. \nNeither Apple nor Google is a sponsor of the Special Training Sessions."
    },
    {
      question: "How do I enroll in a Special Training Session?",
      response:
        "You receive a notification when a new STS is available. You can enroll by selecting it and then doing SLIDE TO ACCEPT.\nThen, the STS will be added to the ACTIVE section and you'll be officially on board."
    },
    {
      question: "How can I redeem my Rewards?",
      response:
        "Every time you complete a Special Training Session, you get the reward mentioned. You will find it in the REWARDS section; to redeem it, follow the instructions on the given card.\nEach reward has a validity date after which it is no longer possible to redeem it, however, it will remain in the app even after its expiration."
    },
    {
      question: "How do Weekly Challenges work?",
      response:
        "The Weekly Challenge is the main game dynamic of MUV. The goal is to score  as many points as possible on a weekly basis: Monday to Sunday.\nEach user plays two challenges, the one among users in their own city and the global one among all MUV users.\nAt the end of each week the top three in the ranking for any challenge are rewarded with gold, silver and bronze trophies respectively."
    },
    {
      question: "What are trophies and where do I find them?",
      response:
        "Trophies are virtual rewards (badges) and are given to players who each week reach the top three of the weekly city and global rankings.\nThey are collected in the TROPHIES section."
    },
    {
      question: "How does the Sustainable City Tournament work?",
      response:
        "The Sustainable City Tournament is the first international competition among cities aimed at awarding the most sustainable one.\nThe selected cities compete in 1vs1 weekly matches, from Monday to Sunday, according to a schedule set up at the start of the tournament. The team that scores the most points wins the game and advances in the ranking.\nAt the end of the regular season, the best ranked teams will qualify for the final phase, the playoffs, where they will compete for the title of champion through a series of knockout matches."
    },
    {
      question: "How do Tournament matches work?",
      response:
        "Each match has a weekly duration and at the end the city with the most points wins.\nPoints are calculated by adding to those scored by the best 3 players the average of the remaining ones. By clicking on the LIVE button during a match you can see the points scored by each player."
    },
    {
      question: "What happens if my city wins the Tournament?",
      response:
        "If your team wins the Sustainable City Tournamen in addition to glory, there could be rewards for the best players who have led their city to triumph offered .\nIn the BEST PLAYERS section you will find all the players who at least once have ended up in the weekly top 3 of their own city and, depending on their position in this particular ranking, they will receive gifts or discounts in the event of a final victory of the city.\nNeither Apple nor Google is a sponsor of the Sustainable City Tournament."
    }
  ];

  SolvingCommonProblems = [
    {
      question:
        "Why does the app often stop working while it's in the background and I'm tracking a trip? I use an Android Huawei/Honor phone.",
      response:
        'Traditionally Huawei has a problem with managing background processes and this often leads to killings of apps working in background.\nTo solve the problem you need to follow these steps: \nPhone settings > Battery > App launch and then set MUV to "Manage manually" and make sure everything is turned on. '
    },
    {
      question:
        "Why does the app often stop working while it's in the background and I'm tracking a trip? I use an Android OnePlus phone.",
      response:
        "OnePlus recently introduced one of the most severe background limits on Android devices. Not only users need to enable extra settings to make their apps work properly, but those settings even get randomly reset so users are required to re-enable them on a regular basis.\nTo solve the problem you need to follow these steps: \nOpen the OnePlus multitasking menu, then select the icon at the top right of MUV; as soon as the window opens, select the LOCK option."
    },
    {
      question:
        "Why does the app often stop working while it's in the background and I'm tracking a trip? I use an Android Nokia phone.",
      response:
        "Although most of the problems related to stopping background apps were solved in March 2019, some Nokia phones still kill any background process after 20 minutes if the screen is off.\nTo fix this issue, please do the following:\n- Go to Phone settings > Apps > See all apps\n- Tap on the right top corner menu > Show system\n- Find Power saver app in the list, select it and Force close. It will remain stopped for a while, but will restart itself eventually."
    },
    {
      question:
        "Why the app, after having tracked me, didn't give me any points at the end of the route? I use an iPhone",
      response:
        'This problem could be due to the non-enabling of ""Motion & Fitness"" tracking. \nSolving it is easy:\nGo to Settings > Privacy > Motion & Fitness, then enable the "Fitness tracking" (if necessary) and do the same for MUV.'
    },
    {
      question: "Why was my walking route not considered valid?",
      response: `It's actually quite unusual, try checking if you've enabled location services in particular:\nGo to Settings > Privacy > Location Services, scroll down to find MUV and then tap the app and select the option "While Using the App" or Always".`
    },
    {
      question: "Why was my trip by bicycle not considered valid?",
      response: `The problem may be due to the high speed you have reached. In this case the activity recognition algorithm may have considered you as "in vehicle" even if you were not.\nTo receive additional support, please send us feedback from the dedicated button within the trip summary feed card.`
    },
    {
      question: "Why was my trip on public transport not considered valid?",
      response: `We apologise for the inconvenience, as you may have noticed this service is still in beta.\nThe error in validating the trip (unless you cheated) is due to the fact that the GPS point measurements have not found a match with a trip in the OpenStreetMap public transport database that we use as a reference.\nThis can be due to several reasons: lack of coverage or weak GPS signal, poor GPS accuracy of the phone, errors due to lack of lines or stops in a given city.\nAt the moment, we are working on a new algorithm that aims to be faster and more accurate; in the meantime, if you want to help us, report the trip from the dedicated button within the trip summary feed card to let us analyse your use case.`
    },
    {
      question:
        "How did I get far fewer points than I usually get when I do the same trip?",
      response:
        "There are two main reasons for this:\n1. MUV trips are validated segment by segment and then, when you press STOP, with a final validation process. If it finds inaccuracies or conflicting data then it may not consider some segments valid and thus reduce the total number of points awarded for the trip.\n2. Each user has a certain number of ideal kms to cover in a sustainable way every day for each transit mode. When this threshold is reached, the point conversion algorithm becomes less rewarding. If you have already done several trips today, it is possible that you already reached this level. "
    }
  ];

  MUVCategories = [
    "MUV General Features",
    "MUV Game Dynamics",
    "Solving Common Problems"
  ];

  dataScroll = [
    {
      type: "search",
      faq: this.MUVCategories
    },
    {
      type: "list",
      indexStart: 0,
      title: "TOP QUESTIONS 🔝",
      faq: this.TopQuestion
    },
    {
      type: "list",
      indexStart: 3,
      title: "MUV General Features",
      faq: this.MUVGeneralFeatures
    },
    {
      type: "list",
      indexStart: 9,
      title: "MUV Game Dynamics & Rules",
      faq: this.MUVDynamicsFeatures
    },
    {
      type: "list",
      indexStart: 18,
      title: " Solving Common Problems",
      faq: this.SolvingCommonProblems
    },
    {
      type: "last"
    }
  ];

  renderCategoria = categorie => {
    return (
      <View style={styles.categories}>
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
          {"FAQ"}
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

  renderSearch = list => {
    return (
      <View style={styles.categories}>
        <View
          style={{
            paddingTop: 25,
            paddingBottom: 10
          }}
        >
          <Text style={styles.categoriesTitleText}>How can we help you?</Text>
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
              <TouchableOpacity onPress={() => this.scroll(indexElement + 2)}>
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

  paddingEnd = () => {
    return <View style={{ height: 200 }} />;
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
          data={this.dataScroll}
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
