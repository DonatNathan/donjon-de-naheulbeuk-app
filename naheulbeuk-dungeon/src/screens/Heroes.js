import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

import BottomBar from "@components/BottomNavigator";
import PageStyles from "@other/Styles";
import Header from "@components/Header";
import { COLORS } from "@other/Colors";

const PenOfChaos = require("@assets/images/penofchaos.png");

const { width, height } = Dimensions.get("window");

const Hero = ({path, name}) => {

    const imageMap = {
        main: require('@assets/images/main.png'),
        nain: require('@assets/images/nain.png'),
        elfe: require('@assets/images/elfe.png'),
        barbare: require('@assets/images/barbare.png'),
        magicienne: require('@assets/images/magicienne.png'),
        ogre: require('@assets/images/ogre.png'),
    };

    const MyImage = imageMap[path];

    return (
        <View style={HeroesStyles.heroContainer}>
            <Image source={MyImage} style={HeroesStyles.heroPicture} />
            <Text style={HeroesStyles.heroName}>{name}</Text>
        </View>
    );
};

const Heroes = ({navigation}) => {
    return (
        <View style={PageStyles.page}>
            <Header />
            <View style={PageStyles.content}>
                <Text style={HeroesStyles.headerText}>Héros</Text>
                <Image source={PenOfChaos} style={HeroesStyles.mainImage}  />
                <Text style={HeroesStyles.username}><a href="http://www.penofchaos.com/warham/donjon.htm" style={{textDecoration: "none", color: COLORS.MainText}}>Pen Of Chaos</a></Text>
                <Text style={HeroesStyles.master}>Maître du Donjon</Text>
                <View style={HeroesStyles.heroList}>
                    <Hero path={"main"} name={"Aventurier"} />
                    <Hero path={"nain"} name={"Nain"} />
                    <Hero path={"elfe"} name={"Elfe"} />
                    <Hero path={"barbare"} name={"Barbare"} />
                    <Hero path={"magicienne"} name={"Magicienne"} />
                    <Hero path={"ogre"} name={"Ogre"} />
                </View>
            </View>
            <BottomBar navigation={navigation} />
        </View>
    );
};

const HeroesStyles = StyleSheet.create({
    headerText: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
        color: COLORS.MainText
    },
    mainImage: {
        height: height * 0.2,
        width: height * 0.2,
        borderRadius: 100,
        alignSelf: "center",
        marginTop: height * 0.05
    },
    username: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
        color: COLORS.MainText,
        marginTop: height * 0.01,
    },
    master: {
        color: COLORS.SecondText,
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic"
    },
    heroName: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
        color: COLORS.MainText
    },
    heroPicture: {
        height: height * 0.1,
        width: height * 0.1
    },
    heroContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: height * 0.02
    },
    heroList: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: height * 0.05,
        justifyContent: "center"
    }
});

export default Heroes;