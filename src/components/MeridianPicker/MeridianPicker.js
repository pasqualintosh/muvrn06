import React from "react";
import { View, Picker as PickerIos, Platform } from "react-native";

import PickerAndroid from "./../PickerAndroid/PickerAndroid";

let Picker = Platform.OS === "ios" ? PickerIos : PickerAndroid;
let PickerItem = Picker.Item;

class MeridianPicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      valueSelected: this.props.meridian
        ? this.props.meridian
        : new Date().getHours() > 12
          ? "PM"
          : "AM"
    };
  }

  componentDidMount = () => {
    this.props.setMeridian(this.state.valueSelected);
  };

  render() {
    return (
      <View
        style={{
          marginTop: 15,
          width: 50,
          height: 150
        }}
      >
        <Picker
          style={{ width: 50 }}
          selectedValue={this.state.valueSelected}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({ valueSelected: itemValue });
            this.props.setMeridian(itemValue);
          }}
        >
          <PickerItem label={"AM"} value={"AM"} />
          <PickerItem label={"PM"} value={"PM"} />
        </Picker>
      </View>
    );
  }
}

export default MeridianPicker;
