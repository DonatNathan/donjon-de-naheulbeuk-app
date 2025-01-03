import React from "react";
import { View } from "react-native";
import BottomBar from "../components.js/BottomNavigator";
import PageStyles from "../other/Styles";

const Podcasts = ({navigation}) => {
    return (
        <View style={PageStyles.page}>
            <BottomBar navigation={navigation} />
        </View>
    );
};

export default Podcasts;