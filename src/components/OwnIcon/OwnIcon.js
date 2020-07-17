import React from "react";
import { View } from "react-native";

// per creare le icone partendo dai nostri font e impostazion
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import icoMoonConfig from "../../assets/icon/selection.json";

// props
// name ovvero il nome dell'icone del font che vogliamo utilizzare
// size dimensione dell'icona
// color eventuale colore dell'icona
// click azione se viene premuta l'icona
// style per cambiare lo stile alla view dell'icona

class OwnIcon extends React.PureComponent {
  render() {
    // creo il nostro set icone come componente
    const Icon = createIconSetFromIcoMoon(icoMoonConfig);
    // iconatest, nome del file svg di partenza quando si crea il font
    return (
      <View style={this.props.style}>
        <Icon
          name={this.props.name}
          size={this.props.size}
          color={this.props.color}
          onPress={this.props.click}
          
        />
      </View>
    );
  }
}

// se non specificato il click non fa nulla
OwnIcon.defaultProps = {
  click: null
};

export default OwnIcon;
