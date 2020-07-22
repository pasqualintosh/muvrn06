import React from "react";
import {
  View,
  Text,
  WebView,
  ActivityIndicator,
  Platform,
  BackHandler
} from "react-native";
import { connect } from "react-redux";
import {
  setTypeformUser,
  postTypeform,
  setSoddfrustValue
} from "./../../domains/login/ActionCreators";

import { strings, switchLanguage, getLanguageI18n } from "../../config/i18n";

class SurveyWebView extends React.Component {
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
    return {
      headerTitle: (
        <Text
          style={{
            left: Platform.OS == "android" ? 20 : 0
          }}
        >
          Typeform
        </Text>
      )
    };
  };

  checkNeededCookies = () => {
    const { cookies } = this.state;
    // console.log(cookies);
    // if (cookies.completed) {
    // form completato

    switch (this.convertLanguagesLanguage(this.state.indexLanguage)) {
      case "it":
        this.props.dispatch(
          postTypeform({ url: "https://push564474.typeform.com/to/MZ9X5A" })
        );
        this.props.dispatch(setSoddfrustValue());
        this.props.navigation.goBack();
        break;

      // case "en":
      //   this.props.dispatch(
      //     postTypeform({ url: "https://push564474.typeform.com/to/QLSZGR" })
      //   );
      //   this.props.dispatch(setSoddfrustValue());
      //   this.props.navigation.goBack();
      //   break;

      // case "es":
      //   this.props.dispatch(
      //     postTypeform({ url: "https://push564474.typeform.com/to/il3UpA" })
      //   );
      //   this.props.dispatch(setSoddfrustValue());
      //   this.props.navigation.goBack();
      //   break;

      default:
        this.props.dispatch(
          postTypeform({ url: "https://push564474.typeform.com/to/MZ9X5A" })
        );
        this.props.navigation.goBack();
        break;
        // }

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
          uri: `https://push564474.typeform.com/to/MZ9X5A?user_email=${this.props.loginState.username}`
        }}
        style={{
          display: !this.state.can_render ? "none" : "flex"
        }}
      />
    );
  }
  renderEsWebView() {
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
          uri: `https://push564474.typeform.com/to/il3UpA?email=${this.props.loginState.username}`
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
          uri: `https://push564474.typeform.com/to/QLSZGR?email=${this.props.loginState.username}`
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
        source={{
          // uri: `http://www.google.com`
          // uri: `https://push564474.typeform.com/to/vBODOz`
          uri: `https://push564474.typeform.com/to/sDqqCZ?email=${this.props.loginState.username}`
        }}
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
    return this.renderWebViewFromLanguage();

    // let removePowered = `setInterval(function(){document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Powered by")&&e.hasAttribute("font-weight")){e.parentElement.parentElement.parentElement.parentElement.style.display="none"}})},1000)`;
    // let addHandleFinish = `document.querySelectorAll("div").forEach(function(e){if(e.innerHTML.includes("Submit")){if(e.parentElement.parentElement.parentElement!=null&&e.parentElement.parentElement.parentElement.nodeName=="BUTTON"){e.parentElement.parentElement.parentElement.addEventListener("click", function(){window.postMessage(document.cookie='completed=true')})}}})`;
    // let finalScript = `${removePowered};${addHandleFinish};`;
    // return (
    //   <WebView
    //     onLoadEnd={() => {
    //       setTimeout(() => {
    //         this.setState({ can_render: true });
    //       }, 1500);
    //     }}
    //     onMessage={this.onMessage}
    //     javaScriptEnabled={true}
    //     domStorageEnabled={true}
    //     injectedJavaScript={finalScript}
    //     startInLoadingState={true}
    //     renderLoading={() => (
    //       <View style={{ flex: 1, backgroundColor: "#fff" }}>
    //         <ActivityIndicator
    //           style={{ marginTop: 50 }}
    //           size="large"
    //           color="#3d3d3d60"
    //         />
    //       </View>
    //     )}
    //     source={{
    //       // uri: `http://www.google.com`
    //       uri: `https://push564474.typeform.com/to/vBODOz`
    //       // uri: `https://push564474.typeform.com/to/xXBrq0?email=${
    //       //   this.props.loginState.username
    //       // }`
    //     }}
    //     style={{
    //       display: !this.state.can_render ? "none" : "flex"
    //     }}
    //   />
    // );
  }
}

const withData = connect(state => {
  return {
    loginState: state.login
  };
});

export default withData(SurveyWebView);
