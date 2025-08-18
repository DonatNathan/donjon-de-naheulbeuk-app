import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from '@expo/vector-icons/Ionicons';

import PageStyles from "../other/styles";
import Header from '../components/Header';
import { COLORS } from '../other/colors';

import podcasts from '../../assets/files/podcasts.json';
import { useAudioPlayer } from 'expo-audio';

const audioSource = require(`../../assets/sounds/season1/saison1-episode11.mp3`);

const {width, height} = Dimensions.get('window');

type MusicPlayerProps = {
	setPage: React.Dispatch<React.SetStateAction<string>>
	track: number
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({setPage, track}) => {

	const podcastsCount = podcasts.length;
	const [trackIndex, setTrackIndex] = useState(0);
	const [trackTitle, setTrackTitle] = useState("");
	const [trackArtist, setTrackArtist] = useState("");
	const [trackArtwork, setTrackArtwork] = useState("");
	const [isPause, setIsPause] = useState(false);
	const [soundPosition, setSoundPosition] = useState(new Date(0));
	const [soundDuration, setSoundDuration] = useState(new Date(0));

  const player = useAudioPlayer(audioSource);
	
	const progress = 0; // TODO: Change with real progress

	const launchPlayer = async () => {
		try {
      player.play();
			setTrackTitle(podcasts[trackIndex].title);
			setTrackArtist(podcasts[trackIndex].artist);
			setTrackArtwork(`../../assets/images/${podcasts[trackIndex].artwork}`);
		} catch (error) {
			console.log(error);
		}
	};

	const gettrackdata = async () => {
		setTrackTitle(podcasts[trackIndex].title);
		setTrackArtist(podcasts[trackIndex].artist);
		setTrackArtwork(podcasts[trackIndex].artwork);
	};

	const togglePlayBack = async () => {
    if ((isPause)) {
      player.play();
      setIsPause(false);
    } else {
      player.pause();
      setIsPause(true);
    }
	};

	const nexttrack = async () => {
		if (trackIndex < podcastsCount-1) {
      setTrackIndex(trackIndex + 1);
			gettrackdata();
		};
	};

	const previoustrack = async () => {
		if (trackIndex > 0) {
      setTrackIndex(trackIndex - 1);
			gettrackdata();
		};
	};
	
	useEffect(() => {
		launchPlayer();
	}, []);

	// useEffect(() => {
	// 	setSoundPosition(new Date(progress.position * 1000));
	// }, [progress.position])

	// useEffect(() => {
	// 	setSoundDuration(new Date(progress.duration * 1000));
	// }, [progress.duration])

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
				<Image source={require('../../assets/images/main.png')} style={MusicPlayerStyles.imageWrapper} />
				<View style={MusicPlayerStyles.songInfos}>
					<Text style={MusicPlayerStyles.songTitle}>{trackTitle}</Text>
					<Text style={MusicPlayerStyles.songArtist}>{trackArtist}</Text>
				</View>
				<Slider
					style={MusicPlayerStyles.slider}
					// value={progress.position}
					value={0}
					minimumValue={0}
					// maximumValue={progress.duration || 1}
					maximumValue={1}
					thumbTintColor={COLORS.MainText}
					minimumTrackTintColor={COLORS.MainText}
					maximumTrackTintColor={COLORS.SecondBack}
					// onSlidingComplete={async value => await TrackPlayer.seekTo(value) }
				/>
				<View style={MusicPlayerStyles.progressLevelDuration}>
					<Text>{soundPosition.getMinutes()}:{soundPosition.getSeconds() < 10 ? `0${soundPosition.getSeconds()}` : soundPosition.getSeconds()}</Text>
					<Text>{soundDuration.getMinutes()}:{soundDuration.getSeconds() < 10 ? `0${soundDuration.getSeconds()}` : soundDuration.getSeconds()}</Text>
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