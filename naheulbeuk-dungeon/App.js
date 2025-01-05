import React, {useEffect} from 'react';

import MyStack from "./src/other/ScreenHandling"
import TrackPlayer, {Capability} from 'react-native-track-player';

import podcasts from './assets/files/podcasts.json';

const App = () => {

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
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setupPlayer();
	}, []);

	return (
		<MyStack />
	);
};

export default App;