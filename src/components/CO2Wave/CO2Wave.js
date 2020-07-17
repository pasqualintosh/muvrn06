// componente per visualizzare un onda che permette di invitare degli amici

import React from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Platform,
  ImageBackground,
  Linking,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";

import { strings } from "../../config/i18n";
import AutoAnimation from "./../../components/AutoAnimation/AutoAnimation";


import { styles } from "./Style";




import Aux from "./../../helpers/Aux";




class CO2Wave extends React.PureComponent {
  

  

  
  componentWillMount() {
    // this.generateShortUrl();
  }

 
  constructor() {
    super();

    this.state = {
      
    };
  }

 //  {/* +"!\n" */}
  render() {
   
      return (
        <View>
          <ImageBackground
            source={require("../../assets/images/wave/green_wave_top.png")}
            style={styles.backgroundImageTop}
          />
          <View style={styles.View}>
          <View style={styles.FirstView}>
           
              
                    <Text
                      style={{
                        fontFamily: "Montserrat-ExtraBold",
          color: "#fff",
                        fontSize: 20,
                        textAlign: "center"
                      }}
                    >
                      SUSTAINABILITY
                    </Text>
                    </View>
                    <View style={styles.SecondView}>
                    
              
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        color: "#3D3D3D",
                        fontSize: 12,
                        textAlign: "left"
                      }}
                    >
                      {strings("playing_with_fr")} {strings("gaining_2_coins")}
                    </Text>
                    <AutoAnimation/>
                    
                    </View>
                    <View style={styles.LastView}>
                    
                    <Text
                      style={{
                        fontFamily: "OpenSans-Regular",
                        fontWeight: "400",
                        color: "#3D3D3D",
                        fontSize: 12,
                        textAlign: "left"
                      }}
                    >
                      {strings("playing_with_fr")}
                    </Text>
                    </View>
                    

                 
          </View>
          <ImageBackground
            source={require("../../assets/images/wave/green_wave_bottom.png")}
            style={styles.backgroundImageBottom}
          />
        </View>
      );
    
    }
  
}


CO2Wave.defaultProps = {
  cityInTournament: "false"
};

export default CO2Wave;
