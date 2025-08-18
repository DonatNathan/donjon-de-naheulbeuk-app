import { StyleSheet } from "react-native";

import { COLORS } from "./colors";

const PageStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: COLORS.MainBack,
    },
    header: {
        marginTop: 50
    },
    content: {
        paddingHorizontal: 20
    }
});

export default PageStyles;