import React from "react";
import { Image, Linking, StyleSheet, Text, View } from "react-native";

import BottomBar from "../components/BottomNavigator";
import PageStyles from "../other/styles";
import Header from "../components/Header";
import { COLORS } from "../other/colors";

type HeroProps = {
  path: keyof typeof ImageMap;
  name: string;
};

const ImageMap = {
  main: require('../../assets/images/main.png'),
  nain: require('../../assets/images/nain.png'),
  elfe: require('../../assets/images/elfe.png'),
  barbare: require('../../assets/images/barbare.png'),
  magicienne: require('../../assets/images/magicienne.png'),
  ogre: require('../../assets/images/ogre.png'),
};

const Hero: React.FC<HeroProps> = ({path, name}) => {

    const MyImage = ImageMap[path];

    return (
        <View style={HeroesStyles.heroContainer}>
            <Image source={MyImage} style={HeroesStyles.heroPicture} />
            <Text style={HeroesStyles.heroName}>{name}</Text>
        </View>
    );
};

const Heroes = () => {
    return (
        <View style={PageStyles.page}>
            <Header />
            <View style={PageStyles.content}>
                <Text style={HeroesStyles.headerText}>Héros</Text>
                <Image source={require("../../assets/images/penofchaos.png")} style={HeroesStyles.mainImage}  />
                <Text style={HeroesStyles.username} onPress={() => Linking.openURL("http://www.penofchaos.com/warham/donjon.htm")}>Pen Of Chaos</Text>
                <Text style={HeroesStyles.master}>Maître du Donjon</Text>
                <View style={HeroesStyles.heroList}>
                    <Hero path="main" name="Aventurier" />
                    <Hero path={"nain"} name={"Nain"} />
                    <Hero path={"elfe"} name={"Elfe"} />
                    <Hero path={"barbare"} name={"Barbare"} />
                    <Hero path={"magicienne"} name={"Magicienne"} />
                    <Hero path={"ogre"} name={"Ogre"} />
                </View>
            </View>
            <BottomBar />
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
        height: 50,
        width: 50,
        borderRadius: 100,
        alignSelf: "center",
        marginTop: 10
    },
    username: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
        color: COLORS.MainText,
        marginTop: 10,
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
        height: 30,
        width: 30
    },
    heroContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: 10
    },
    heroList: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
        justifyContent: "center"
    }
});

export default Heroes;