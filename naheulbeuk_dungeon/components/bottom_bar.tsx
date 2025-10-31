import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as NavigationBar from "expo-navigation-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "../other/colors";
import { useRouter } from "expo-router";

const BottomBar = () => {

    const router = useRouter();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        NavigationBar.setVisibilityAsync("hidden");
    }, []);

    return (
        <View style={BottomStyles.barView}>
            <View style={[BottomStyles.bar, { marginBottom: insets.bottom }]}>
                <TouchableOpacity onPress={() => router.push("/")} style={BottomStyles.icons}>
                    <Ionicons name="home" size={30} color={COLORS.MainText} />
                    <Text>Acceuil</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/(tabs)/podcasts")} style={BottomStyles.icons}>
                    <Ionicons name="folder" size={30} color={COLORS.MainText} />
                    <Text>Podcasts</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/(tabs)/heros")} style={BottomStyles.icons}>
                    <Ionicons name="people" size={30} color={COLORS.MainText} />
                    <Text>Héros</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const BottomStyles = StyleSheet.create({
    barView: {
        backgroundColor: COLORS.SecondBack,
        position: "absolute",
        bottom: 0,
        width: "100%"
    },
    bar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        color: COLORS.MainText,
        alignItems: "center",
        marginTop: 10,
        borderBottomColor: COLORS.MainText,
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    icons: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
});

export default BottomBar;