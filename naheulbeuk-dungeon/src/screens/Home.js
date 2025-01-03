import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomBar from "../components.js/BottomNavigator";
import PageStyles from "../other/Styles";
import Header from "../components.js/Header";
import { COLORS } from "../other/Colors";
import { Icon } from "@rneui/themed";

const Logo = require('../../assets/images/logo.png');
const Ogre = require('../../assets/images/ogre.png');

const Sentences = require('../../assets/files/sentences.json');

// TODO: Create the image randomisation
const RandomImage = () => {
    return (
        <Image source={Ogre} style={HomeStyles.randomImage} />
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
                <Icon name="arrow-forward" type="Ionicons" size={30} color={COLORS.MainText} />
            </View>
        </TouchableOpacity>
    );
};

const Home = ({navigation}) => {
    return (
        <View style={PageStyles.page}>
            <Header />
            <View style={PageStyles.content}>
                <Image source={Logo} style={HomeStyles.logo} />
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
        resizeMode: 'contain',
        marginTop: "30%"
    },
    randomSentence: {
        textAlign: "center",
        fontStyle: "italic",
        color: COLORS.MainText,
        fontSize: 14,
    },
    randomImage: {
        marginTop: "20%",
        marginBottom: "2%",
        width: 172,
        height: 172
    },
    button: {
        backgroundColor: COLORS.SecondBack,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: "70%",
        padding: 15,
        borderRadius: 30,
        marginTop: "20%"
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "bold"
    }
});

export default Home;