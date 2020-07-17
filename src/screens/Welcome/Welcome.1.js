import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  Button,
  TouchableHighlight,
  ImageBackground
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

class Welcome extends React.Component {
  static navigationOptions = {
    header: null
  };
  // metodo se clicco mi rimanda alla scene con etichetta Home, specificata dentro StackNavigation
  ClickSurvey = () => {
    this.props.navigation.navigate("Home");
  };

  // vedere se mettere l'immagine gia colorata oppure mettere l'immagine con la trasparenza e poi
  // applicare il gradient

  render() {
    return (
      <View>
        <ImageBackground
          source={require("../../assets/images/bg-login.png")}
          style={styles.sfondo}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 1.0]}
            colors={["#7d4d99", "#6497cc"]}
            style={styles.linearGradient}
          >
            <View style={styles.center}>
              <OwnIcon name="MUV_logo" size={80} color="#FFFFFF" />
              <Image
                source={require("../../assets/images/bike-icon.png")}
                style={styles.image}
              />
              <View style={{ alignItems: "center" }}>
                <Text style={{ margin: 10, color: "#FFFFFF" }}> Welcome </Text>
                <Text style={{ margin: 10, color: "#FFFFFF" }}>
                  Descrizione
                </Text>
                <TouchableHighlight
                  onPress={this.ClickSurvey}
                  style={styles.button}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text style={{ color: "#3363AD" }}>Take the survey</Text>
                  </View>
                </TouchableHighlight>
                <Text style={{ margin: 10, color: "#FFFFFF" }}> Skip </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }
}

// elevation: 2 per avere l'ombra su android con versione 5 in su

const styles = {
  sfondo: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  linearGradient: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  image: {
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height / 3
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  button: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: "center",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2
  },
  buttonPrecedente: {
    width: Dimensions.get("window").width / 1.5,
    height: Dimensions.get("window").height / 20,
    backgroundColor: "white",
    alignItems: "center",
    margin: 10
  }
};

export default Welcome;
