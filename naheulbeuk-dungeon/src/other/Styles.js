import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';

import { COLORS } from "@other/Colors";

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