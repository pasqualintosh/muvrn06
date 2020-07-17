import React from "react";
import { View, Text } from "react-native";

// componente per il login di google

// props
// style per ereditare lo stile passato

class GoogleLogin extends React.Component {
  // configuro il componente
  componentDidMount() {
    // GoogleSignin.configure({
    //   iosClientId:
    //     "1000447429429-gio3armp5rdmop4mvui41m7el1r4sub9.apps.googleusercontent.com" // only for iOS
    // }).then(() => {
    //   // you can now call currentUserAsync()
    // });
  }
  // provo il login, quando clicco il pulsante,
  _signIn = () => {
    // const user = GoogleSignin.currentUser();
    // se gia connesso non fa apparire nessuna pagina per il login e da i dati
    // GoogleSignin.signIn()
    //   .then(user => {
    //     console.log(user);
    //     console.log("collegato");
    //     this.setState({ user: user });
    //   })
    //   .catch(err => {
    //     console.log("WRONG SIGNIN", err);
    //   })
    //   .done();
  };

  render() {
    return (
      // <GoogleSigninButton
      //   style={this.props.style}
      //   size={GoogleSigninButton.Size.Wide}
      //   color={GoogleSigninButton.Color.Light}
      //   onPress={this._signIn.bind(this)}
      // >
      //   {this.props.children}
      // </GoogleSigninButton>
      <View />
    );
  }
}

export default GoogleLogin;
