import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../other/Colors";
import { Icon } from "@rneui/themed";

const BottomBar = ({navigation}) => {
    return (
        <View style={BottomStyles.bar}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Icon name="home" type="Ionicons" size={30} color={COLORS.MainText} />
                <Text>Acceuil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Podcasts")}>
                <Icon name="folder" type="Ionicons" size={30} color={COLORS.MainText} />
                <Text>Podcasts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Heroes")}>
                <Icon name="people" type="Ionicons" size={30} color={COLORS.MainText} />
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
    }
});

export default BottomBar;