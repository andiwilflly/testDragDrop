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
// Components
import Tasks from "Tasks.component";


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
			onPanResponderGrant: this.onDragStart,
			onPanResponderMove: this.onDrag,
			onPanResponderRelease: this.onDragEnd
		});
	}


	componentDidMount() {
		this['@reaction tabsFrames.animationInProgress -> [animate tabFrames]'] = reaction(
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
			{ name: '@reaction tabsFrames.animationInProgress -> [animate tabFrames]' }
		);
	}


	componentWillUnmount() {
		this['@reaction tabsFrames.animationInProgress -> [animate tabFrames]']();
	}

	
	@computed get activeTabFrame() { return _.find(tabFramesModel.tabFrames.values(), (tabFrame)=> tabFrame.isActive); };

	@computed get tabFrame() { return tabFramesModel.tabFrames.get(this.props.title); };

	@computed get animationDuration() { return tabFramesModel.animation.duration; };

	@computed get animationInProgress() { return tabFramesModel.animation.inProgress; };

	@computed get transform() { return { transform: [{ translateY: this.tabFrame.pan.y }] }  };

	@computed get defaultY() { return (this.tabFrame.index+1) * this.frameHeaderHeight - this.frameHeaderHeight; };

	@computed get topY() { return -(this.tabFrame.index+1) * this.frameHeaderHeight + this.frameHeaderHeight; };


	onDragStart = (e, gesture)=> {
		if(this.animationInProgress) return;

		this.tabFrame.pan.setOffset({ x: 0, y: this.tabFrame.pan.y._value });
		this.tabFrame.pan.setValue({ x: 0, y: 0 });

		tabFramesModel.setTabFrame(this.props.title, { isActive: !this.tabFrame.isActive });
		tabFramesModel.setAnimationInProgress(true);
	};


	onDrag = (e, gesture)=> {
		if(this.tabFrame.isActive) return;
		Animated.event([ null, { dy: this.tabFrame.pan.y }])(e, gesture);
	};


	onDragEnd = (e, gesture)=> {
		if(this.tabFrame.isActive) {
			Animated.timing( this.tabFrame.pan.y, {
				toValue: this.topY,
				duration: this.animationDuration
			}).start(()=> {
				tabFramesModel.setAnimationInProgress(false);
				this.tabFrame.pan.flattenOffset();
			});
		} else {
			tabFramesModel.setTabFrame(this.props.title, { isActive: gesture.dy < this.defaultY });
			Animated.timing(this.tabFrame.pan.y, {
				toValue: gesture.dy < this.defaultY ? 0 : this.defaultY,
				duration: this.animationDuration
			}).start(()=> {
				tabFramesModel.setAnimationInProgress(false);
				this.tabFrame.pan.flattenOffset();
			});
		}
	};


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
							{ this.tabFrame.isActive ? <Tasks /> : null }
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