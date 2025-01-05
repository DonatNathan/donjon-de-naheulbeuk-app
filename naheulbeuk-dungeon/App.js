import React, {useEffect} from 'react';
import TrackPlayer, {Capability} from 'react-native-track-player';

import MyStack from "@other/ScreenHandling"

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