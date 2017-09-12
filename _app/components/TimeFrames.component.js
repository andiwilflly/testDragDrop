/**
 * @providesModule TimeFrames.component
 */
import React from 'react';
// Native Components
import { View, Text } from 'react-native';
// MobX
import {action, reaction, observable, observe, computed, autorun, asStructure,runInAction} from 'mobx';
import { observer } from 'mobx-react/native';
// Components
import TimeFrame from "TimeFrame.component";


@observer
class TimeFrames extends React.Component {


	render() {
		return (
			<View>
				<TimeFrame key={0} title="Life" index={0} />
				<TimeFrame key={1} title="Year" index={1}/>
				<TimeFrame key={2} title="Month" index={2}/>
				<TimeFrame key={3} title="Week" index={3} />
				<TimeFrame key={4} title="Day" index={4}/>
			</View>
		);
	}
}

export default TimeFrames;