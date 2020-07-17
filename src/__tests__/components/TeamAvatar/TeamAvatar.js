import { View, Text, Image } from "react-native";
import React from "react";
import TeamAvatar from "../../../components/TeamAvatar/TeamAvatar";
import { styles } from "../../../components/TeamAvatar/Style";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<TeamAvatar />);
  });
  it("should render 3 <Text/>", () => {
    expect(wrapper.find("Text")).toHaveLength(3);
  });
});
