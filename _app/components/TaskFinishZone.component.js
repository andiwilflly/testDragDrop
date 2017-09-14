/**
 * @providesModule TaskFinishZone.component
 */
import React from 'react';
// Native Components
import { View, Text, Animated } from 'react-native';
import _ from "lodash";
// MobX
import {action, reaction, observable, observe, computed, autorun, asStructure,runInAction} from 'mobx';
import { observer } from 'mobx-react/native';


@observer
class TaskFinishZone extends React.Component {

	render() {
		return (
			<Animated.View style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				backgroundColor: 'green',
				width: 100,
				height: 100
			}}>
				<Text> + </Text>
			</Animated.View>
		);
	}
}

export default TaskFinishZone;