import React, { Component } from "react";
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, Image, Switch, unstable_batchedUpdates } from "react-native";
import firebase from 'firebase';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {RFValue} from 'react-native-responsive-fontsize'

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props){
    super(props);
    this.state={
      fontsLoaded: false,
      isEnabled: false,
      lightTheme: true,
      profileImage: "",
      name: ""
    };
  }

  toggleSwitch(){
    const prevState=this.state.isEnabled
    const theme=!this.state.isEnabled ?"dark" :"light"
    var updates={}
    updates['/users/'+firebase.auth().currentUser.uid+'/current_theme/']=theme
    firebase.database().ref().update(updates)
    this.setState({isEnabled: !prevState, lightTheme: prevState})
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchInfo();
  }

  async fetchInfo(){
    var theme, name, image
    await firebase.database().ref('/users/'+firebase.auth().currentUser.uid).on(
      'value',function(snapShot){
        theme=snapShot.val().current_theme
        name=`${snapShot.val().first_name} ${snapShot.val().last_name}`
        image=snapShot.val().profile_picture
      }
    )
    this.setState({
      lightTheme: theme===light ?true :false, isEnabled: theme===light ?false :true, name: name, profileImage: image
    })
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea}/>
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image source={require('../assets/logo.png')} style={styles.iconImage}/>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>STORYTELLING APP</Text>
            </View>
          </View>
          <View style={styles.screenContainer}>
            <View style={styles.profileImageContainer}>
              <Image source={{uri: this.state.profileImage}} style={styles.profileImage}/>
              <Text style={styles.nameText}>{this.state.name}</Text>
            </View>
            <View style={styles.themeContainer}>
              <Text style={styles.themeText}>Dark Theme</Text>
              <Switch
                style={{transform:[{scaleX: 1.3}, {scaleY: 1.3}]}}
                trackColor={{false: "#767577", true: "white"}}
                thumbColor={this.state.isEnabled ?'black' :'#40e0d0'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=>this.toggleSwitch()}
                value={this.state.isEnabled}
              />
            </View>
            <View style={{flex:0.2}}/>
          </View>
          <View style={{flex:0.7}}/>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  screenContainer: {
    flex: 0.85
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70)
  },
  nameText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  themeContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFValue(20)
  },
  themeText: {
    color: "white",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  }
});