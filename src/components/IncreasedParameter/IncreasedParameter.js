/**
 * component usable in feed
 * default props are
 * imageSource -> require(image)
 *   title -> string
 *   subTitle -> string
 *   content -> string
 *   number -> string|number
 *   value -> string
 */

import React from "react";
import { View, Text, Image } from "react-native";

import { styles } from "./Style";

class IncreasedParameter extends React.Component {
  render() {
    return (
      <View style={styles.containerComponent}>
        <View style={styles.containerIcon}>
          <Image source={this.props.imageSource} style={styles.image} />
        </View>
        <View style={styles.containerContent}>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>
              {this.props.title.toLocaleUpperCase()} |{" "}
            </Text>
            <Text style={styles.subTitle}>{this.props.subTitle}</Text>
          </View>
          <View style={styles.containerDescription}>
            <Text style={styles.content}>{this.props.content}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.containerIncrement}>
          <View
            style={[
              styles.colored,
              {
                backgroundColor:
                  this.props.color != undefined ? this.props.color : "#3D3D3D"
              }
            ]}
          />
          <Text style={styles.number}>{this.props.number}</Text>
          <Text style={styles.values}>{this.props.value}</Text>
        </View>
      </View>
    );
  }
}

export default IncreasedParameter;
