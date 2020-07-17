import React, {
  Component,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import {
  PropTypes,
} from 'prop-types';
import OwnIcon from "../../../components/OwnIcon/OwnIcon";

class Hoop extends Component {
  render() {
    return (
      <View style={[styles.hoopContainer, {
        bottom: this.props.y,
      }]}>
      <View style={{ position: 'absolute', top: 7}}>
      <Text>
      <Text style={styles.BestScore}>{"best score: "}</Text><Text style={styles.Score}>{this.props.bestScore}</Text>
      </Text>
      </View>

        <View style={styles.hoopContained} >
        <OwnIcon name="MUV_logo" size={40} color="#000000" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hoopContainer: {
    position: 'absolute',
    left: (Dimensions.get('window').width / 2) - (179 / 2),
    width: 179,
    height: 112,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  BestScore: {
    fontFamily: "OpenSans-Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#3D3D3D"
  },
  Score: {
    fontFamily: "OpenSans-Bold",
    fontSize: 16,
    textAlign: "center",
    color: "#3D3D3D",
    fontWeight: "bold"
  },
  hoopContained: {
    width: 70,
    height: 54,
    marginTop: 38,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

Hoop.defaultProps = {
  y: 0,
  bestScore: 0
};

Hoop.propTypes = {
  y: PropTypes.number,
};

export default Hoop;
