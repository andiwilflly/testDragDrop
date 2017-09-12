/**
 * @providesModule tabFrames.model
 * @flow
 */
import _ from 'lodash';
// MobX
import {action, observable, runInAction, extendObservable, autorun, computed, isObservable} from 'mobx';


class TabFrames {

	tabFrames = observable.map();


	createTabFrame = ({ index=0, title='', isActive=false })=> {
		if(!title) return runInAction(`TAB-FRAMES-CREATE-ERROR`, ()=>{});
		runInAction(`TAB-FRAMES-CREATE-SUCCESS [${title}]`, ()=> {
			this.tabFrames.set(title, {
				index,
				title,
				isActive
			});
		});
	};


	setTabFrame = (title, props)=> {
		const tabFrame = this.tabFrames.get(title);
		if(!tabFrame) return runInAction('TAB-FRAMES-SET-ERROR', ()=> {});

		runInAction(`TAB-FRAMES-SET-SUCCESS ${title}`, ()=> {
			_.forEach(this.tabFrames.values(), (_tabFrame)=> {
				this.tabFrames.set(_tabFrame.title, { ..._tabFrame, ...props, isActive: _tabFrame.index === tabFrame.index });
			});
		});
	};
}


export default new TabFrames();