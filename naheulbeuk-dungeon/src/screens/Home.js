import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import { Dimensions } from 'react-native';

import BottomBar from "@components/BottomNavigator";
import PageStyles from "@other/Styles";
import Header from "@components/Header";
import { COLORS } from "@other/Colors";

const Logo = require('@assets/images/logo.png');
const Sentences = require('@assets/files/sentences.json');

const { width, height } = Dimensions.get("window");


const RandomImage = () => {

    const randomIndex = Math.floor(Math.random() * 6);
    let RandomImage;

    switch (randomIndex) {
        case 0:
            RandomImage = require('@assets/images/main.png');
            break;
        case 1:
            RandomImage = require('@assets/images/nain.png');
            break;
        case 2:
            RandomImage = require('@assets/images/elfe.png');
            break;
        case 3:
            RandomImage = require('@assets/images/barbare.png');
            break;
        case 4:
            RandomImage = require('@assets/images/magicienne.png');
            break;
        case 5:
            RandomImage = require('@assets/images/ogre.png');
            break;
        default:
            RandomImage = require('@assets/images/penofchaos.png');
    }

    return (
        <Image source={RandomImage} style={HomeStyles.randomImage} />
    );
};

const RandomText = () => {

    const randomIndex = Math.floor(Math.random() * Sentences.length)

    return (
        <Text style={HomeStyles.randomSentence}>"{Sentences[randomIndex].content}</Text>
    );
};

const EnterButton = ({navigation}) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Podcasts")}>
            <View style={HomeStyles.button}>
                <Text style={HomeStyles.buttonText}>Entrer dans le Donjon</Text>
                <Ionicons name="arrow-forward" size={30} color={COLORS.MainText} />
            </View>
        </TouchableOpacity>
    );
};

const Home = ({navigation}) => {
    return (
        <View style={PageStyles.page}>
            <Header />
            <View style={PageStyles.content}>
                <Image source={Logo} style={HomeStyles.logo} resizeMode="contain" />
                <RandomImage />
                <RandomText />
                <EnterButton navigation={navigation} />
            </View>
            <BottomBar navigation={navigation} />
        </View>
    );
};

const HomeStyles = StyleSheet.create({
    logo: {
        width: "100%",
        marginTop: height * 0.1
    },
    randomSentence: {
        textAlign: "center",
        fontStyle: "italic",
        color: COLORS.MainText,
        fontSize: 14,
    },
    randomImage: {
        marginTop: height * 0.1,
        marginBottom: height * 0.02,
        width: height * 0.2,
        height: height * 0.2,
        alignSelf: "center",
    },
    button: {
        backgroundColor: COLORS.SecondBack,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: height * 0.4,
        padding: 15,
        borderRadius: 30,
        marginTop: height * 0.1,
        alignSelf: "center"
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "bold"
    }
});

export default Home;