import React from "react";
import { View, Picker as PickerIos, Platform } from "react-native";

import PickerAndroid from "./../PickerAndroid/PickerAndroid";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

class MinutePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      valueSelected: this.props.minute
        ? this.props.minute
        : new Date().getMinutes()
    };
    this.values = [];
    for (let count = 0; count < 60; count++) {
      this.values[count] = count;
    }
  }

  componentDidMount = () => {
    this.props.setMinutes(this.state.valueSelected);
  };

  render() {
    const values = this.values.map((element, index) => (
      <PickerItem key={index} label={"" + element} value={"" + element} />
    ));
    return (
      <View
        style={{
          marginTop: 15,
          width: 65,
          height: 150
        }}
      >
        <Picker
          style={{ width: 65, height: 150 }}
          selectedValue={"" + this.state.valueSelected}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({ valueSelected: itemValue });
            this.props.setMinutes(itemValue);
          }}
        >
          {values}
        </Picker>
      </View>
    );
  }
}

export default MinutePicker;
