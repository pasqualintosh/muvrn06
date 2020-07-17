import { View, Text as TextReact, StyleSheet, Dimensions } from "react-native";
import React from "react";
import ProfileScreenCardsFooter from "../../../components/ProfileScreenCardsFooter/ProfileScreenCardsFooter";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ProfileScreenCardsFooter />);
  });
  it("should render 7 <View/>", () => {
    expect(wrapper.find("View")).toHaveLength(7);
  });
  it("should render 6 <Text/>", () => {
    expect(wrapper.find("Text")).toHaveLength(7);
  });
});
