import { View, Text, Image } from "react-native";
import React from "react";
import ChartsHeader from "../../../components/ChartsHeader/ChartsHeader";
import { styles } from "../../../components/ChartsHeader/Style";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ChartsHeader />);
  });
  it("should render 6 <View/>", () => {
    expect(wrapper.find("View")).toHaveLength(6);
  });
  it("should render 2 <Text/>", () => {
    expect(wrapper.find("Text")).toHaveLength(2);
  });
});
