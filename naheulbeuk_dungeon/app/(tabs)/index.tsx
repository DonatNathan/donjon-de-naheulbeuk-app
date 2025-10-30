import React, { useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

import BottomBar from "@/components/bottom_bar";

import { COLORS } from "../../other/colors";

import Sentences from '../../assets/files/sentences.json';

const RandomImage = () => {

    const randomIndex = Math.floor(Math.random() * 6);
    let RandomImage;

    switch (randomIndex) {
        case 0:
            RandomImage = require('../../assets/images/main.png');
            break;
        case 1:
            RandomImage = require('../../assets/images/nain.png');
            break;
        case 2:
            RandomImage = require('../../assets/images/elfe.png');
            break;
        case 3:
            RandomImage = require('../../assets/images/barbare.png');
            break;
        case 4:
            RandomImage = require('../../assets/images/magicienne.png');
            break;
        case 5:
            RandomImage = require('../../assets/images/ogre.png');
            break;
        default:
            RandomImage = require('../../assets/images/penofchaos.png');
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

const EnterButton = () => {

    return (
        <Link href="/podcasts" style={HomeStyles.button}>
          <View style={HomeStyles.buttonView}>
              <Text>Entrer dans le Donjon</Text>
              <Ionicons name="arrow-forward" size={30} color={COLORS.MainText} />
          </View>
        </Link>
    );
};

export default function Home() {

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.MainBack, paddingTop: 50 }}>
            <View style={{ paddingHorizontal: 20 }}>
                <Image source={require('../../assets/images/logo.png')} style={HomeStyles.logo} resizeMode="contain" />
                <RandomImage />
                <RandomText />
                <EnterButton />
            </View>
            <BottomBar />
        </View>
    );
};

const HomeStyles = StyleSheet.create({
    logo: {
        width: "80%",
        marginTop: 100,
        alignSelf: "center"
    },
    randomSentence: {
        textAlign: "center",
        fontStyle: "italic",
        color: COLORS.MainText,
        fontSize: 14,
    },
    randomImage: {
        marginTop: 50,
        marginBottom: 10,
        width: 150,
        height: 150,
        alignSelf: "center",
    },
    button: {
        backgroundColor: COLORS.SecondBack,
        width: "80%",
        alignSelf: "center",
        padding: 15,
        borderRadius: 30,
        marginTop: 70,
    },
    buttonView: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "bold"
    }
});
