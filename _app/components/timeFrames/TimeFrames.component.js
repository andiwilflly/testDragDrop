/**
 * @providesModule TimeFrames.component
 */
import React from 'react';
// Native Components
import { View, Text, Animated } from 'react-native';
import _ from "lodash";
// MobX
import {action, reaction, observable, observe, computed, autorun, asStructure,runInAction} from 'mobx';
import { observer } from 'mobx-react/native';
// Models
import tabFramesModel from 'tabFrames.model';
import tasksModel from 'tasks.model';
// Components
import TimeFrame from "TimeFrame.component";


@observer
class TimeFrames extends React.Component {

	tabFramesList = ["Life", "Year", "Month", "Week", "Day"];


	constructor() {
		super();

		tasksModel.getTasks();
		_.forEach(this.tabFramesList, (title, index)=> {
			tabFramesModel.createTabFrame({
				index: index,
				title: title,
				isActive: title === 'Day',
				isFoolScreen: false,
				pan: new Animated.ValueXY()
			});

		});
	}

	render() {
		return (
			<View>
				{ _.map(this.tabFramesList, (title, index)=> <TimeFrame key={index} title={ title } index={index} />) }
			</View>
		);
	}
}

export default TimeFrames;