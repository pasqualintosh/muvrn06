import React from "react";
import { View } from "react-native";
// importo il pacchetto di icone Ionicons
import Icon from "react-native-vector-icons/Ionicons";

class VectorIcon extends React.Component {
  render() {
    // visualizzo il pulsante + di ios
    return (
      <View>
        <Icon name="ios-add" size={30} color="#900" />
      </View>
    );
  }
}

export default VectorIcon;
