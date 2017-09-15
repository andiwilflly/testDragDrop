/**
 * @providesModule tasks.model
 * @flow
 */
import _ from "lodash";
// Native Components
import { Animated } from 'react-native';
// MobX
import {action, observable, runInAction, extendObservable, autorun, computed, isObservable} from 'mobx';


class Tasks {

	@observable tasks = {
		value: {
			// [frameTitle]: observable.map()
		},
		status: 'pending'
	};


	getTasks() {
		runInAction(`TASKS-GET-PENDING`, ()=> {
			_.forEach(["Life", "Year", "Month", "Week", "Day"], (frameTitle)=> {
				this.tasks.value[frameTitle] = observable.map();
				_.forEach([
					{ title: 'test task 1' + frameTitle, status: 1, y: 123, x: 12, width: 100, height: 100 },
					{ title: 'test task 2' + frameTitle, status: 3, y: 67, x: 125, width: 70, height: 70 },
					{ title: 'test task 3' + frameTitle, status: 7, y: 145, x: 3, width: 130, height: 130 },
					{ title: 'test task 4' + frameTitle, status: 9, y: 431, x: 190, width: 150, height: 50 },
				], (task)=> {
					this.createTask(frameTitle, task);
					this.tasks.status = 'fulfilled';
				});
			});
		});
	}


	find(frameTitle, params = {}) {
		const task = _.find(this.tasks.value[frameTitle].values(), params);
		if(!task) return runInAction('TASKS-FIND-TASK-ERROR', ()=> {});
		runInAction(`TASKS-FIND-TASK-SUCCESS ${task.title}`, ()=> {});
		return task;
	};


	createTask(frameTitle, task) {
		runInAction(`TASKS-CREATE-TASK ${task.title}`, ()=> {
			this.tasks.value[frameTitle].set(task.title, {
				...task,
				pan: new Animated.ValueXY(),
				scale: new Animated.Value(1)
			});
		});
	}


	changeTask(frameTitle, title, newTask) {
		const task = this.tasks.value[frameTitle].get(title);
		if(!task) return runInAction(`TASKS-SET-TASK-ERROR`);
		runInAction(`TASKS-SET-TASK ${title}`, ()=> {
			this.tasks.value[frameTitle].set(title, { ...task, ...newTask });
		});
	}


	removeTask(frameTitle, title) {
		const isRemoved = this.tasks.value[frameTitle].delete(title);
		runInAction(`TASKS-REMOVE-TASK ${ isRemoved ? '-SUCCESS' : '-ERROR' }`, ()=> {});
	}
}


export default new Tasks();