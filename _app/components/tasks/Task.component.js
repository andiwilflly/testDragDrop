/**
 * @providesModule Task.component
 */
import React from 'react';
// Native Components
import { View, Dimensions, Text, Animated, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
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
			duration: 700
		}).start(()=> this.task.pan.flattenOffset());
	}


	@computed get task() { return tasksModel.tasks.value[this.props.title].get(this.props.task.title); };

	@computed get isDraggableTask() { return this.tabFrame.isActive && this.isSelectedTask; };

	@computed get isSelectedTask() { return tasksModel.selectedTask && tasksModel.selectedTask.title === this.task.title; };

	@computed get tabFrame() { return tabFramesModel.tabFrames.get(this.props.title); };

	@computed get topY() { return (this.tabFrame.index+1) * this.frameHeaderHeight + this.frameHeaderHeight; };

	@computed get transform() { return { transform: [ { translateX: this.task.pan.x }, { translateY: this.task.pan.y }, { scale: this.task.scale } ]}; };

	@computed get backgroundColor() { return `rgb(${this.task.status}29,${this.task.status}0,${this.task.status}0)`; };


	onDragStart = (e, gesture)=> {
		Animated.spring(this.task.scale, { toValue: 1.1, friction: 3 }).start();

		// Set the initial value to the current task
		this.task.pan.setOffset({x: this.task.pan.x._value, y: this.task.pan.y._value});
		this.task.pan.setValue({x: 0, y: 0 });
	};


	onDrag = (e, gesture)=> {
		if(!this.isDraggableTask) return;
		Animated.event([ null, { dx: this.task.pan.x, dy: this.task.pan.y } ])(e, gesture);
	};


	onDragEnd = (e, gesture)=> {
		Animated.spring(this.task.scale, { toValue: 1, friction: 3 }).start();

		if(!this.isDraggableTask) return;
		this.task.pan.flattenOffset();

		const newX = Math.round(this.task.pan.x._value);
		const newY = Math.round(this.task.pan.y._value);

		const isTopLimit = newY <= 0;
		const isBottomLimit = newY > Window.height - this.task.height;
		const isRightLimit = newX > Window.width - this.task.width;
		const isLeftLimit = newX < 0;
		const isLimit = isTopLimit || isBottomLimit || isRightLimit || isLeftLimit;

		const dropToFrameIndex = Math.floor((this.topY - Math.abs(newY)) / this.frameHeaderHeight);
		const isDropTaskToTopFrame = isTopLimit && dropToFrameIndex >=0 && dropToFrameIndex < this.tabFrame.index && !this.tabFrame.isFoolScreen;
		const isDropTaskToBottomFrame = newY > tabFramesModel.animation.activeTabHeight - tabFramesModel.animation.frameHeaderHeight;

		if(isDropTaskToTopFrame) {
			const dropToFrameIndex = Math.floor((this.topY - Math.abs(newY)) / this.frameHeaderHeight);
			const dropToTabFrame = tabFramesModel.findTabFrame({ index: dropToFrameIndex });
			this.moveTaskToOtherFrame(dropToTabFrame);
		} else
		if(isDropTaskToBottomFrame) {
			let dropToFrameIndex = this.tabFrame.index + Math.round((newY - (tabFramesModel.animation.activeTabHeight - tabFramesModel.animation.frameHeaderHeight)) / this.frameHeaderHeight);
			if(dropToFrameIndex >= tabFramesModel.tabFrames.size) dropToFrameIndex = tabFramesModel.tabFrames.size - 1;
			const dropToTabFrame = tabFramesModel.findTabFrame({ index: dropToFrameIndex });
			this.moveTaskToOtherFrame(dropToTabFrame);
		} else
		if(isLimit) {
			// Move back to [previous] position of [task]
			Animated.spring(this.task.pan, { toValue: { x: this.task.x, y: this.task.y }} ).start(()=> {});
		} else {
			// Change [task] position in [taskModel]
			tasksModel.changeTask(this.props.title, this.props.task.title, { x: newX, y: newY });
		}
	};


	moveTaskToOtherFrame(dropToTabFrame) {
		// TODO: Fix for last frame
		tabFramesModel.setTabFrame(dropToTabFrame.title, { isActive: true });
		tabFramesModel.setAnimationInProgress(true);

		// Here we crete new [task] for [dropToTabFrame] and remove this [task] from current [tabFrame]
		tasksModel.createTask(dropToTabFrame.title, { ...this.task });
		tasksModel.removeTask(this.props.title, this.props.task.title);
		tabFramesModel.setAnimationInProgress(false);
	}


	render() {
		if(!this.tabFrame.isActive || !this.isSelectedTask) return (
			<TouchableOpacity onPress={ ()=> this.isSelectedTask ? false : tasksModel.selectTask(this.task) }>
				<View style={ [{
					width: this.task.width,
					height: this.task.height,
					position: 'absolute',
					backgroundColor: this.backgroundColor,
					borderColor: 'white',
					borderWidth: 1,
					top: this.task.y,
					left: this.task.x
				}] } { ...this._panResponder.panHandlers }>
					<View>
						<Text>(fake)</Text>
					</View>
				</View>
			</TouchableOpacity>
		);

		return (
			<View>
				<Animated.View style={ [{
					width: this.task.width,
					height: this.task.height,
					position: 'absolute',
					backgroundColor: this.backgroundColor,
					borderColor: 'black',
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