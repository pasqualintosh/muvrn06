/**
 * scena per il riassunto dei dati dell'utente
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
  Platform
} from "react-native";

import { createSelector } from "reselect";

import { strings, switchLanguage, getLanguageI18n } from "../../config/i18n";

import { connect } from "react-redux";

import LogOut from "../../components/LogOut/LogOut";

import { setLanguage } from "../../domains/login/ActionCreators";

class LanguagesScreen extends React.Component {
  constructor() {
    super();

    // getLanguage() - to get the current displayed language
    // getInterfaceLanguage() - to get the current device interface language
    // setLanguage(languageCode) - to force manually a particular language
    // console.log(strings.getLanguage());
    // console.log(strings.getInterfaceLanguage());

    const languageSet = getLanguageI18n();
    console.log(languageSet);

    const indexLanguage = this.convertLanguagesIndex(
      languageSet.substring(0, 2)
    );
    let languagesList = [indexLanguage];
    for (i = 0; i < 11; i++) {
      if (indexLanguage !== i) {
        languagesList = [...languagesList, i];
      }
    }
    console.log(languagesList);
    this.state = {
      indexLanguage,
      languagesList
    };
  }

  onPressLanguage = languageIndex => {
    Alert.alert(
      strings("change_language"),
      strings("the_app_will_re"),
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => this.setLanguage(languageIndex)
        }
      ],
      { cancelable: false }
    );
  };

  setLanguage = languageIndex => {
    const language = this.convertLanguagesLanguage(languageIndex);

    console.log(languageIndex);
    console.log(language);

    switchLanguage(language, this);
    this.setState({
      indexLanguage: languageIndex
    });
    this.props.dispatch(setLanguage(language));
    // strings.setLanguage(language);
    // this.forceUpdate();
  };

  // associo una lingua a un indice utile per prendere la lingua o stringa corrispondente
  convertLanguagesIndex = prefLang => {
    switch (prefLang) {
      case "en":
        return 0;
        break;
      case "nl":
        return 1;
        break;
      case "sv":
        return 2;
        break;
      case "es":
        return 3;
        break;
      case "it":
        return 4;
        break;
      case "ct":
        return 5;
        break;
      case "pt":
        return 6;
        break;
      case "br":
        return 7;
      case "rs":
        return 8;
      case "pl":
        return 9;
      case "de":
        return 10;
        break;
      default:
        return 0;
        break;
    }
  };

  // da index a lingua
  convertLanguagesLanguage = indexLang => {
    switch (indexLang) {
      case 0:
        return "en";
        break;
      case 1:
        return "nl";
        break;
      case 2:
        return "sv";
        break;
      case 3:
        return "es";
        break;
      case 4:
        return "it";
        break;
      case 5:
        return "ct";
        break;
      case 6:
        return "pt";
        break;
      case 7:
        return "br";
        break;
      case 8:
        return "rs";
        break;
      case 9:
        return "pl";
        break;
      case 10:
        return "de";
        break;
      default:
        return "en";
        break;
    }
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {strings("change_muv_lang")}
        </Text>
      )
      // headerRight: <LogOut />
    };
  };

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const stringsLanguage = [
      strings("english"),
      strings("dutch"),
      strings("finnish"),
      strings("spanish"),
      strings("italian"),
      strings("catalan"),
      strings("portuguese"),
      strings("brazilian"),
      strings("serbian"),
      "Polish",
      "Deutsch"
    ];
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
          {this.state.languagesList.map(language => (
            <TouchableOpacity
              key={language}
              onPress={() => this.onPressLanguage(language)}
            >
              <View style={styles.other}>
                <Text
                  style={[
                    styles.Left,
                    language === this.state.indexLanguage
                      ? { fontWeight: "bold" }
                      : {}
                  ]}
                >
                  {stringsLanguage[language]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 200 }} />
        </ScrollView>
      </View>
    );
  }
}

const getLanguage = state => state.login.language;

// prendo la lingua
const getLanguageState = createSelector(
  [getLanguage],
  language => (language ? language : "")
);

const withData = connect(state => {
  return {
    language: getLanguageState(state)
  };
});

export default withData(LanguagesScreen);

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
    borderTopColor: "#5F5F5F",
    borderTopWidth: 0.3,
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
