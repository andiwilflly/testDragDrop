/**
 * @providesModule Task.component
 */
import React from 'react';
// Native Components
import { View, Text, Animated, StyleSheet, PanResponder } from 'react-native';
import _ from "lodash";
// MobX
import {action, reaction, observable, observe, computed, autorun, asStructure,runInAction} from 'mobx';
import { observer } from 'mobx-react/native';


@observer
class Task extends React.Component {


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

			onPanResponderGrant: (e, gestureState)=> {
				// Set the initial value to the current state
				this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
				this.state.pan.setValue({x: 0, y: 0 });
				Animated.spring(
					this.state.scale,
					{ toValue: 1.1, friction: 3 }
				).start();
			},

			// When we drag/pan the object, set the delate to the states pan position
			onPanResponderMove: Animated.event([
				null, {dx: this.state.pan.x, dy: this.state.pan.y},
			]),

			onPanResponderRelease: (e, {vx, vy})=> {
				// Flatten the offset to avoid erratic behavior
				this.state.pan.flattenOffset();
				Animated.spring(
					this.state.scale,
					{ toValue: 1, friction: 3 }
				).start();
			}
		});

		this.state.pan.setOffset({x: 67, y:  0 });
		this.state.pan.setValue({x: 0, y: 0 });
		this.state.pan.flattenOffset();
	}


	render() {
		// Destructure the value of pan from the state
		let { pan, scale } = this.state;

		// Calculate the x and y transform from the pan value
		let [translateX, translateY] = [pan.x, pan.y];

		let rotate = '0deg';

		// Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
		let transform = {transform: [{translateX}, {translateY}, {rotate}, {scale}]};

		return (
			<View>
				<Animated.View style={ [{
					width: 100,
					height: 100,
					position: 'absolute',
					backgroundColor: 'orange',
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

export default Task;