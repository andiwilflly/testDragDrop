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
			onPanResponderGrant: this.onDragStart,
			onPanResponderMove: this.onDrag,
			onPanResponderRelease: this.onDragEnd
		});
	}


	componentDidMount() {
		Animated.timing( this.task.pan, {
			toValue: { x: this.task.x, y: this.task.y },
			duration: 1000
		}).start(()=> this.task.pan.flattenOffset());
	}

	
	@computed get task() { return tasksModel.tasks.value[this.props.title].get(this.props.task.title); };

	@computed get tabFrame() { return tabFramesModel.tabFrames.get(this.props.title); };

	@computed get transform() { return { transform: [ { translateX: this.task.pan.x }, { translateY: this.task.pan.y }, { scale: this.task.scale } ]}; };

	@computed get backgroundColor() { return `rgb(${this.task.status}29,${this.task.status}0,${this.task.status}0)`; };


	onDragStart = (e, gesture)=> {
		Animated.spring(this.task.scale, { toValue: 1.1, friction: 3 }).start();
		if(!this.tabFrame.isActive) return;

		// Set the initial value to the current task
		this.task.pan.setOffset({x: this.task.pan.x._value, y: this.task.pan.y._value});
		this.task.pan.setValue({x: 0, y: 0 });
	};


	onDrag = (e, gesture)=> {
		if(!this.tabFrame.isActive) return;
		Animated.event([ null, { dx: this.task.pan.x, dy: this.task.pan.y } ])(e, gesture);
	};


	onDragEnd = (e, gesture)=> {
		Animated.spring(this.task.scale, { toValue: 1, friction: 3 }).start();
		if(!this.tabFrame.isActive) return;
		this.task.pan.flattenOffset();

		const newX = Math.round(this.task.pan.x._value);
		const newY = Math.round(this.task.pan.y._value);

		const isTopLimit = newY <= 0;
		const isBottomLimit = newY > Window.height - this.task.height;
		const isRightLimit = newX > Window.width - this.task.width;
		const isLeftLimit = newX < 0;
		const isLimit = isTopLimit || isBottomLimit || isRightLimit || isLeftLimit;

		if(isLimit) {
			// Move back to [previous] position of [task]
			Animated.spring(this.task.pan, { toValue: { x: this.task.x, y: this.task.y }} ).start(()=> {});
		} else {
			// Change [task] position in [taskModel]
			tasksModel.changeTask(this.props.title, this.props.task.title, { x: newX, y: newY });
		}
	};


	render() {
		if(!this.tabFrame.isActive) return (
			<View>
				<View style={ [{
					width: this.task.width,
					height: this.task.height,
					position: 'absolute',
					backgroundColor: this.backgroundColor,
					color: 'white',
					borderColor: 'white',
					borderWidth: 1,
					top: this.task.y,
					left: this.task.x
				}] } { ...this._panResponder.panHandlers }>
					<View>
						<Text>(fake)</Text>
					</View>
				</View>
			</View>
		);

		return (
			<View>
				<Animated.View style={ [{
					width: this.task.width,
					height: this.task.height,
					position: 'absolute',
					backgroundColor: this.backgroundColor,
					color: 'white',
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