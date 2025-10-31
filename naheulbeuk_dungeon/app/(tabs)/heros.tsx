import React from "react";
import { Image, Linking, StyleSheet, Text, View } from "react-native";

import BottomBar from "@/components/bottom_bar";

import { COLORS } from "../../other/colors";

type HeroProps = {
  path: string;
  name: string;
};

const Hero: React.FC<HeroProps> = ({path, name}) => {

    const MyImage = `${process.env.EXPO_PUBLIC_SUPABASE_URL}images/${path}.png`;

    return (
        <View style={HeroesStyles.heroContainer}>
            <Image source={{ uri: MyImage }} style={HeroesStyles.heroPicture} />
            <Text style={HeroesStyles.heroName}>{name}</Text>
        </View>
    );
};

const Heroes = () => {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.MainBack, paddingBottom: "20%", height: "100%", display: "flex", justifyContent: "space-around" }}>
            <Text style={HeroesStyles.headerText}>Héros</Text>
            <View>
                <Image source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}images/penofchaos.png` }} style={HeroesStyles.mainImage} />
                <Text style={HeroesStyles.username} onPress={() => Linking.openURL("http://www.penofchaos.com/warham/donjon.htm")}>Pen Of Chaos</Text>
                <Text style={HeroesStyles.master}>Maître du Donjon</Text>
            </View>
            <View style={HeroesStyles.heroList}>
                <Hero path="main" name="Aventurier" />
                <Hero path={"nain"} name={"Nain"} />
                <Hero path={"elfe"} name={"Elfe"} />
                <Hero path={"barbare"} name={"Barbare"} />
                <Hero path={"magicienne"} name={"Magicienne"} />
                <Hero path={"ogre"} name={"Ogre"} />
            </View>
            <BottomBar />
        </View>
    );
};

const HeroesStyles = StyleSheet.create({
    headerText: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 30,
        color: COLORS.MainText
    },
    mainImage: {
        height: 150,
        width: 150,
        borderRadius: 100,
        alignSelf: "center",
        marginTop: "5%"
    },
    username: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        color: COLORS.MainText,
        marginTop: "5%",
    },
    master: {
        color: COLORS.SecondText,
        fontSize: 14,
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
        height: 80,
        width: 80
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
        marginTop: 50,
        justifyContent: "center"
    }
});

export default Heroes;