/**
 * @providesModule TimeFrame.component
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
// Models
import tabFramesModel from 'tabFrames.model';


// @SOURCE: https://moduscreate.com/animated_drag_and_drop_with_react_native/
// @SOURCE: https://mindthecode.com/getting-started-with-the-panresponder-in-react-native/
// @SOURCE: http://browniefed.com/blog/react-native-animated-api-with-panresponder/
@observer
class TimeFrame extends React.Component {


	frameHeaderHeight = 50;


	constructor(props) {
		super(props);

		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: ()=> true,
			onMoveShouldSetPanResponderCapture: ()=> true,
			onPanResponderGrant: (evt, gestureState)=> {
				if(this.animationInProgress) return;

				this.tabFrame.pan.setOffset({ x: 0, y: this.tabFrame.pan.y._value });
				this.tabFrame.pan.setValue({ x: 0, y: 0 });
				if(this.tabFrame.isActive) {
					tabFramesModel.setTabFrame(this.props.title, { isActive: false });
				} else {
					tabFramesModel.setTabFrame(this.props.title, { isActive: true });
				}

				tabFramesModel.setAnimationInProgress(true);
			},
			onPanResponderMove: (evt, gestureState)=> {
				if(!this.tabFrame.isActive)
					Animated.event([ null, {
						dy: this.tabFrame.pan.y
					}])(evt, gestureState);
			},
			onPanResponderRelease: (e, gesture)=> {
				if(this.tabFrame.isActive) {
					this.tabFrame.pan.flattenOffset();
					Animated.timing(
						this.tabFrame.pan.y,
						{
							toValue: -(this.tabFrame.index+1) * this.frameHeaderHeight + this.frameHeaderHeight,
							duration: this.animationDuration,
						}
					).start(()=> {
						tabFramesModel.setAnimationInProgress(false);
						this.tabFrame.pan.flattenOffset();
					});
				} else {
					const bottomY = (this.tabFrame.index+1) * this.frameHeaderHeight - this.frameHeaderHeight;
					tabFramesModel.setTabFrame(this.props.title, { isActive: gesture.dy < bottomY });
					Animated.timing(
						this.tabFrame.pan.y,
						{
							toValue: gesture.dy < bottomY ? 0 : bottomY,
							duration: this.animationDuration,
						}
					).start(()=> {
						tabFramesModel.setAnimationInProgress(false);
						this.tabFrame.pan.flattenOffset();
					});
				}
			}
		});
	}


	componentDidMount() {
		this['@reaction tabFramesModel.animationInProgress'] = reaction(
			()=> this.animationInProgress,
			()=> {
				if(this.animationInProgress) return;
				// Case when we drag all [tabFrames] to their default positions
				if(!this.activeTabFrame) {
					this.tabFrame.pan.flattenOffset();
					Animated.timing(
						this.tabFrame.pan.y,
						{ toValue: 0, duration: this.animationDuration }
					).start();
				}
				// Case when we drag to the bottom all [tabFrames] that placed under the [activeTabFrame]
				if(this.activeTabFrame && this.activeTabFrame.index < this.tabFrame.index) {
					Animated.timing(
						this.tabFrame.pan.y,
						{ toValue: Window.height, duration: this.animationDuration }
					).start();
				}
			},
			{ name: '@reaction tabsFrames.animationInProgress' }
		);
	}


	componentWillUnmount() {
		this['@reaction tabsFrames.animationInProgress']();
	}

	
	@computed get activeTabFrame() { return _.find(tabFramesModel.tabFrames.values(), (tabFrame)=> tabFrame.isActive); };

	@computed get tabFrame() { return tabFramesModel.tabFrames.get(this.props.title); };

	@computed get animationDuration() { return tabFramesModel.animation.duration; };

	@computed get animationInProgress() { return tabFramesModel.animation.inProgress; };

	@computed get transform() { return { transform: [{ translateY: this.tabFrame.pan.y }] }  };


	render() {
		return (
			<View style={styles.mainContainer}>
				<View style={[ styles.draggableContainer, styles[this.props.title].tab ]}>
					<Animated.View
						style={[{
							width: Window.width,
							height: Window.height,
							left: 0,
						}, styles[this.props.title].content, this.transform ]}>
						<Text { ...this.panResponder.panHandlers } style={[
							styles.text, {
								backgroundColor: 'black',
								height: this.frameHeaderHeight - 20
							}
						]}>{ this.props.title } { +this.tabFrame.isActive }</Text>
						<View>
							<Text>[ animation { this.animationInProgress ? 'running' : 'stopped' } ]</Text>
						</View>
					</Animated.View>
				</View>
			</View>
		);
	}
}

export default TimeFrame;


let Window = Dimensions.get('window');
let styles = {
	mainContainer: {
		flex    : 1
	},
	text        : {
		marginTop   : 5,
		marginLeft  : 5,
		marginRight : 5,
		textAlign   : 'center',
		color       : '#fff'
	},
	draggableContainer: {
		position    : 'absolute',
		left        : 0,
	},
	'Life': {
		tab: { transform: [{ translateY: 0 }] },
		content: { backgroundColor: 'orange' }
	},
	'Year': {
		tab: { transform: [{ translateY: 50 }] },
		content: { backgroundColor: 'blue' }
	},
	'Month': {
		tab: { transform: [{ translateY: 100 }] },
		content: { backgroundColor: 'green' }
	},
	'Week': {
		tab: { transform: [{ translateY: 150 }] },
		content: { backgroundColor: 'darkred' }
	},
	'Day': {
		tab: { transform: [{ translateY: 200 }] },
		content: { backgroundColor: 'gray' }
	},
};