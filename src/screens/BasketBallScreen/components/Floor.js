import React, {
  Component,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  PropTypes,
} from 'prop-types';
import LinearGradient from "react-native-linear-gradient";

class Floor extends Component {
  render() {
    return (
      <LinearGradient
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 0.0, y: 1.0 }}
      locations={[0,1.0]}
      colors={["#DDDDDD", "#FFFFFF"]}
      style={[styles.floorContainer, {height: this.props.height}]}
    />
    );
  }
}

const styles = StyleSheet.create({
  floorContainer: {
    // backgroundColor: '#F4F4F4',
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: 0,
  },
});

Floor.defaultProps = {
  height: 15,
};

Floor.propTypes = {
  height: PropTypes.number,
};

export default Floor;
