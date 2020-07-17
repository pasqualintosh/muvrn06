import { View, Text, Image } from "react-native";
import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";

import SelectableFrequency from "../../../components/SelectableFrequency/SelectableFrequency";
import { styles } from "../../../components/SelectableFrequency/Style";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

describe("rendering", () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      startLabel: "Never",
      endLabel: "Ever",
      selectableItems: [true, true, true, true, false]
    };
    wrapper = shallow(<SelectableFrequency {...props} />);
  });
  it("the first <Text/> should show props.startLabel", () => {
    expect(
      wrapper
        .find("View")
        .children("Text")
        .get(0).props.children
    ).toBe(props.startLabel);
  });
});
