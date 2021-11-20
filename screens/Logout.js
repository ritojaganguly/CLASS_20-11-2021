import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";

export default class logout extends Component{
    componentDidMount(){
        firebase.auth().signOut
    }
        render(){
            return(
                <View style={styles.container}><Text>Log out!</Text></View>
            )
        }
    }

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    } 
});