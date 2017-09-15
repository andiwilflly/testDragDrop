/**
 * @providesModule tabFrames.model
 * @flow
 */
import _ from 'lodash';
// MobX
import {action, observable, runInAction, extendObservable, autorun, computed, isObservable} from 'mobx';


class TabFrames {

	@observable animation = {
		frameHeaderHeight: 50,
		inProgress: false,
		duration: 400,
		activeTabHeight: 200
	};

	@observable animationInProgress = false;

	tabFrames = observable.map();


	findTabFrame(params = {}) {
		const tabFrame = _.find(this.tabFrames.values(), params);
		if(!tabFrame) return runInAction('TAB-FRAMES-FIND-TAB-FRAME-ERROR', ()=> {});
		runInAction(`TAB-FRAMES-FIND-TAB-FRAME-SUCCESS ${tabFrame.title}`, ()=> {});
		return tabFrame;
	};


	setAnimationInProgress(animationInProgress = false) {
		runInAction(`TAB-FRAMES-ANIMATION-IN-PROGRESS ${animationInProgress}`, ()=> {
			this.animation.inProgress = animationInProgress;
		});
	}


	createTabFrame = ({ index=0, title='', isActive=false, isFoolScreen=false, pan })=> {
		if(!title) return runInAction(`TAB-FRAMES-CREATE-ERROR`, ()=>{});
		runInAction(`TAB-FRAMES-CREATE-SUCCESS [${title}]`, ()=> {
			this.tabFrames.set(title, {
				index,
				title,
				isActive,
				isFoolScreen,
				pan
			});
		});
	};


	setTabFrame = (title, props)=> {
		const tabFrame = this.tabFrames.get(title);
		if(!tabFrame) return runInAction('TAB-FRAMES-SET-ERROR', ()=> {});

		runInAction(`TAB-FRAMES-SET-SUCCESS ${title}`, ()=> {
			_.forEach(this.tabFrames.values(), (_tabFrame)=> {
				let newTabFrame = { ..._tabFrame, ...props };
				if(props.isActive) newTabFrame.isActive = (title === _tabFrame.title) ? props.isActive : false;
				if(props.isFoolScreen) newTabFrame.isFoolScreen = (title === _tabFrame.title) ? props.isFoolScreen : false;

				if(!newTabFrame.isActive && newTabFrame.isFoolScreen) newTabFrame.isFoolScreen = false;

				this.tabFrames.set(_tabFrame.title, newTabFrame);
			});
		});
	};
}


export default new TabFrames();