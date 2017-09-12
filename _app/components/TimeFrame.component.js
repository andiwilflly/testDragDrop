/**
 * @providesModule TimeFrame.component
 */
import React from 'react';
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
//Models
import tabFramesModel from 'tabFrames.model';


// @SOURCE: https://moduscreate.com/animated_drag_and_drop_with_react_native/
// @SOURCE: https://mindthecode.com/getting-started-with-the-panresponder-in-react-native/
// @SOURCE: http://browniefed.com/blog/react-native-animated-api-with-panresponder/
@observer
class TimeFrame extends React.Component {


	frameHeaderHeight = 50;


	constructor(props) {
		super(props);

		this.state = {
			pan: new Animated.ValueXY()
		};


		tabFramesModel.createTabFrame({
			index: props.index,
			title: props.title,
			isActive: props.index === 0
		});

		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: ()=> true,
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderGrant: (evt, gestureState)=> {
				this.state.pan.setOffset({ x: 0, y: this.state.pan.y._value });
				this.state.pan.setValue({ x: 0, y: 0 });

				// if(!this.tabFrame.isActive)
				// 	Animated.spring(
				// 		this.state.pan,
				// 		{ toValue: { x: 0, y: -(this.tabFrame.index+1) * 50 }}
				// 	).start(()=> {
				// 		tabFramesModel.setTabFrame(this.tabFrame.title, { isActive: true });
				// 		console.log(this.state.pan.y);
				// 	});
			},
			onPanResponderMove: (evt, gestureState)=> {
					Animated.event([ null, {
						dx: this.state.pan.x,
						dy: this.state.pan.y
					}])(evt, gestureState);
			},
			onPanResponderRelease: (e, gesture)=> {
				this.state.pan.flattenOffset();
			}
		});
	}


	componentDidMount() {
		this['@reaction tabsFrame.change'] = reaction(
			()=> this.tabFrame.isActive,
			()=> {
				//console.log('changes...', this.tabFrame.isActive);
			},
			{ name: '@reaction tabsFrame.change' }
		);
	}


	componentWillUnmount() {
		this['@reaction tabsFrame.change']();
	}

	
	@computed get tabFrame() { return tabFramesModel.tabFrames.get(this.props.title); };

	get transform() { return { transform: [{ translateY: this.state.pan.y }] }  };


	render() {
		return (
			<View style={styles.mainContainer}>
				<View style={[ styles.draggableContainer, styles[this.props.title].tab ]}>
					<Animated.View
						{ ...this.panResponder.panHandlers }
						style={[{
							width: Window.width,
							height: Window.height,
							left: 0,
						}, styles[this.props.title].content, this.transform ]}>
						<Text style={ styles.text }>{ this.props.title } { +this.tabFrame.isActive }</Text>
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
		tab: { zIndex: 1, top: 100 },
		content: { backgroundColor: 'orange' }
	},
	'Year': {
		tab: { zIndex: 2, top: 150 },
		content: { backgroundColor: 'blue' }
	},
	'Month': {
		tab: {zIndex: 3, top: 200 },
		content: { backgroundColor: 'green' }
	},
	'Week': {
		tab: {zIndex: 4, top: 250 },
		content: { backgroundColor: 'darkred' }
	},
	'Day': {
		tab: {zIndex: 5, top: 300 },
		content: { backgroundColor: 'gray' }
	},
};