import React from "react";
import {
  View,
  Text,
  // WebView,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  BackHandler,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import {
  setTypeformUser,
  postTypeform
} from "./../../domains/login/ActionCreators";
import { WebView } from "react-native-webview";
import DeviceInfo from "react-native-device-info";

import { strings, switchLanguage, getLanguageI18n } from "../../config/i18n";

class FeedbackWebView extends React.Component {
  constructor(props) {
    super(props);

    const languageSet = getLanguageI18n();
    console.log(languageSet);

    const indexLanguage = this.convertLanguagesIndex(
      languageSet.substring(0, 2)
    );
    let languagesList = [indexLanguage];
    for (i = 0; i < 8; i++) {
      if (indexLanguage !== i) {
        languagesList = [...languagesList, i];
      }
    }
    console.log(languagesList);

    this.state = {
      can_render: false,
      cookies: { completed: false },
      indexLanguage,
      languagesList
    };
  }

  static navigationOptions = ({ navigation }) => {
    const report = navigation.getParam("report", false);

    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          {report ? "MUV Report" : "MUV Feedback"}
        </Text>
      )
    };
  };

  checkNeededCookies = () => {
    const { cookies } = this.state;
    if (cookies.completed) {
      // form completato

      // switch (this.convertLanguagesLanguage(this.state.indexLanguage)) {
      //   case "it":
      //     this.props.dispatch(
      //       postTypeform({ url: "https://push564474.typeform.com/to/fFflcF" })
      //     );
      //     break;

      //   case "en":
      //     this.props.dispatch(
      //       postTypeform({ url: "https://push564474.typeform.com/to/lmCm8m" })
      //     );
      //     break;

      //   case "es":
      //     this.props.dispatch(
      //       postTypeform({ url: "https://push564474.typeform.com/to/f8W2mU" })
      //     );
      //     break;

      //   case "ct":
      //     this.props.dispatch(
      //       postTypeform({ url: "https://push564474.typeform.com/to/sDqqCZ" })
      //     );
      //     break;

      //   default:
      //     this.props.dispatch(
      //       postTypeform({ url: "https://push564474.typeform.com/to/lmCm8m" })
      //     );
      //     break;
      // }

      this.props.navigation.goBack();
      return true;
    }
  };

  onMessage = event => {
    const { data } = event.nativeEvent;
    const cookies = data.split(";"); // `csrftoken=...; rur=...; mid=...; somethingelse=...`

    cookies.forEach(cookie => {
      const c = cookie.trim().split("=");

      const new_cookies = this.state.cookies;
      new_cookies[c[0]] = c[1];

      this.setState({ cookies: new_cookies });
    });

    console.log("checkNeededCookies");

    this.checkNeededCookies();
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
      case "ca":
        return 5;
        break;
      case "pt":
        return 6;
        break;
      case "br":
        return 7;
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
        return "ca";
        break;
      case 6:
        return "pt";
        break;
      case 7:
        return "br";
        break;
      default:
        return "en";
        break;
    }
  };

  renderItWebView() {
    let removePowered = `setInterval(function(){document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Powered by")&&e.hasAttribute("font-weight")){e.parentElement.parentElement.parentElement.parentElement.style.display="none"}})},1000)`;
    let addHandleFinish = `document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Invia")){if(e.parentElement.parentElement.parentElement!=null&&e.parentElement.parentElement.parentElement.nodeName=="BUTTON"){e.parentElement.parentElement.parentElement.addEventListener("click", function(){window.postMessage(document.cookie='completed=true')})}}})`;
    let finalScript = `${removePowered};${addHandleFinish};`;
    return (
      <WebView
        onLoadEnd={() => {
          setTimeout(() => {
            this.setState({ can_render: true });
          }, 1500);
        }}
        onMessage={this.onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={finalScript}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ActivityIndicator
              style={{ marginTop: 50 }}
              size="large"
              color="#3d3d3d60"
            />
          </View>
        )}
        source={{
          // uri: `http://www.google.com`
          // uri: `https://push564474.typeform.com/to/vBODOz`
          uri: `https://push564474.typeform.com/to/fFflcF?email=${this.props.loginState.username}`
        }}
        style={{
          display: !this.state.can_render ? "none" : "flex"
        }}
      />
    );
  }

  getLinkFeedbackPath = label => {
    switch (label) {
      case "Walking":
        return "https://push564474.typeform.com/to/QagiI9?";
      case "Biking":
        return "https://push564474.typeform.com/to/JL5LKA?";
      case "Public":
      case "Bus":
        return "https://push564474.typeform.com/to/Ivr8MA?";
      case "Train":
        return "https://push564474.typeform.com/to/tgIB5q?";
      case "Metro":
        return "https://push564474.typeform.com/to/T8OTf1?";
      case "Carpooling":
        return "https://push564474.typeform.com/to/QagiI9?";
      case "Multiple":
        return "https://push564474.typeform.com/to/SlGYk2?";
      default:
        return "https://push564474.typeform.com/to/QagiI9?";
    }
  };

  getLinkCityPath = label => {
    switch (label) {
      case "Walking":
        return "https://push564474.typeform.com/to/mvG96e?";
      case "Biking":
        return "https://push564474.typeform.com/to/GVbena?";
      case "Public":
      case "Bus":
        return "https://push564474.typeform.com/to/FOINST?";
      case "Train":
        return "https://push564474.typeform.com/to/FOINST?";
      case "Metro":
        return "https://push564474.typeform.com/to/FOINST?";
      case "Carpooling":
        return "https://push564474.typeform.com/to/mvG96e?";
      case "Multiple":
        return "https://push564474.typeform.com/to/RYdoWL?";
      default:
        return "https://push564474.typeform.com/to/mvG96e?";
    }
  };

  renderEsWebView() {
    const modalType = navigation.getParam("modalType", []);
    const report = navigation.getParam("report", false);
    let link = "https://push564474.typeform.com/to/lmCm8m?";
    if (report) {
      link = this.getLinkCityPath(modalType);
    } else {
      link = this.getLinkFeedbackPath(modalType);
    }
    let removePowered = `setInterval(function(){document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Powered by")&&e.hasAttribute("font-weight")){e.parentElement.parentElement.parentElement.parentElement.style.display="none"}})},1000)`;
    let addHandleFinish = `document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Enviar")){if(e.parentElement.parentElement.parentElement!=null&&e.parentElement.parentElement.parentElement.nodeName=="BUTTON"){e.parentElement.parentElement.parentElement.addEventListener("click", function(){window.postMessage(document.cookie='completed=true')})}}})`;
    let finalScript = `${removePowered};${addHandleFinish};`;
    return (
      <WebView
        onLoadEnd={() => {
          setTimeout(() => {
            this.setState({ can_render: true });
          }, 1500);
        }}
        onMessage={this.onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={finalScript}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ActivityIndicator
              style={{ marginTop: 50 }}
              size="large"
              color="#3d3d3d60"
            />
          </View>
        )}
        source={{
          // uri: `http://www.google.com`
          // uri: `https://push564474.typeform.com/to/vBODOz`
          uri:
            link +
            `email=${this.props.loginState.email}&city=${
              this.props.loginState.infoProfile.city
            }&app_version=${DeviceInfo.getVersion()}`
        }}
        style={{
          display: !this.state.can_render ? "none" : "flex"
        }}
      />
    );
  }
  renderEnWebView() {
    let removePowered = `setInterval(function(){document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Powered by")&&e.hasAttribute("font-weight")){e.parentElement.parentElement.parentElement.parentElement.style.display="none"}})},1000)`;
    let addHandleFinish = `document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Submit")){if(e.parentElement.parentElement.parentElement!=null&&e.parentElement.parentElement.parentElement.nodeName=="BUTTON"){e.parentElement.parentElement.parentElement.addEventListener("click", function(){window.postMessage(document.cookie='completed=true')})}}})`;
    let finalScript = `${removePowered};${addHandleFinish};`;
    return (
      <WebView
        onLoadEnd={() => {
          setTimeout(() => {
            this.setState({ can_render: true });
          }, 1500);
        }}
        onMessage={this.onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={finalScript}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ActivityIndicator
              style={{ marginTop: 50 }}
              size="large"
              color="#3d3d3d60"
            />
          </View>
        )}
        source={{
          // uri: `http://www.google.com`
          // uri: `https://push564474.typeform.com/to/vBODOz`
          uri: `https://push564474.typeform.com/to/f8W2mU?email=${this.props.loginState.username}`
        }}
        style={{
          display: !this.state.can_render ? "none" : "flex"
        }}
      />
    );
  }
  renderCtWebView() {
    let removePowered = `setInterval(function(){document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Powered by")&&e.hasAttribute("font-weight")){e.parentElement.parentElement.parentElement.parentElement.style.display="none"}})},1000)`;
    let addHandleFinish = `document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Enviar")){if(e.parentElement.parentElement.parentElement!=null&&e.parentElement.parentElement.parentElement.nodeName=="BUTTON"){e.parentElement.parentElement.parentElement.addEventListener("click", function(){window.postMessage(document.cookie='completed=true')})}}})`;
    let finalScript = `${removePowered};${addHandleFinish};`;
    return (
      <WebView
        onLoadEnd={() => {
          setTimeout(() => {
            this.setState({ can_render: true });
          }, 1500);
        }}
        onMessage={this.onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={finalScript}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ActivityIndicator
              style={{ marginTop: 50 }}
              size="large"
              color="#3d3d3d60"
            />
          </View>
        )}
        source={
          {
            // uri: `http://www.google.com`
            // uri: `https://push564474.typeform.com/to/vBODOz`
            // uri: ``
          }
        }
        style={{
          display: !this.state.can_render ? "none" : "flex"
        }}
      />
    );
  }

  renderWebViewFromLanguage() {
    switch (this.convertLanguagesLanguage(this.state.indexLanguage)) {
      case "it":
        return this.renderItWebView();
        break;

      case "en":
        return this.renderEnWebView();
        break;

      case "es":
        return this.renderEsWebView();
        break;

      case "ct":
        return this.renderCtWebView();
        break;

      default:
        return this.renderEnWebView();
        break;
    }
  }

  render() {
    console.log(this.state);
    console.log(this.convertLanguagesLanguage(this.state.indexLanguage));
    console.log(this.props);

    // return this.renderWebViewFromLanguage();

    let removePowered = `setInterval(function(){document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Powered by")&&e.hasAttribute("font-weight")){e.parentElement.parentElement.parentElement.parentElement.style.display="none"}})},1000)`;
    let addHandleFinish = `document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Submit")){if(e.parentElement.parentElement.parentElement!=null&&e.parentElement.parentElement.parentElement.nodeName=="BUTTON"){e.parentElement.parentElement.parentElement.addEventListener("click", function(){window.postMessage(document.cookie='completed=true')})}}})`;
    let finalScript = `${removePowered};${addHandleFinish};`;
    const modalType = this.props.navigation.getParam("modalType", []);
    const report = this.props.navigation.getParam("report", false);
    const feedbackMail = this.props.navigation.getParam("feedbackMail", false);
    let link = "https://push564474.typeform.com/to/emvQ07?";

    if (report) {
      link = this.getLinkCityPath(modalType);
    } else if (feedbackMail) {
      link = "https://push564474.typeform.com/to/BAzQzm?";
    } else {
      link = this.getLinkFeedbackPath(modalType);
    }
    return (
     
      <View style={{ flex: 1,}}>
      <WebView
        // onLoadEnd={() => {
        //   setTimeout(() => {
        //     this.setState({ can_render: true });
        //   }, 1500);
        // }}
        onMessage={this.onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={finalScript}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ActivityIndicator
              style={{ marginTop: 50 }}
              size="large"
              color="#3d3d3d60"
            />
          </View>
        )}
        source={{
          uri:
            link + `id_route=${
              this.props.navigation.state.params.referred_route_id
                ? this.props.navigation.state.params.referred_route_id
                : 0
            }&user_agent=${
              this.props.navigation.state.params.device
            }&user_email=${this.props.loginState.email}&city=${this.props.loginState.infoProfile.city}&username=${
              this.props.loginState.infoProfile.username
            }&user_id=${this.props.loginState.infoProfile.id}`
        }}
        
      />
      </View>
      
    );
  }
}

const withData = connect(state => {
  return {
    loginState: state.login
  };
});

export default withData(FeedbackWebView);
