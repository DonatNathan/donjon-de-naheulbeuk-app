import React from "react";
import { StyleSheet } from "react-native";
import { COLORS } from "./Colors";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const PageStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: COLORS.MainBack,
    },
    header: {
        marginTop: height * 0.05
    },
    content: {
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05
    }
});

export default PageStyles;