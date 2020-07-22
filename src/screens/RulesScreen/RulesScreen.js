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
  FlatList,
  ActivityIndicator
} from "react-native";

import { strings } from "../../config/i18n";
import Icon from "react-native-vector-icons/Ionicons";
import Settings from "./../../config/Settings";

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";
import { WebView } from "react-native-webview";

let Tracker = new GoogleAnalyticsTracker(Settings.analyticsCode);

import analytics from "@react-native-firebase/analytics";
async function trackScreenView(screen) {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
}

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);



class RulesScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      rules: [
        {
          title:
            "Maecenas sed diam Eget risus varius blandit sit amet non magna.",
          description:
            "Etiam porta sem malesuada magna mollis euismod. Sed posuere consectetur est at lobortis. Nulla vitae elit libero, a pharetra augue. Donec sed odio dui. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum."
        }
      ]
    };
  }

  componentWillMount() {
    Tracker.trackScreenView("RulesScreen.js");
    trackScreenView("RulesScreen.js");


  }

  renderRules = object => {
    return (
      <View style={styles.categories}>
        <View style={styles.categoriesViewList}>
          <Text style={styles.title}>{object.title}</Text>
          <Text style={styles.description}>{object.description}</Text>
        </View>
      </View>
    );
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {"Rules"}
        </Text>
      )
    };
  };

  paddingEnd = () => {
    return <View style={{ height: 200 }} />;
  };

  render() {
    // return (
    //   <View
    //     style={{
    //       backgroundColor: "#fff"
    //     }}
    //   >
    //     <FlatList
    //       style={{
    //         backgroundColor: "#fff",
    //         height: Dimensions.get("window").height,
    //         width: Dimensions.get("window").width
    //       }}
    //       showsVerticalScrollIndicator={false}
    //       // scrollEventThrottle={10}

    //       showsVerticalScrollIndicator={false}
    //       onScrollToIndexFailed={() => {}}
    //       // onScroll={this.handleScroll.bind(this)}
    //       ref={ref => (this.FAQScrollView = ref)}
    //       // initialScrollIndex={this.state.index}
    //       keyExtractor={(item, index) => index.toString()}
    //       // onScrollEndDrag={this.handleScrollHeader.bind(this)}
    //       data={this.state.rules}
    //       renderItem={({ item, index }) => {
    //         console.log(item);
    //         if (index == this.state.rules.length - 1) {
    //           return (
    //             <View>
    //               {this.renderRules(item)}
    //               {this.paddingEnd()}
    //             </View>
    //           );
    //         } else {
    //           return this.renderRules(item);
    //         }
    //       }}
    //     />
    //   </View>
    // );
   
   
      return (
        <View
          style={{
            backgroundColor: "#000000",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
        >
          <View style={{ flex: 1, backgroundColor: "black" }}>
            <WebView
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={ () =>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ActivityIndicator
             
              size="large"
              color="#3d3d3d60"
            />
          </View>
        }
              source={{
                uri: strings('id_19_03')
              }}
              mediaPlaybackRequiresUserAction={false}
            />
          </View>
        </View>
      );
  }
}

export default RulesScreen;

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
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "flex-start",
    flexDirection: "column"
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
  title: {
    fontSize: 15,
    textAlign: "left",
    fontFamily: "OpenSans-Bold",
    color: "#3D3D3D"
  },
  description: {
    fontSize: 15,
    textAlign: "left",
    fontFamily: "OpenSans-Regular",
    color: "#3D3D3D"
  },
  categoriesTitleText: {
    fontSize: 12,

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
