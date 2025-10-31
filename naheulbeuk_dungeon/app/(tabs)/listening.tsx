import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from '@expo/vector-icons/Ionicons';

import { COLORS } from '../../other/colors';

import podcasts from '../../assets/files/podcasts.json';
import { useAudioPlayer } from 'expo-audio';

type MusicPlayerProps = {
	setPage: React.Dispatch<React.SetStateAction<string>>
	track: number
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({setPage, track}) => {

	const podcastsCount = podcasts.length;
	const [trackIndex, setTrackIndex] = useState(track);
	const [trackTitle, setTrackTitle] = useState("");
	const [trackArtist, setTrackArtist] = useState("");
	const [trackArtwork, setTrackArtwork] = useState<any>("main.png");
	const [isPause, setIsPause] = useState(false);
	const [soundPosition, setSoundPosition] = useState(0);
	const [soundDuration, setSoundDuration] = useState(0);

  	const player = useAudioPlayer(`${process.env.EXPO_PUBLIC_SUPABASE_URL}episodes/saison1-episode1.mp3`);

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
    	setTrackArtwork(episode.artwork);

		player.pause();
		player.replace(`${process.env.EXPO_PUBLIC_SUPABASE_URL}episodes/${episode.url}`);
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

			if (player.duration && player.currentTime >= player.duration - 0.2) {
				nexttrack();
			}
		}, 500);

		return () => clearInterval(interval);
	}, [player, trackIndex]);
	
	useEffect(() => {
		launchPlayer();
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.MainBack, height: "100%", display: "flex", justifyContent: "space-around" }}>
			<View style={MusicPlayerStyles.header}>
				<TouchableOpacity onPress={() => {setPage("Library")}}>
					<Ionicons name="arrow-back" size={30} style={MusicPlayerStyles.arrowBack} />
				</TouchableOpacity>
				<Text style={MusicPlayerStyles.inProgress}>En cours</Text>
				<Ionicons name="arrow-forward" size={30} color={COLORS.MainBack} />
			</View>
			<View>
				<Image source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}images/${trackArtwork}` }} style={MusicPlayerStyles.imageWrapper} resizeMode="contain" />
				<View style={MusicPlayerStyles.songInfos}>
					<Text style={MusicPlayerStyles.songTitle}>{trackTitle}</Text>
					<Text style={MusicPlayerStyles.songArtist}>{trackArtist}</Text>
				</View>
			</View>
			<View style={{width: "80%", alignSelf: "center"}}>
				<Slider
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
		width: 250,
		alignSelf: "center",
		textAlign: "left",
		marginTop: "5%"
	},
	arrowBack: {
		color: COLORS.MainText
	},
	imageWrapper: {
		alignSelf: "center",
		width: "70%",
        height: 250,
	},
	songTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: COLORS.MainText,
	},
	songArtist: {
		fontSize: 14,
		color: COLORS.MainText,
	},
	controlButtons: {
		color: COLORS.MainText
	},
	buttons: {
		display: "flex",
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	progressLevelDuration: {
		width: "100%",
		display: "flex",
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: "5%"
	}
});

export default MusicPlayer;