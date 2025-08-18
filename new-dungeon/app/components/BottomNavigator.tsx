import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import { COLORS } from "../other/colors";
import { useRouter } from "expo-router";

const BottomBar = () => {

    const router = useRouter();

    return (
        <View style={BottomStyles.bar}>
            <TouchableOpacity onPress={() => router.navigate("/pages/menu")} style={BottomStyles.icons}>
                <Ionicons name="home" size={30} color={COLORS.MainText} />
                <Text>Acceuil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate("/pages/podcasts")} style={BottomStyles.icons}>
                <Ionicons name="folder" size={30} color={COLORS.MainText} />
                <Text>Podcasts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate("/pages/heros")} style={BottomStyles.icons}>
                <Ionicons name="people" size={30} color={COLORS.MainText} />
                <Text>Héros</Text>
            </TouchableOpacity>
        </View>
    );
};

const BottomStyles = StyleSheet.create({
    bar: {
        backgroundColor: COLORS.SecondBack,
        position: "absolute",
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        color: COLORS.MainText,
        alignItems: "center",
        height: 60
    },
    icons: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
});

export default BottomBar;