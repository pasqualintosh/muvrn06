/**
 * react-native-check-box
 * Checkbox component for react native, it works on iOS and Android
 * https://github.com/crazycodeboy/react-native-check-box
 * Email:crazycodeboy@gmail.com
 * Blog:http://www.devio.org
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
  ViewPropTypes as RNViewPropTypes
} from "react-native";
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import OwnIcon from "../../components/OwnIcon/OwnIcon";

const ViewPropTypes = RNViewPropTypes || View.propTypes;

export default class CheckBoxGradient extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    ...ViewPropTypes,
    leftText: PropTypes.string,
    leftTextView: PropTypes.element,
    rightText: PropTypes.string,
    leftTextStyle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ]),
    rightTextView: PropTypes.element,
    rightTextStyle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ]),
    checkedImage: PropTypes.element,
    unCheckedImage: PropTypes.element,
    onClick: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
    isIndeterminate: PropTypes.bool.isRequired,
    checkBoxColor: PropTypes.string,
    checkedCheckBoxColor: PropTypes.string,
    uncheckedCheckBoxColor: PropTypes.string,
    disabled: PropTypes.bool
  };
  static defaultProps = {
    isChecked: false,
    isIndeterminate: false,
    leftTextStyle: {},
    rightTextStyle: {}
  };

  onClick() {
    this.props.onClick();
  }

  _renderLeft() {
    if (this.props.leftTextView) return this.props.leftTextView;
    if (!this.props.leftText) return null;
    return (
      <Text style={[styles.leftText, this.props.leftTextStyle]}>
        {this.props.leftText}
      </Text>
    );
  }

  _renderRight() {
    if (this.props.rightTextView) return this.props.rightTextView;
    if (!this.props.rightText) return null;
    return (
      <Text style={[styles.rightText, this.props.rightTextStyle]}>
        {this.props.rightText}
      </Text>
    );
  }

  _renderImage() {
    if (this.props.isIndeterminate) {
      return this.props.indeterminateImage
        ? this.props.indeterminateImage
        : this.genCheckedImage();
    }
    if (this.props.isChecked) {
      return this.props.checkedImage
        ? this.props.checkedImage
        : this.genCheckedImage();
    } else {
      return this.props.unCheckedImage
        ? this.props.unCheckedImage
        : this.genUnCheckedImage();
    }
  }

  _getCheckedCheckBoxColor() {
    return this.props.checkedCheckBoxColor
      ? this.props.checkedCheckBoxColor
      : this.props.checkBoxColor;
  }

  _getUncheckedCheckBoxColor() {
    return this.props.uncheckedCheckBoxColor
      ? this.props.uncheckedCheckBoxColor
      : this.props.checkBoxColor;
  }

  _getTintColor() {
    return this.props.isChecked
      ? this._getCheckedCheckBoxColor()
      : this._getUncheckedCheckBoxColor();
  }

  genCheckedImage() {
    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 1.0]}
        colors={["#7D4D99", "#6497CC"]}
        style={{
          height: 19,
          width: 19,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          borderRadius: 2

        }}
      >
        <OwnIcon
          name="checkmark"
          size={17}
          color="#ffffff"
          // style={{ position: "relative", top: 100 }}
        />
      </LinearGradient>
    );
    // let source;
    // if (this.props.isIndeterminate) {
    //     source = require('./img/ic_indeterminate_check_box.png');
    // }
    // else {
    //     source = this.props.isChecked ? require('./img/ic_check_box.png') : require('./img/ic_check_box_outline_blank.png');
    // }

    // return (
    //     <Image source={source} style={{tintColor: this._getTintColor()}}/>
    // );
  }

  genUnCheckedImage() {
    return (
      <View
        style={{
          height: 19,
          width: 19,
          borderColor: "#707070",
          borderWidth: 1
        }}
      ></View>
    );
  }

  render() {
    return (
      <TouchableHighlight
        style={this.props.style}
        onPress={() => this.onClick()}
        underlayColor="transparent"
        disabled={this.props.disabled}
      >
        <View style={styles.container}>
          {this._renderLeft()}
          {this._renderImage()}
          {this._renderRight()}
        </View>
      </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  leftText: {
    flex: 1
  },
  rightText: {
   
    marginLeft: 10
  }
});
