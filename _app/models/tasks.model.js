/**
 * @providesModule tasks.model
 * @flow
 */
import _ from "lodash";
// MobX
import {action, observable, runInAction, extendObservable, autorun, computed, isObservable} from 'mobx';


class Tasks {

	@observable tasks = {
		value: observable.map(),
		status: 'pending'
	};


	getTasks() {
		runInAction(`TASKS-GET-PENDING`, ()=> {
			_.forEach([
				{ title: 'test task 1', status: 1, y: 123, x: 12 },
				{ title: 'test task 2', status: 3, y: 67, x: 125 },
				{ title: 'test task 3', status: 35, y: 145, x: 3 },
				{ title: 'test task 4', status: 9, y: 231, x: 67 },
			], (task)=> {
				this.tasks.value.set(task.title, task);
				this.tasks.status = 'fulfilled';
			});
		});
	}
}


export default new Tasks();