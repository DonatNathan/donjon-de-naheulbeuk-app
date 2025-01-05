import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from "@other/Colors";

const BottomBar = ({navigation}) => {
    return (
        <View style={BottomStyles.bar}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")} style={BottomStyles.icons}>
                <Ionicons name="home" size={30} color={COLORS.MainText} />
                <Text>Acceuil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Podcasts")} style={BottomStyles.icons}>
                <Ionicons name="folder" size={30} color={COLORS.MainText} />
                <Text>Podcasts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Heroes")} style={BottomStyles.icons}>
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
        padding: 10,
        color: COLORS.MainText,
    },
    icons: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
});

export default BottomBar;