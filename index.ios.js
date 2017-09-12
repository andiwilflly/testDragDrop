/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View
} from 'react-native';
import TimeFrames from "TimeFrames.component";
// MobX
import { spy } from 'mobx';


export default class testDragDrop extends Component {


	constructor() {
		super();
		spy((event)=> {
			if(event.type === 'action') {
				if(event.name.match('DEVICE-')) return console.log('%c📞 ' + event.name, 'color: gray');
				if(event.name.match('USER-')) return console.log('%c🚀 ' + event.name, 'color: #0083c3;');
				if(event.name.match('@reaction')) return console.log('%c' + event.name, 'color: orange;');
				console.log('%c🦄🌈 ' + event.name, 'color: #03a528;');
			}
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<TimeFrames />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});

AppRegistry.registerComponent('testDragDrop', () => testDragDrop);
