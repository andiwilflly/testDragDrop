/**
 * @providesModule Tasks.component
 */
import React from 'react';
// Native Components
import { View, Text } from 'react-native';
import _ from "lodash";
// MobX
import {action, reaction, observable, observe, computed, autorun, asStructure,runInAction} from 'mobx';
import { observer } from 'mobx-react/native';
// Components
import Task from "Task.component";


@observer
class Tasks extends React.Component {


	render() {
		return (
			<View>
				<Text>TASKS []</Text>
			</View>
		);
	}
}

export default Tasks;