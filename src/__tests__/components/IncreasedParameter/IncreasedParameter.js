import { View, Text, Image } from "react-native";
import React from "react";
import IncreasedParameter from "../../../components/IncreasedParameter/IncreasedParameter";
import { styles } from "../../../components/IncreasedParameter/Style";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// Note: test renderer must be required after react-native.

import renderer from "react-test-renderer";

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

describe("rendering", () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      title: "test title",
      subTitle: "test sub title",
      content: "test content",
      number: 50,
      value: "val"
    };
    wrapper = shallow(<IncreasedParameter {...props} />);
  });
  it("should render 5 <Text/>", () => {
    expect(wrapper.find("Text")).toHaveLength(5);
  });
});
