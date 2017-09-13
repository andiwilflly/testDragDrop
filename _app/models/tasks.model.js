/**
 * @providesModule tasks.model
 * @flow
 */
// MobX
import {action, observable, runInAction, extendObservable, autorun, computed, isObservable} from 'mobx';


class Tasks {

	@observable tasks = observable.map();


}


export default new Tasks();