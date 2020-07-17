import React from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
} from "react-native";


import { LoginButton, ShareDialog, ShareApi } from 'react-native-fbsdk';

class FacebookLinkButton extends React.PureComponent {
    constructor(props) {
        super(props);
        const shareLinkContent = {
            contentType: 'link',
            photos: [{ imageUrl: 'https://www.repstatic.it/content/nazionale/img/2019/03/21/121534084-66c55ba1-4714-4656-ae03-9958ffb28ab0.jpg' }],
            contentUrl: 'https://www.repstatic.it/content/nazionale/img/2019/03/21/121534084-66c55ba1-4714-4656-ae03-9958ffb28ab0.jpg',
            contentDescription: 'Cat',
            quote: 'Great, 1080 Points, Cat, Cat, Cat.....',
        };

        const photoUri = 'file://' + "MUV/src/assets/images/walk_icn_recap.png"
        const sharePhotoContent = {
            contentType: 'photo',
            photos: [{ imageUrl: photoUri }],
        }


        this.state = { shareLinkContent: shareLinkContent, sharePhotoContent: sharePhotoContent };
    }


    shareLinkWithShareDialog() {
        var tmp = this;
        ShareDialog.canShow(this.state.shareLinkContent).then(
            function (canShow) {
                if (canShow) {
                    return ShareDialog.show(tmp.state.shareLinkContent);
                }
            }
        ).then(
            function (result) {
                if (result.isCancelled) {
                    alert('Share cancelled');
                } else {
                    alert('Share success with postId: ' + result.postId);
                }
            },
            function (error) {
                alert('Share fail with error: ' + error);
            }
        );
    }

    sharePhotoWithShareDialog() {
        // ShareDialog.show(this.state.sharePhotoContent);
        const sharePhoto = {
            imageUrl: 'file:///sdcard/test.png',// <diff_path_for_ios>
            userGenerated: false,
            caption: 'hello'
        };
        const sharePhotoContent = {
            contentType: 'photo',
            photos: [sharePhoto]
        };
        ShareApi.share(sharePhotoContent, '/me', 'Hello')
            .then((result) => {
                alert(JSON.stringify(result));
            })
            .catch((error) => {
                alert(JSON.stringify(error));
            });

    }

    render() {
        return (
            <View style={styles.container}>
                <LoginButton
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("Login failed with error: " + error.message);
                            } else if (result.isCancelled) {
                                alert("Login was cancelled");
                            } else {
                                alert("Login was successful with permissions: " + result.grantedPermissions)
                            }
                        }
                    }
                    onLogoutFinished={() => alert("User logged out")} />
                <TouchableHighlight onPress={this.shareLinkWithShareDialog.bind(this)}>
                    <Text style={styles.shareText}>Share link with ShareDialog</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    shareText: {
        fontSize: 20,
        margin: 10,
    },
});

export default FacebookLinkButton;
