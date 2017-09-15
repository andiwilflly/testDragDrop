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
				Animated.spring(this.task.scale, { toValue: 1.1, friction: 3 }).start();
				if(!this.tabFrame.isFoolScreen) return;

				// Set the initial value to the current task
				this.task.pan.setOffset({x: this.task.pan.x._value, y: this.task.pan.y._value});
				this.task.pan.setValue({x: 0, y: 0 });

			},

			onPanResponderMove: (e, gesture)=> {
				if(!this.tabFrame.isFoolScreen) return;
				Animated.event([ null,
					{ dx: this.task.pan.x, dy: this.task.pan.y },
				])(e, gesture)
			},

			onPanResponderRelease: (e, gesture)=> {
				Animated.spring(this.task.scale, { toValue: 1, friction: 3 }).start();
				if(!this.tabFrame.isFoolScreen) return;

				const isTopLimit = gesture.moveY-e.nativeEvent.locationY < this.frameHeaderHeight;
				const isBottomLimit = gesture.moveY - (e.nativeEvent.locationY - this.task.height) > Window.height;
				const isRightLimit = gesture.moveX - (e.nativeEvent.locationX - this.task.width) > Window.width;
				const isLeftLimit = gesture.moveX - e.nativeEvent.locationX < 0;
				this.task.pan.flattenOffset();
				if(isTopLimit || isBottomLimit || isRightLimit || isLeftLimit) {
					Animated.spring(
						this.task.pan,         // Auto-multiplexed
						{ toValue: { x: this.task.x, y: this.task.y }} // Back to zero
					).start(()=> {});
				} else {
					tasksModel.changeTask(this.props.title, this.props.task.title, {
						x: Math.round(this.task.pan.x._value),
						y: Math.round(this.task.pan.y._value),
					});
					this.task.pan.flattenOffset();
				}
			}
		});
	}


	componentDidMount() {
		// Set [task] to [start] position
		Animated.spring(
			this.task.pan,
			{ toValue: { x: this.task.x, y: this.task.y }, duration: 1000 }
		).start(()=> this.task.pan.flattenOffset());
	}

	
	@computed get task() { return tasksModel.tasks.value[this.props.title].get(this.props.task.title); };

	@computed get tabFrame() { return tabFramesModel.tabFrames.get(this.props.title); };

	@computed get transform() { return { transform: [ { translateX: this.task.pan.x }, { translateY: this.task.pan.y }, { scale: this.task.scale } ]}; };


	render() {
		return (
			<View>
				<Animated.View style={ [{
					width: this.task.width,
					height: this.task.height,
					position: 'absolute',
					backgroundColor: 'orange',
					borderColor: 'white',
					borderWidth: 1,
					top: 0,
					left: 0
				}, this.transform] } { ...this._panResponder.panHandlers }>
					<View>
						<Text>{ this.task.title }</Text>
						<Text>x: { this.task.x }</Text>
						<Text>y: { this.task.y }</Text>
					</View>
				</Animated.View>
			</View>
		);
	}
}


let Window = Dimensions.get('window');

export default Task;