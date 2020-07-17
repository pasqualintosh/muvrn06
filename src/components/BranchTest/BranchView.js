import React from "react";
import { View, Text } from "react-native";
import BranchMethods from "./BranchMethods";

class BranchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <BranchMethods />;
  }
}

export default BranchView;
