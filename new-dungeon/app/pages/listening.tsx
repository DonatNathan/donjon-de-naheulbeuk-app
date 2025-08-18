import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from '@expo/vector-icons/Ionicons';

import PageStyles from "../other/styles";
import Header from '../components/header';
import { COLORS } from '../other/colors';

import podcasts from '../../assets/files/podcasts.json';
import { useAudioPlayer } from 'expo-audio';

const {width, height} = Dimensions.get('window');

type MusicPlayerProps = {
	setPage: React.Dispatch<React.SetStateAction<string>>
	track: number
}

const imageMap = {
  main: require("../../assets/images/main.png"),
  nain: require("../../assets/images/nain.png"),
  elfe: require("../../assets/images/elfe.png"),
  barbare: require("../../assets/images/barbare.png"),
  magicienne: require("../../assets/images/magicienne.png"),
  ogre: require("../../assets/images/ogre.png"),
};

const audioMap = {
  "saison1-episode1.mp3": require('../../assets/sounds/saison1-episode1.mp3'),
  "saison1-episode2.mp3": require('../../assets/sounds/saison1-episode2.mp3'),
  "saison1-episode3.mp3": require('../../assets/sounds/saison1-episode3.mp3'),
  "saison1-episode4.mp3": require('../../assets/sounds/saison1-episode4.mp3'),
  "saison1-episode5.mp3": require('../../assets/sounds/saison1-episode5.mp3'),
  "saison1-episode6.mp3": require('../../assets/sounds/saison1-episode6.mp3'),
  "saison1-episode7.mp3": require('../../assets/sounds/saison1-episode7.mp3'),
  "saison1-episode8.mp3": require('../../assets/sounds/saison1-episode8.mp3'),
  "saison1-episode9.mp3": require('../../assets/sounds/saison1-episode9.mp3'),
  "saison1-episode10.mp3": require('../../assets/sounds/saison1-episode10.mp3'),
  "saison1-episode11.mp3": require('../../assets/sounds/saison1-episode11.mp3'),
  "saison1-episode12.mp3": require('../../assets/sounds/saison1-episode12.mp3'),
  "saison1-episode13.mp3": require('../../assets/sounds/saison1-episode13.mp3'),
  "saison1-episode14.mp3": require('../../assets/sounds/saison1-episode14.mp3'),
  "saison1-episode15.mp3": require('../../assets/sounds/saison1-episode15.mp3'),
  "saison2-episode16.mp3": require('../../assets/sounds/saison2-episode16.mp3'),
  "saison2-episode17.mp3": require('../../assets/sounds/saison2-episode17.mp3'),
  "saison2-episode18.mp3": require('../../assets/sounds/saison2-episode18.mp3'),
  "saison2-episode19.mp3": require('../../assets/sounds/saison2-episode19.mp3'),
  "saison2-episode20.mp3": require('../../assets/sounds/saison2-episode20.mp3'),
  "saison2-episode21-1.mp3": require('../../assets/sounds/saison2-episode21-1.mp3'),
  "saison2-episode21-2.mp3": require('../../assets/sounds/saison2-episode21-2.mp3'),
  "saison2-episode22.mp3": require('../../assets/sounds/saison2-episode22.mp3'),
  "saison2-episode23.mp3": require('../../assets/sounds/saison2-episode23.mp3'),
  "saison2-episode24.mp3": require('../../assets/sounds/saison2-episode24.mp3'),
  "saison2-episode25.mp3": require('../../assets/sounds/saison2-episode25.mp3'),
  "saison2-episode26-1.mp3": require('../../assets/sounds/saison2-episode26-1.mp3'),
  "saison2-episode26-2.mp3": require('../../assets/sounds/saison2-episode26-2.mp3'),
  "saison2-episode27-1.mp3": require('../../assets/sounds/saison2-episode27-1.mp3'),
  "saison2-episode27-2.mp3": require('../../assets/sounds/saison2-episode27-2.mp3'),
  "saison2-episode28.mp3": require('../../assets/sounds/saison2-episode28.mp3'),
  "saison2-episode29.mp3": require('../../assets/sounds/saison2-episode29.mp3'),
  "saison2-episode30-1.mp3": require('../../assets/sounds/saison2-episode30-1.mp3'),
  "saison2-episode30-2.mp3": require('../../assets/sounds/saison2-episode30-2.mp3'),
  "saison3-episode31.mp3": require('../../assets/sounds/saison3-episode31.mp3'),
  "saison3-episode32.mp3": require('../../assets/sounds/saison3-episode32.mp3'),
  "saison3-episode33.mp3": require('../../assets/sounds/saison3-episode33.mp3'),
  "saison3-episode34.mp3": require('../../assets/sounds/saison3-episode34.mp3'),
  "saison3-episode35.mp3": require('../../assets/sounds/saison3-episode35.mp3'),
  "saison3-episode36.mp3": require('../../assets/sounds/saison3-episode36.mp3'),
  "saison3-episode37.mp3": require('../../assets/sounds/saison3-episode37.mp3'),
  "saison3-episode38.mp3": require('../../assets/sounds/saison3-episode38.mp3'),
  "saison3-episode39.mp3": require('../../assets/sounds/saison3-episode39.mp3'),
  "saison3-episode40.mp3": require('../../assets/sounds/saison3-episode40.mp3'),
  "saison3-episode41.mp3": require('../../assets/sounds/saison3-episode41.mp3'),
  "saison3-episode42.mp3": require('../../assets/sounds/saison3-episode42.mp3'),
  "saison3-episode43.mp3": require('../../assets/sounds/saison3-episode43.mp3'),
  "saison3-episode44.mp3": require('../../assets/sounds/saison3-episode44.mp3'),
};

type ImageKey = keyof typeof imageMap;
type AudioKey = keyof typeof audioMap;

const MusicPlayer: React.FC<MusicPlayerProps> = ({setPage, track}) => {

	const podcastsCount = podcasts.length;
	const [trackIndex, setTrackIndex] = useState(track);
	const [trackTitle, setTrackTitle] = useState("");
	const [trackArtist, setTrackArtist] = useState("");
	const [trackArtwork, setTrackArtwork] = useState<any>(imageMap.main);
	const [isPause, setIsPause] = useState(false);
	const [soundPosition, setSoundPosition] = useState(0);
	const [soundDuration, setSoundDuration] = useState(0);

	const audioSource = require(`../../assets/sounds/saison1-episode1.mp3`);
  	const player = useAudioPlayer(audioSource);

	const launchPlayer = () => {
		try {
      		player.play();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const episode = podcasts[trackIndex];
		setTrackTitle(episode.title);
		setTrackArtist(episode.artist);
		const artworkName = episode.artwork.split("/").slice(-1)[0].split(".")[0] as ImageKey;
    	setTrackArtwork(imageMap[artworkName] || imageMap.main);

		player.pause();
		const fileName = episode.url.split('/').slice(-1)[0] as AudioKey;
		player.replace(audioMap[fileName]);
		player.play();

		setSoundPosition(player.currentTime);
		setSoundDuration(player.duration);
	}, [trackIndex]);

	const togglePlayBack = () => {
		if ((isPause)) {
			player.play();
			setIsPause(false);
		} else {
			player.pause();
			setIsPause(true);
		}
	};

	const nexttrack = () => {
		if (trackIndex < podcastsCount-1) {
      		setTrackIndex(trackIndex + 1);
		};
	};

	const previoustrack = () => {
		if (trackIndex > 0) {
      		setTrackIndex(trackIndex - 1);
		};
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setSoundPosition(player.currentTime);
			setSoundDuration(player.duration ?? 0);
		}, 500);

		return () => clearInterval(interval);
	}, [player]);
	
	useEffect(() => {
		launchPlayer();
	}, []);

	return (
		<View style={PageStyles.page}>
			<Header />
			<View style={PageStyles.content}>
				<View style={MusicPlayerStyles.header}>
          <TouchableOpacity onPress={() => {setPage("Library")}}>
						<Ionicons name="arrow-back" size={30} style={MusicPlayerStyles.arrowBack} />
					</TouchableOpacity>
					<Text style={MusicPlayerStyles.inProgress}>En cours</Text>
					<Ionicons name="arrow-forward" size={30} color={COLORS.MainBack} />
				</View>
				<Image source={trackArtwork ? trackArtwork : require("../../assets/images/main.png")} style={MusicPlayerStyles.imageWrapper} />
				<View style={MusicPlayerStyles.songInfos}>
					<Text style={MusicPlayerStyles.songTitle}>{trackTitle}</Text>
					<Text style={MusicPlayerStyles.songArtist}>{trackArtist}</Text>
				</View>
				<Slider
					style={MusicPlayerStyles.slider}
					value={soundPosition}
					minimumValue={0}
					maximumValue={soundDuration || 1}
					thumbTintColor={COLORS.MainText}
					minimumTrackTintColor={COLORS.MainText}
					maximumTrackTintColor={COLORS.SecondBack}
					onSlidingComplete={ value => player.seekTo(value) }
				/>
				<View style={MusicPlayerStyles.progressLevelDuration}>
					<Text>{`${Math.floor(soundPosition / 60)}:${('0' + Math.round(soundPosition % 60)).slice(-2)}`}</Text>
					<Text>{`${Math.floor(soundDuration / 60)}:${('0' + Math.round(soundDuration % 60)).slice(-2)}`}</Text>
				</View>
				<View style={MusicPlayerStyles.buttons}>
					<TouchableOpacity onPress={previoustrack}>
						<Ionicons name="play-skip-back" size={30} style={MusicPlayerStyles.controlButtons} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => togglePlayBack() }>
						<Ionicons name={!isPause ? 'pause-circle' : 'play-circle'} size={75} style={MusicPlayerStyles.controlButtons} />
					</TouchableOpacity>
					<TouchableOpacity onPress={nexttrack}>
						<Ionicons name="play-skip-forward" size={30} style={MusicPlayerStyles.controlButtons} />
					</TouchableOpacity>
				</View>
			</View>
		</View>
  );
};

const MusicPlayerStyles = StyleSheet.create({
	header: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	inProgress: {
		color: COLORS.MainText,
		fontWeight: "bold",
		fontSize: 16
	},
	songInfos:{
		width: height * 0.3,
		alignSelf: "center",
		textAlign: "left"
	},
	arrowBack: {
		color: COLORS.MainText
	},
	imageWrapper: {
		alignSelf: "center",
		width: height * 0.3,
        height: height * 0.3,
		marginTop: height * 0.1
	},
	songTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: COLORS.MainText,
		marginTop: height * 0.02
	},
	songArtist: {
		fontSize: 14,
		color: COLORS.MainText,
		marginTop: height * 0.01
	},
	controlButtons: {
		color: COLORS.MainText
	},
	buttons: {
		display: "flex",
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginTop: height * 0.05
	},
	progressLevelDuration: {
		width: "100%",
		display: "flex",
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: height * 0.01
	},
	slider: {
		marginTop: height * 0.1
	}
});

export default MusicPlayer;