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


@observer
class Task extends React.Component {

	frameHeaderHeight = 50; // TODO: Fix this


	constructor(props) {
		super(props);

		this.state = {
			pan: new Animated.ValueXY(),
			scale: new Animated.Value(1)
		};
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: ()=> true,
			onMoveShouldSetPanResponderCapture: ()=> true,

			onPanResponderGrant: (e, gesture)=> {
				// Set the initial value to the current state
				this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
				this.state.pan.setValue({x: 0, y: 0 });
				Animated.spring(
					this.state.scale,
					{ toValue: 1.1, friction: 3 }
				).start();
			},

			// When we drag/pan the object, set the delate to the states pan position
			onPanResponderMove: (e, gesture)=> {
				if(this.tabFrame.isFoolScreen)
					Animated.event([ null,
						{ dx: this.state.pan.x, dy: this.state.pan.y },
					])(e, gesture)
			},

			onPanResponderRelease: (e, gesture)=> {
				const isTopLimit = gesture.moveY-e.nativeEvent.locationY < this.frameHeaderHeight;
				const isBottomLimit = gesture.moveY - (e.nativeEvent.locationY - this.props.task.height) > Window.height;
				const isRightLimit = gesture.moveX - (e.nativeEvent.locationX - this.props.task.width) > Window.width;
				const isLeftLimit = gesture.moveX - e.nativeEvent.locationX < 0;
				this.state.pan.flattenOffset();
				if(isTopLimit || isBottomLimit || isRightLimit || isLeftLimit) {
					Animated.spring(
						this.state.pan,         // Auto-multiplexed
						{ toValue: { x: 0, y: 0 }} // Back to zero
					).start(()=> {});
				}
				Animated.spring(
					this.state.scale,
					{ toValue: 1, friction: 3 }
				).start();
			}
		});
	}

	
	@computed get tabFrame() { return tabFramesModel.tabFrames.get(this.props.title); };

	@computed get defaultY() { return (this.tabFrame.index+1) * this.frameHeaderHeight - this.frameHeaderHeight; };

	@computed get topDragLimit() { return (this.tabFrame.index+1) * this.frameHeaderHeight; };


	render() {
		// Destructure the value of pan from the state
		let { pan, scale } = this.state;

		// Calculate the x and y transform from the pan value
		let [translateX, translateY] = [pan.x, pan.y];

		let rotate = '0deg';

		// Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
		let transform = {transform: [{translateX}, {translateY}, {scale}, {rotate}]};

		return (
			<View>
				<Animated.View style={ [{
					width: this.props.task.width,
					height: this.props.task.height,
					position: 'absolute',
					backgroundColor: 'orange',
					borderColor: 'white',
					borderWidth: 1,
					top: this.props.task.y,
					left: this.props.task.x
				}, transform] } { ...this._panResponder.panHandlers }>
					<View>
						<Text>{ this.props.task.title }</Text>
					</View>
				</Animated.View>
			</View>
		);
	}
}


let Window = Dimensions.get('window');

export default Task;