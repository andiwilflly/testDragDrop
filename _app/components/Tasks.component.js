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
// Models
import tasksModel from "tasks.model";
// Components
import Task from "Task.component";


@observer
class Tasks extends React.Component {

	@computed get tasks() { return tasksModel.tasks; };


	render() {
		if(this.tasks.status === 'pending') return <Text>loading...</Text>;
		return (
			<View>
				{ _.map(this.tasks.value.values(), (task, index)=> {
					return <Task task={ task } key={index} />;
				}) }
			</View>
		);
	}
}

export default Tasks;