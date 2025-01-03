import React from "react";
import { StyleSheet } from "react-native";
import { COLORS } from "./Colors";

const PageStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: COLORS.MainBack,
    },
    header: {
        marginTop: "10%"
    },
    content: {
        paddingLeft: "5%",
        paddingRight: "5%",
        alignItems: "center"
    }
});

export default PageStyles;