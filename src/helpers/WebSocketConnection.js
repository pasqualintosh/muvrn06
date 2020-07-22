import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { wsConnect } from "../domains/connection/ActionCreators.js";

class WebSocketConnection extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      wsConnect("wss://" + WebService.socket + "/ws/tracking/point/?token=")
    );
  }

  render() {
    return <View>{this.props.children}</View>;
  }
}

const connection = connect();

export default connection(WebSocketConnection);
