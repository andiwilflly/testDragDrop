/**
 * @providesModule tabFrames.model
 * @flow
 */
import _ from 'lodash';
// MobX
import {action, observable, runInAction, extendObservable, autorun, computed, isObservable} from 'mobx';


class TabFrames {

	@observable animation = {
		inProgress: false,
		duration: 400
	};

	@observable animationInProgress = false;

	tabFrames = observable.map();


	setAnimationInProgress(animationInProgress = false) {
		runInAction(`TAB-FRAMES-ANIMATION-IN-PROGRESS ${animationInProgress}`, ()=> {
			this.animation.inProgress = animationInProgress;
		});
	}


	createTabFrame = ({ index=0, title='', isActive=false, pan })=> {
		if(!title) return runInAction(`TAB-FRAMES-CREATE-ERROR`, ()=>{});
		runInAction(`TAB-FRAMES-CREATE-SUCCESS [${title}]`, ()=> {
			this.tabFrames.set(title, {
				index,
				title,
				isActive,
				pan
			});
		});
	};


	setTabFrame = (title, props)=> {
		const tabFrame = this.tabFrames.get(title);
		if(!tabFrame) return runInAction('TAB-FRAMES-SET-ERROR', ()=> {});

		runInAction(`TAB-FRAMES-SET-SUCCESS ${title}`, ()=> {
			_.forEach(this.tabFrames.values(), (_tabFrame)=> {
				this.tabFrames.set(_tabFrame.title, { ..._tabFrame, ...props, isActive: (title === _tabFrame.title ? props.isActive : false) });
			});
		});
	};
}


export default new TabFrames();