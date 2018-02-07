
import React from 'react';
import { I18nManager, InteractionManager } from 'react-native';
import RNRestart from 'react-native-restart';
import to from 'await-to-js';
import { asyncAction } from 'mobx-utils';

import _ from 'lodash';
import { reaction, when, toJS, useStrict, observable, action, computed } from 'mobx';
import * as u from '../lib/Utils';

useStrict(true);

class Store {
	@action s = s => _.assign(this, s)
	@observable lastComm
	@observable connected = true
	@observable user
	deviceInfo
	@computed get auth() { return this.user && u.isNotEmptyString(this.user.userId); }
	
	async init() {
		// 	I18nManager.forceRTL(false);
		// const isFirstLoad = !(await u.LocalStorage.get('firstLoad'));
		// if (isFirstLoad) {
		// 	await u.LocalStorage.clear();
		// 	await u.LocalStorage.save('firstLoad', true);
		// 	I18nManager.forceRTL(true);
		// 	RNRestart.Restart();
		// }
		
		u.requestCameraPermission();
		
		u.Server.connect();
		this.autoConnect();

		const user = await u.LocalStorage.get('user');
		console.log('user', user);
		this.s({ user });
	}
	constructor(root) {
		this.root = root;
		this.init();
	}

	@action logout = async () => {
		console.log('logout');
		this.sync({ flag: 'logout' });
		this.s({ user: undefined });
		u.LocalStorage.delete('user');
	}

	@action login = async ({ email, password }) => {
		console.log('login');

		const [err] = await to(u.meteorLoginWithPassword(email, password));
		if (err) return 'אימייל או סיסמא אינם מתאימים';
		
		this.s({ deviceInfo: u.getDeviceInfo() });
		const { user } = await this.sync({ flag: 'login' }) || {};
		console.log('user', user);
		if (!user) return 'אימייל או סיסמא אינם מתאימים';
		
		this.s({ user });
		await u.LocalStorage.save('user', this.user);
		this.sync({});

		return true;
	}

	@action async sync({ flag }) {
		console.log('sync', 'fcmToken', this.fcmToken, 'flag', flag);
		const { deviceInfo, user, fcmToken } = this;
		const { err, timeOut, data } = await u.toto({
			timeOut: 15000,
			promise: u.meteorCall('mobile.user.sync', { deviceInfo, user, fcmToken,	flag })
		});

		if (typeof data == 'object') return { err, timeOut, ...data };
		else return { err, timeOut };
	}

	@action async autoConnect(event) {
		console.log('connect');
		if (event == 'start') this.running = true;
		else if (event == 'stop') {
			this.running = false;
			return;
		} else if (!this.running) return;
		const enterDate = u.now();
		
		// Loading new data
		const { status } = await this.sync({ flag: 'connect' });
		if (status != 'OK') {
			if (this.timeOut) {
				this.s({ connected: false });
				u.Server.reset();
				this.timeOut = false;
			}
			this.timeOut = true;
		} else {
			this.s({ connected: true, lastComm: u.now() });
		}

		// Continue fetching
		const spent = u.now() - enterDate;
		setTimeout(() => this.autoConnect(), (spent > 10000) ? 1000 : 10000 - spent);
	}
}

export default Store;


//
// import React from 'react';
// import { NavigationActions } from 'react-navigation';
// import { I18nManager, InteractionManager } from 'react-native';
// import RNRestart from 'react-native-restart';
// import to from 'await-to-js';
// import FCM, { FCMEvent } from 'react-native-fcm';
//
// import _ from 'lodash';
// import { intercept, extendObservable, observe, autorun, reaction, when, toJS, useStrict, observable, action, computed } from 'mobx';
// import { arrayAssign, isNumeric, meteorLoginWithPassword, c, toto, now, Server, LocalStorage, meteorCall, deviceInfo, sleep } from '../lib/Utils';
// import { AppRouter } from '../router/AppRouter';
// import { AuthRouter } from '../router/AuthRouter';
//
// FCM.on(FCMEvent.Notification, notif => notif);
//
// useStrict(true);
//
// const Store = (state, actions) => {
//
// 	extendObservable(state, {
// 		app: {
// 			initDate: now(),
// 			lastComm: undefined,
// 			connected: true,
// 			fcmToken: undefined,
//
// 			user: undefined,
// 			get auth() { return !!state.app.user; }
// 		},
// 		nav: {
// 		},
// 		events: {
// 			data: [],
// 		},
// 	})
// 	const actions = storeActions(state, actions);
// 	return actions;
// }
//
// const storeActions = (state, actions) => {
// 	const set = s => _.assign(state, s);
// 	const init = async () => {
// 		observe(state.data, (change) => {
// 			// console.log('change:', change);
// 			if (change.object.length > 0) actions.AppStore.saveData();
// 			return change;
// 		});
// 		reaction(() => state.auth, async (auth) => {
// 			if (auth) {
// 				await LocalStorage.save('user', state.user);
// 				actions.AppStore.navigate('Auth');
// 				await actions.AppStore.loadData();
// 				actions.AppStore.runFetchEvents();
// 				actions.AppStore.sync({});
// 			} else {
// 				actions.AppStore.clearData();
// 				this.set({ initDate: now() });
// 				LocalStorage.delete('user');
// 				LocalStorage.delete('data');
// 			}
// 		});
// 		reaction(() => _.filter(this.data, 'isNew').length,
// 			newLen => this.navSetParams('List', { title: (newLen ? `(${newLen})` : '') + 'אירועים' })
// 		);
//
// 		if (!await LocalStorage.get('firstLoad')) {
// 			await LocalStorage.clear();
// 			await LocalStorage.save('firstLoad', true);
// 			I18nManager.forceRTL(true);
// 			RNRestart.Restart();
// 		}
// 		this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, async (fcmToken) => {
// 			this.set({ fcmToken });
// 			this.sync({});
// 		});
//
// 		Server.connect();
// 		const fcmToken = await FCM.getFCMToken();
// 		const user = await LocalStorage.get('user');
// 		this.set({ fcmToken, user });
//
// 		if (!this.auth) actions.NavStore.navigate('Login');
// 	}
//
// 	return {
// 		set: action(set)
// 	}
//
// 	// NAVIGATION ////////////////////////////////
// 	@observable.ref
// 		navigationStateAppRouter = _.set(
// 			AppRouter.router.getStateForAction(AppRouter.router.getActionForPathAndParams('Loading')),
// 			'routes[0].key', 'Loading');
// 	@observable.ref
// 		navigationStateAuthRouter =
// 				AuthRouter.router.getStateForAction(AuthRouter.router.getActionForPathAndParams('List'));
// 	@action dispatchAppRouter = (_action, stackNavState = true) => {
// 		const previousNavState = stackNavState ? this.navigationStateAppRouter : null;
// 		let state = AppRouter.router.getStateForAction(_action, previousNavState);
// 		if (_action.type == 'Navigation/RESET') state = _.set(state, 'routes[0].key', _action.key);
// 		this.navigationStateAppRouter = state;
// 		return state;
// 	};
// 	@action dispatchAuthRouter = (_action, stackNavState = true) => {
// 		const previousNavState = stackNavState ? this.navigationStateAuthRouter : null;
// 		return (this.navigationStateAuthRouter = AuthRouter.router.getStateForAction(
// 			_action,
// 			previousNavState
// 		));
// 	};
// 	appRoutes = ['Loading', 'Login', 'Auth'];
// 	authRoutes = ['Profile', 'List'];
// 	@action navigate = (routeName) => {
// 		const navigateAuth = () => this.dispatchAuthRouter(NavigationActions.navigate({ routeName }));
// 		const resetApp = () => this.dispatchAppRouter(NavigationActions.reset({
// 			index: 0,
// 			key: routeName,
// 			actions: [NavigationActions.navigate({ routeName })]
// 		}));
// 		if (_.includes(this.appRoutes, routeName)) {
// 			const n = this.navigationStateAppRouter;
// 			if (n && isNumeric(n.index) && n.routes && n.routes[n.index] && n.routes[n.index].key && n.routes[n.index].key != routeName) resetApp();
// 		} else if (_.includes(this.authRoutes, routeName)) {
// 			const n = this.navigationStateAuthRouter;
// 			if (n && isNumeric(n.index) && n.routes && n.routes[n.index] && n.routes[n.index].key && n.routes[n.index].key != routeName) navigateAuth();
// 		}
// 	}
// 	@action navSetParams = (routeName, params) => {
// 		const setParamsAuth = () => this.dispatchAuthRouter(NavigationActions.setParams({ params, key: routeName }));
// 		const setParamsApp = () => this.dispatchAppRouter(NavigationActions.setParams({ params, key: routeName }));
// 		if (_.includes(this.appRoutes, routeName)) setParamsApp();
// 		else if (_.includes(this.authRoutes, routeName)) setParamsAuth();
// 	}
// 	// NAVIGATION ////////////////////////////////
//
//
// 	// Internal /////////////////////////////////////////////////////////////////
// 	@action async runFetchEvents(run) {
// 		console.log('processFetchEvents');
//
// 		// Used to calculate interval at setTimeout and provide itself for next run, at the end of function
// 		const enterDate = now();
// 		// Prevent starting to run twice
// 		if (!this.auth || !this.initDate) return;
// 		if (run && run.enterDate && (run.enterDate < this.initDate)) return;
//
// 		// Loading new data
// 		const { user, data } = this;
// 		const { companyId, userId } = user;
// 		const createdAt = data.length ? _.get(data, '[0].createdAt', 0) : 0;
// 		let { timeOut, data: newData } = await toto({
// 			timeOut: 15000,
// 			promise: meteorCall('events.get.mobile', { companyId, userId, deviceInfo: deviceInfo(), createdAt })
// 		});
//
// 		if (timeOut) {
// 			if (this.timeOut) {
// 				this.set({ connected: false });
// 				Server.reset();
// 				this.timeOut = false;
// 			}
// 			this.timeOut = true;
// 		} else {
// 			this.set({ connected: true, lastComm: now() });
// 			this.pushData(newData);
// 		}
//
// 		// Continue fetching
// 		const spent = now() - enterDate;
// 		setTimeout(() => this.runFetchEvents({ enterDate, start: false }), (spent > 4000) ? 1000 : 5000 - spent);
// 	}
//
// 	// User actions /////////////////////////////////////////////////////////////////
// 	@action logout = async () => {
// 		console.log('logout');
// 		this.sync({ flag: 'logout' });
// 		actions.NavStore.navigate('Login');
// 		this.set({ user: undefined });
// 	}
// 	@action login = async ({ email, password }) => {
// 		console.log('login');
//
// 		const [err] = await to(meteorLoginWithPassword(email, password));
// 		if (err) return 'ימייל או סיסמא אינם מתאימים';
//
// 		const { user } = await this.sync({ flag: 'login' }) || {};
// 		if (!user) return 'ימייל או סיסמא אינם מתאימים';
// 		this.set({ user });
//
// 		return true;
// 	}
// 	@action async sync({ flag }) {
// 		console.log('sync', 'cmToken', this.fcmToken, 'flag', flag);
// 		const userId = _.get(this.user, 'userId');
// 		return await meteorCall('user.set.fcmtoken', {
// 			userId,
// 			fcmToken: this.fcmToken,
// 			flag,
// 			deviceInfo: deviceInfo(),
// 		});
// 	}
//
// 	// Data /////////////////////////////////////////////////////////////////
// 	@computed get dataArray() { return toJS(this.data); }
// 	@action clearData = data => this.data.clear()
// 	@action replaceData = data => this.data.replace(data)
// 	@action loadData = async () => this.replaceData(await LocalStorage.get('data') || [])
// 	@action saveData = async () => LocalStorage.save('data', this.data)
// 	@action pushData = newData => _.forEachRight(newData, el => this.data.unshift({ ...el, isNew: true }))
// 	@action updateData = (index, object) => this.data[index] = _.assign({}, this.data[index], object)
// 	@action markDataAsOld = index => this.updateData(index, { isNew: false })
// 	@action toggleAllDataNew = () => this.replaceData(arrayAssign(this.data, { isNew: !_.some(this.data, 'isNew') }))
// }
//
//
// const store = new Store();


// let ar = observable({ data: [1] });
// observe(ar.data, change => console.log('aaaaaaaa', change));
//
// ar.data[1] = 2;
// ar.data[1] = 3;
// setTimeout(() => ar.data[1] = 4, 100);
// setTimeout(() => ar.data[1] = 5, 200);

// extendObservable(store, { data: [] });
// store.init();
// observe(store.data, change => console.log('aaaaaaaa', change));
// store.replaceData([1]);
// store.replaceData([2]);
// setTimeout(() => store.replaceData([1]), 100);
// setTimeout(() => store.replaceData([1]), 100);

// store.ar[1] = 2;
// store.ar[1] = 3;
// setTimeout(() => store.ar[1] = 4, 100);
// setTimeout(() => store.ar[1] = 5, 200);


// observe(store.data, change => console.log('aaaaaa'), store.saveData());

// setTimeout(() => store.replaceData([4]), 200);
// setTimeout(() => store.replaceData([5]), 300);
// store.replaceData([5]);


// if (n && isNumeric(n.index) && n.routes && n.routes[n.index] && n.routes[n.index].key && n.routes[n.index].key == routeName) setParamsAuth();

// setTimeout(() => {
// 	const resetAction = NavigationActions.reset({
// 		index: 0,
// 		actions: [
// 			NavigationActions.navigate({ routeName: 'Auth' }),
// 		]
// 	});
// 	// this.dispatch(NavigationActions.navigate({ routeName: 'Login' }));
// 	// this.dispatch(NavigationActions.setParams({
// 	// 	params: { title: 'Hello' },
// 	// 	key: 'Login'
// 	// }));
// 	this.dispatchAppRouter(resetAction);
// 	console.log('here');
// }, 4000);
// setTimeout(() => {
// 	const resetAction = NavigationActions.reset({
// 		index: 0,
// 		actions: [
// 			NavigationActions.navigate({ routeName: 'List' }),
// 		]
// 	});
// 	const navigateAction = NavigationActions.navigate({
// 		routeName: 'Profile',
// 		// action: NavigationActions.navigate({ routeName: 'List' })
// 	});
// 	// this.dispatch(NavigationActions.navigate({ routeName: 'Login' }));
// 	// this.dispatch(NavigationActions.setParams({
// 	// 	params: { tabBarLabel: 'Hello' },
// 	// 	key: 'List'
// 	// }));
// 	this.dispatchAuthRouter(navigateAction);
// 	console.log('here');
// }, 8000);
// setTimeout(() => {
// 	const resetAction = NavigationActions.reset({
// 		index: 0,
// 		actions: [
// 			NavigationActions.navigate({ routeName: 'List' }),
// 		]
// 	});
// 	const navigateAction = NavigationActions.navigate({
// 		routeName: 'Profile',
// 		// action: NavigationActions.navigate({ routeName: 'List' })
// 	});
// 	// this.dispatch(NavigationActions.navigate({ routeName: 'Login' }));
// 	// this.dispatch(NavigationActions.setParams({
// 	// 	params: { tabBarLabel: 'Hello' },
// 	// 	key: 'List'
// 	// }));
// 	this.dispatchAuthRouter(navigateAction);
// 	console.log('here');
// }, 10000);


// routers = {
// 	app: AppRouter.router,
// 	auth: AuthRouter.router,
// };
// @observable.shallow
// 	navigationState = {
// 		app: _.set(
// 			AppRouter.router.getStateForAction(AppRouter.router.getActionForPathAndParams('Login')),
// 			'routes[0].key', 'Login'),
// 		auth: _.set(
// 			AppRouter.router.getStateForAction(AppRouter.router.getActionForPathAndParams('List')),
// 			'routes[0].key', 'List'),
// 	};
//
// @action dispatch = (router, _action, stackNavState = true) => {
// 	const previousNavState = stackNavState ? this.navigationState : null;
// 	return (this.navigationState[router] = _.get(router, AppRouter.router.getStateForAction(
// 		_action,
// 		previousNavState
// 	));
// };


// autorun(() => {
// 	console.log('Actions');
// 	console.log(Actions);
// 	console.log('Actions.currentScene');
// 	console.log(Actions.currentScene);
// 	if (this.data && this.data.length && Actions.currentScene == '_list') {
// 		console.log('here');
// 		const cntNewEvents = this.data.filter(e => e.isNew).length;
// 		const title = `אירועים(${cntNewEvents})`;
// 		Actions.profile({ title: 'kaka' });
// 	}
// });

// @computed get cntNewEvents() { return  }
// autorun(() => {
// 	if (this.setParams) {
// 		console.log('setParams');
// 		console.log(this.setParams);
// 		const cntNewEvents = this.data.filter(e => e.isNew).length;
// 		// this.setParams({ name: `אירועים(${555})` });
// 	}
// });

// @computed get route() {
// 	const { auth, loading } = this;
// 	if (loading) return 'Loading';
// 	else if (!auth) return 'Login';
// 	else return 'Auth';
// }


//
// @action async addData(newData) {
// 	console.log('new', newData);
// 	console.log('data', this.dataArray);
// 	if (!newData) return;
// 	// const { data } = this;
// 	// _.forEachRight(newData, el => data.unshift({ ...el, new: true }));
// 	const n = _.chain(newData)
// 		.chunk(20)
// 		.reverse()
// 		.value();
// 	for (let i = 0; i <= n.length; i += 1) {
// 		// console.log('chunk', chunk);
// 		// console.log('concat', _.concat(chunk, this.dataArray));
// 		await sleep(6000);
// 		this.replaceData(_.concat(n[i], this.dataArray));
// 		console.log('inside', this.dataArray);
// 	}
// 	// const n = _.chain(newData)
// 	// 	.chunk(20)
// 	// 	.reverse()
// 	// 	.value();
// 	// for (const chunk of n) {
// 	// 	// console.log('chunk', chunk);
// 	// 	// console.log('concat', _.concat(chunk, this.dataArray));
// 	// 	await sleep(3000);
// 	// 	this.replaceData(_.concat(chunk, this.dataArray));
// 	// 	console.log('inside', this.dataArray);
// 	// };
// }

// when(() => this.auth, async () => {
// 	await this.loadData();
// 	await this.sync({});
// 	this.runFetchEvents();
// });

//
//
// @observable _lastComm = undefined;
// @observable _connected = true;
// @observable _data = [];
// @observable _user = undefined;
// @observable _fcmToken = undefined;
// @observable _loading = true;
//
// get user() { return this._user } get lastComm() { return this._lastComm } get connected() { return this._connected } get fcmToken() { return this._fcmToken }	get loading() { return this._loading }
// get data() { return this._data.slice() }
// @action set user(_user) { this._user = _user; } @action set lastComm(_lastComm) { this._lastComm = _lastComm; } @action set connected(_connected) { this._connected = _connected; } @action set data(_data) { this._data = _data; } @action set fcmToken(_fcmToken) { this._fcmToken = _fcmToken; } @action set loading(_loading) { this._loading = _loading; }
// @action set = s => _.assign(this, s) ///////////////////////////
//
// async loadData() {
// 	const data = await LocalStorage.get('data');
// 	console.log('data loaded', data);
// 	if (data) this.set({ data });
// }
// async saveData() {
// 	return LocalStorage.save('data', this.data);
// }
// async addData(newData) {
// 	if (!newData) return;
// 	const { data } = this;
// 	_.forEachRight(newData, el => data.unshift({ ...el, new: true }));
// 	return this.saveData();
// }
// async markDataAsOld(index) {
// 	this.data[index].new = false;
// 	return this.saveData();
// }
//
