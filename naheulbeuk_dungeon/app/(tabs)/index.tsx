import React, { useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

import BottomBar from "@/components/bottom_bar";

import { COLORS } from "../../other/colors";

import Sentences from '../../assets/files/sentences.json';

const RandomContent = () => {

    const randomIndex = Math.floor(Math.random() * Sentences.length)

    return (
        <View>
            <Text style={HomeStyles.randomSentence}>"{Sentences[randomIndex].content}</Text>
            <Image source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}images/${Sentences[randomIndex].image}` }} style={HomeStyles.randomImage} />
        </View>
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
        <View style={{ flex: 1, backgroundColor: COLORS.MainBack, paddingBottom: "20%", height: "100%", display: "flex", justifyContent: "space-around" }}>
            <Image source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}images/logo.png` }} style={HomeStyles.logo} resizeMode="contain" />
            <RandomContent />
            <EnterButton />
            <BottomBar />
        </View>
    );
};

const HomeStyles = StyleSheet.create({
    logo: {
        width: "80%",
        height: "20%",
        alignSelf: "center"
    },
    randomSentence: {
        textAlign: "center",
        fontStyle: "italic",
        color: COLORS.MainText,
        fontSize: 14,
    },
    randomImage: {
        marginTop: "5%",
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
