import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native';
import TrackPlayer, {Capability, State, Event, useProgress, useTrackPlayerEvents} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Icon} from '@rneui/themed';

import PageStyles from "../other/Styles";
import Header from '../components.js/Header';
import { COLORS } from '../other/Colors';
import podcasts from '../../assets/files/podcasts.json';

const {width, height} = Dimensions.get('window');

const MusicPlayer = ({setPage, track}) => {
  
	const podcastsCount = podcasts.length;
	const [trackIndex, setTrackIndex] = useState();
	const [trackTitle, setTrackTitle] = useState();
	const [trackArtist, setTrackArtist] = useState();
	const [trackArtwork, setTrackArtwork] = useState();
	const [soundState, setSoundState] = useState(State.Playing);
	const [soundPosition, setSoundPosition] = useState(new Date(0));
	const [soundDuration, setSoundDuration] = useState(new Date(0));
	
	const progress = useProgress();

	const setupPlayer = async () => {
		try {
			await TrackPlayer.setupPlayer();
			await TrackPlayer.updateOptions({
				capabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.SkipToPrevious
				],
			});
			await TrackPlayer.add(podcasts);
			await gettrackdata();
			await TrackPlayer.play();
		} catch (error) {
			console.log(error);
		}
	};

	// TODO : Fix the deprecation
	useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
		if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
			const track = await TrackPlayer.getTrack(event.nextTrack);
			setTrackIndex(event.nextTrack);
			setTrackTitle(track.title);
			setTrackArtist(track.artist);
			setTrackArtwork(track.artwork);
		}
	});

	const gettrackdata = async () => {
		let trackIndex = await TrackPlayer.getActiveTrackIndex();
		let trackObject = await TrackPlayer.getTrack(trackIndex);
		setTrackIndex(trackIndex);
		setTrackTitle(trackObject.title);
		setTrackArtist(trackObject.artist);
		setTrackArtwork(trackObject.artwork);
	};

	const togglePlayBack = async () => {
		const currentTrack = await TrackPlayer.getActiveTrackIndex();
		if (currentTrack != null) {
			if ((soundState == State.Paused)) {
				await TrackPlayer.play();
				setSoundState(State.Playing);
			} else {
				await TrackPlayer.pause();
				setSoundState(State.Paused);
			}
		}
	};

	const nexttrack = async () => {
		if (trackIndex < podcastsCount-1) {
			await TrackPlayer.skipToNext();
			gettrackdata();
		};
	};

	const previoustrack = async () => {
		if (trackIndex > 0) {
			await TrackPlayer.skipToPrevious();
			gettrackdata();
		};
	};
	
	useEffect(() => {
		setupPlayer();
	}, []);

	useEffect(() => {
		setSoundPosition(new Date(progress.position * 1000));
	}, [progress.position])

	useEffect(() => {
		setSoundDuration(new Date(progress.duration * 1000));
	}, [progress.duration])

	return (
		<View style={PageStyles.page}>
			<Header />
			<View style={PageStyles.content}>
				<View style={MusicPlayerStyles.header}>
					<TouchableOpacity onPress={() => setPage("Library")}>
						<Icon name="arrow-back" type="Ionicons" size={30} style={MusicPlayerStyles.arrowBack} />
					</TouchableOpacity>
					<Text style={MusicPlayerStyles.inProgress}>En cours</Text>
					<Icon name="arrow-forward" type="Ionicons" size={30} color={COLORS.MainBack} />
				</View>
				<Image source={trackArtwork} style={MusicPlayerStyles.imageWrapper} />
				<View style={MusicPlayerStyles.songInfos}>
					<Text style={MusicPlayerStyles.songTitle}>{trackTitle}</Text>
					<Text style={MusicPlayerStyles.songArtist}>{trackArtist}</Text>
				</View>
				<Slider
					style={MusicPlayerStyles.slider}
					value={progress.position}
					minimumValue={0}
					maximumValue={progress.duration}
					thumbTintColor={COLORS.MainText}
					minimumTrackTintColor={COLORS.MainText}
					maximumTrackTintColor={COLORS.SecondBack}
					onSlidingComplete={async value => await TrackPlayer.seekTo(value) }
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
						<Ionicons name={soundState === State.Playing ? 'pause-circle' : 'play-circle'} size={75} style={MusicPlayerStyles.controlButtons} />
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