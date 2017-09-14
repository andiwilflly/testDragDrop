/**
 * @providesModule Task.component
 */
import React from 'react';
// Native Components
import { View, Dimensions, Text, Animated, StyleSheet, PanResponder } from 'react-native';
import _ from "lodash";
// MobX
import {action, reaction, observable, observe, computed, autorun, asStructure,runInAction} from 'mobx';
import { observer } from 'mobx-react/native';
// Models
import tabFramesModel from 'tabFrames.model';
import tasksModel from 'tasks.model';


@observer
class Task extends React.Component {

	frameHeaderHeight = 50; // TODO: Fix this


	componentWillMount() {
		tasksModel.changeTask(this.props.title, this.props.task.title, {
			pan: new Animated.ValueXY(),
			scale: new Animated.Value(1)
		});

		this._panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: ()=> true,
			onMoveShouldSetPanResponderCapture: ()=> true,

			onPanResponderGrant: (e, gesture)=> {
				// Set the initial value to the current task
				this.task.pan.setOffset({x: this.task.pan.x._value, y: this.task.pan.y._value});
				this.task.pan.setValue({x: 0, y: 0 });
				Animated.spring(
					this.task.scale,
					{ toValue: 1.1, friction: 3 }
				).start();
			},

			// When we drag/pan the object, set the delate to the tasks pan position
			onPanResponderMove: (e, gesture)=> {
				if(this.tabFrame.isFoolScreen)
					Animated.event([ null,
						{ dx: this.task.pan.x, dy: this.task.pan.y },
					])(e, gesture)
			},

			onPanResponderRelease: (e, gesture)=> {
				const isTopLimit = gesture.moveY-e.nativeEvent.locationY < this.frameHeaderHeight;
				const isBottomLimit = gesture.moveY - (e.nativeEvent.locationY - this.task.height) > Window.height;
				const isRightLimit = gesture.moveX - (e.nativeEvent.locationX - this.task.width) > Window.width;
				const isLeftLimit = gesture.moveX - e.nativeEvent.locationX < 0;
				this.task.pan.flattenOffset();
				if(isTopLimit || isBottomLimit || isRightLimit || isLeftLimit) {
					Animated.spring(
						this.task.pan,         // Auto-multiplexed
						{ toValue: { x: 0, y: 0 }} // Back to zero
					).start(()=> {});
				} else {
					// We can set [task] x y positions on component will un mount event ?
				}
				Animated.spring(
					this.task.scale,
					{ toValue: 1, friction: 3 }
				).start();
			}
		});
	}

	
	@computed get task() { return tasksModel.tasks.value[this.props.title].get(this.props.task.title); };

	@computed get tabFrame() { return tabFramesModel.tabFrames.get(this.props.title); };


	render() {
		// Destructure the value of pan from the task
		let { pan, scale } = this.task;

		// Calculate the x and y transform from the pan value
		let [translateX, translateY] = [pan.x, pan.y];

		let rotate = '0deg';

		// Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
		let transform = {transform: [{translateX}, {translateY}]};

		return (
			<View>
				<Animated.View style={ [{
					width: this.task.width,
					height: this.task.height,
					position: 'absolute',
					backgroundColor: 'orange',
					borderColor: 'white',
					borderWidth: 1,
					top: this.task.y,
					left: this.task.x
				}, transform] } { ...this._panResponder.panHandlers }>
					<View>
						<Text>{ this.task.title }</Text>
					</View>
				</Animated.View>
			</View>
		);
	}
}


let Window = Dimensions.get('window');

export default Task;