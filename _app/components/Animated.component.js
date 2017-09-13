/**
 * @providesModule Animated.component
 */
import React from 'react';
import _ from "lodash";
// Native Components
import {  Component,
	StyleSheet,
	View,
	Text,
	PanResponder,
	Animated,
	Easing,
	Dimensions } from 'react-native';
// MobX
import {action, reaction, observable, observe, computed, autorun, asStructure,runInAction} from 'mobx';
import { observer } from 'mobx-react/native';


@observer
class Draggable extends React.Component {


	constructor() {
		super();

		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: ()=> true,
			onMoveShouldSetPanResponderCapture: ()=> true,
			onPanResponderGrant: (evt, gestureState)=> {
				this.props.onDragStart();
			},
			onPanResponderMove: (evt, gestureState)=> {
				this.props.onDrag();
			},
			onPanResponderRelease: (e, gesture)=> {
				this.props.onDragEnd();
			}
		});
	}


	render() {
		return (
			<Animated.View
				style={[ this.props.style, this.props.transform ]}>
				{ this.props.children }
			</Animated.View>
		);
	}
}

export default Draggable;
