import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput, Image, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import PageStyles from "../other/Styles";
import Header from '../components.js/Header';
import { COLORS } from '../other/Colors';
import BottomBar from '../components.js/BottomNavigator';
import MusicPlayer from './Listening';

import podcasts from '../../assets/files/podcasts.json';

const {width, height} = Dimensions.get('window');

const SearchBar = ({search, setSearch}) => {
	return (
		<View style={LibraryStyles.searchBar}>
			<TextInput
				onChangeText={text => {
                    setSearch(text)
                }}
                value={search}
                placeholder={"Search"}    
                placeholderTextColor={COLORS.MainText}
                textAlign={'left'}
				style={LibraryStyles.input}
			/>
			<Ionicons name="search" size={30} color={COLORS.MainText} />
		</View>
	);
};

const Episode = ({episode}) => {

	const parseArtwork = (artwork) => {
		const name = artwork.split("/").slice(-1)[0];
		const path = name.split(".")[0];
		return path;
	}

	const imageMap = {
        main: require('../../assets/images/main.png'),
        nain: require('../../assets/images/nain.png'),
        elfe: require('../../assets/images/elfe.png'),
        barbare: require('../../assets/images/barbare.png'),
        magicienne: require('../../assets/images/magicienne.png'),
        ogre: require('../../assets/images/ogre.png'),
    };

    const MyImage = imageMap[parseArtwork(episode.artwork)];

	return (
		<View style={LibraryStyles.episode}>
			<Image source={MyImage} style={LibraryStyles.episodeImage} />
			<Text style={LibraryStyles.episodeTitle}>{episode.title}</Text>
			<Text style={LibraryStyles.episodeArtist}>{episode.artist}</Text>
		</View>
	);
};

const Library = ({navigation, setPage, setTrack}) => {

	const [search, setSearch] = useState("");

    return (
		<View style={PageStyles.page}>
			<Header />
			<View style={PageStyles.content}>
				<Text style={LibraryStyles.headerText}>Podcasts</Text>
				<SearchBar search={search} setSearch={setSearch} />
				<ScrollView contentContainerStyle={LibraryStyles.episodeList}>
					{podcasts.map((value, index) => {
						{
							if (value.title.includes(search) || value.artist.includes(search)) 
								return (
									<TouchableOpacity key={index} onPress={() => {setTrack(index); setPage("Listening")}}>
										<Episode episode={value}/>
									</TouchableOpacity>	
								);
						}
					})}
				</ScrollView>
			</View>
			<BottomBar navigation={navigation} />
		</View>
	);
};

const Podcasts = ({navigation}) => {

    const [page, setPage] = useState("Library");
	const [track, setTrack] = useState(0);

    return (
		<>
			{page == "Library" ? <Library navigation={navigation} setPage={setPage} setTrack={setTrack} /> : <MusicPlayer setPage={setPage} track={track} />}
		</>
    );
};

const LibraryStyles = StyleSheet.create({
	headerText: {
		textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
        color: COLORS.MainText
	},
	searchBar: {
		display: "flex",
		flexDirection: "row",
		width: width * 0.8,
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: COLORS.SecondBack,
		borderRadius: 15,
		marginTop: height * 0.03,
		alignSelf: "center",
		paddingRight: 10,
		height: height * 0.05
	},
	input: {
		height: "100%",
		width: "100%",
		borderRadius: 15,
		paddingLeft: 10
	},
	episodeList: {
		height: height * 0.7,
		marginTop: height * 0.03,
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center"
	},
	episode: {
		width: height * 0.15,
		margin: height * 0.02
	}, 
	episodeImage: {
		height: height * 0.15,
		width: height * 0.15
	},
	episodeTitle: {
		color: COLORS.MainText,
		fontWeight: "bold",
		fontSize: 12,
		marginTop: height * 0.007
	},
	episodeArtist: {
		color: COLORS.MainText,
		fontSize: 10,
		marginTop: height * 0.007
	}
});

export default Podcasts;