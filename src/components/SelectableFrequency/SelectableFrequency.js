/**
 * componente usato nel survey dopo/durante la registrazione
 * this.props.selectableItems = [true,false,true,false,true] con lunghezza ideale di 5
 * @author push
 */

import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { styles } from "./Style";

class SelectableFrequency extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectableItems: this.props.selectableItems
    };
  }
  /**
   * veicolo il cambiamento di colore degli elementi selezionati
   * itero per modificare un insieme di colori
   */
  _handleOnClick = index => {
    let newSelectableItems = this.state.selectableItems;
    let newValue = !newSelectableItems[index];
    newSelectableItems[index] = newValue;

    if (newValue) {
      for (let i = 0; i < newSelectableItems.length; i++) {
        if (i <= index) {
          newSelectableItems[i] = newValue;
        }
      }
    } else {
      for (let i = 0; i < newSelectableItems.length; i++) {
        if (i >= index) {
          newSelectableItems[i] = newValue;
        }
      }
    }

    this.setState({
      selectableItems: newSelectableItems
    });
  };
  /**
   * renderizzo gli elementi tappabili
   * se l'elemento dell'array e `true` lo visualizzo con il colore idoneo
   */
  renderSelectableItems() {
    const selectableItems = this.state.selectableItems.map((item, index) => (
      <TouchableWithoutFeedback
        key={Math.floor(Math.random() * 100000 + 1)}
        onPress={() => this._handleOnClick(index)}
      >
        <View
          key={Math.floor(Math.random() * 100000 + 1)}
          style={
            item == true ? styles.containerSelected : styles.containerSelectable
          }
        />
      </TouchableWithoutFeedback>
    ));
    return selectableItems;
  }
  /**
   * renderizzo i pin ma li rendo visibili solo se l'elemento è `true`
   */
  renderPin() {
    const pin = this.state.selectableItems.map((item, index) => (
      <View key={Math.floor(Math.random() * 100000 + 1)} style={styles.pin}>
        <View
          style={item == true ? styles.pinItemVisbile : styles.pinItemHidden}
        />
      </View>
    ));
    return pin;
  }
  render() {
    return (
      <View style={styles.containerComponent}>
        <View style={styles.containerPin}>
          <View style={{ flex: 0.2 }} />
          {this.renderPin()}
          <View style={{ flex: 0.2 }} />
        </View>
        <View style={styles.containerItem}>
          <View style={styles.containerSeletableLabel}>
            <Text style={styles.containerSeletableLabelText}>
              {this.props.startLabel != ""
                ? this.props.startLabel
                : "Initial Value"}
            </Text>
          </View>

          {this.renderSelectableItems()}

          <View style={styles.containerSeletableLabel}>
            <Text style={styles.containerSeletableLabelText}>
              {this.props.endLabel != "" ? this.props.endLabel : "Final Value"}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default SelectableFrequency;
