import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";

import { styles } from "./Style";

class ChartsHeader extends React.Component {
  render() {
    return (
      <View style={styles.endFlex}>
        <View style={styles.mainContainer}>
          <TouchableWithoutFeedback
            onPress={() => this.props.handleChangePage("trophies")}
          >
            <View style={styles.rightContainer}>
              <Text
                style={[
                  styles.text,
                  {
                    color: this.props.page == "trophies" ? "#3d3d3d" : "#9D9B9C"
                  }
                ]}
              >
                TROPHIES
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor:
                      this.props.page == "trophies" ? "#3d3d3d" : "#9D9B9C"
                  }
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.props.handleChangePage("stats")}
          >
            <View style={styles.centerContainer}>
              <Text
                style={[
                  styles.text,
                  { color: this.props.page == "stats" ? "#3d3d3d" : "#9D9B9C" }
                ]}
              >
                STATS
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor:
                      this.props.page == "stats" ? "#3d3d3d" : "#9D9B9C"
                  }
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.props.handleChangePage("rewards")}
          >
            <View style={styles.leftContainer}>
              <Text
                style={[
                  styles.text,
                  {
                    color: this.props.page == "rewards" ? "#3d3d3d" : "#9D9B9C"
                  }
                ]}
              >
                REWARDS
              </Text>
              <View
                style={[
                  styles.underline,
                  {
                    backgroundColor:
                      this.props.page == "rewards" ? "#3d3d3d" : "#9D9B9C"
                  }
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default ChartsHeader;
