import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity} from 'react-native';

import BottomBar from '../../components/bottom_bar';

import { COLORS } from '../../other/colors';

import MusicPlayer from './listening';

import podcasts from '../../assets/files/podcasts.json';

type SearchProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

type LibraryProps = {
	setPage: React.Dispatch<React.SetStateAction<string>>;
	setTrack: React.Dispatch<React.SetStateAction<number>>;
}

type EpisodeProps = {
	episode: {
		url: string;
		title: string;
		artist: string;
		artwork: string;
	}
}

const imageMap = {
  main: require("../../assets/images/main.png"),
  nain: require("../../assets/images/nain.png"),
  elfe: require("../../assets/images/elfe.png"),
  barbare: require("../../assets/images/barbare.png"),
  magicienne: require("../../assets/images/magicienne.png"),
  ogre: require("../../assets/images/ogre.png"),
};

type ImageKey = keyof typeof imageMap;

const SearchBar: React.FC<SearchProps> = ({search, setSearch}) => {
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
		</View>
	);
};

const Episode: React.FC<EpisodeProps> = ({episode}) => {

	const parseArtwork = (artwork: string): ImageKey | null  => {
		const name = artwork.split("/").slice(-1)[0];
		const key = name.split(".")[0];
		return key in imageMap ? (key as ImageKey) : null;
	}

    const imageKey = parseArtwork(episode.artwork);
  	const MyImage = imageKey ? imageMap[imageKey] : require("../../assets/images/main.png");

	return (
		<View style={LibraryStyles.episode}>
			<Image source={MyImage} style={LibraryStyles.episodeImage} />
			<Text style={LibraryStyles.episodeTitle}>{episode.title}</Text>
			<Text style={LibraryStyles.episodeArtist}>{episode.artist}</Text>
		</View>
	);
};

const Library: React.FC<LibraryProps> = ({setPage, setTrack}) => {

	const [search, setSearch] = useState("");

    return (
		<View style={{ flex: 1, backgroundColor: COLORS.MainBack, paddingTop: 50 }}>
			<View style={{ paddingHorizontal: 20 }}>
				<Text style={LibraryStyles.headerText}>Podcasts</Text>
				<SearchBar search={search} setSearch={setSearch} />
				<ScrollView contentContainerStyle={[LibraryStyles.episodeList, { paddingBottom: 250 }]}>
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
			<BottomBar />
		</View>
	);
};

const Podcasts = () => {

    const [page, setPage] = useState("Library");
	const [track, setTrack] = useState(0);

    return (
		<>
			{page == "Library" ? <Library setPage={setPage} setTrack={setTrack} /> : <MusicPlayer setPage={setPage} track={track} />}
		</>
    );
};

const LibraryStyles = StyleSheet.create({
	headerText: {
		textAlign: "center",
        fontWeight: "bold",
        fontSize: 30,
        color: COLORS.MainText
	},
	searchBar: {
		display: "flex",
		flexDirection: "row",
		width: "90%",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: COLORS.SecondBack,
		borderRadius: 15,
		marginTop: 30,
		alignSelf: "center",
		paddingRight: 10,
	},
	input: {
		borderRadius: 15,
		paddingLeft: 10
	},
	episodeList: {
		marginTop: 10,
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	episode: {
		width: 120,
		marginTop: 10,
		marginHorizontal: 20
	}, 
	episodeImage: {
		height: 120,
		width: 120
	},
	episodeTitle: {
		color: COLORS.MainText,
		fontWeight: "bold",
		fontSize: 12,
		marginTop: 5
	},
	episodeArtist: {
		color: COLORS.MainText,
		fontSize: 10,
		marginTop: 5
	}
});

export default Podcasts;