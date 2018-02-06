
import _ from 'lodash';
import Meteor, { createContainer } from 'react-native-meteor';
import * as DeviceInfo from 'react-native-device-info';
import { PermissionsAndroid, AsyncStorage } from 'react-native';
import { intercept, extendObservable, observe, autorun, reaction, when, toJS, useStrict, observable, action, computed } from 'mobx';
import Settings from '../config/settings';

// Compare props and return modified next props
const difProps = ({ prevProps, nextProps }) => (
	_.reduce(nextProps, (result, value, key) => {
		if (value !== prevProps[key]) result[key] = true;
		return result;
	}, {}));
const difState = ({ prevState, nextState }) => difProps({ prevProps: prevState, nextProps: nextState });

function parseLodash(str) {
	return _.attempt(JSON.parse.bind(null, str));
}
const meteorData = propsFn => Component => createContainer(propsFn, Component);

const Server = {
	connect: () => Meteor.connect(Settings.SERVER_URL, { autoReconnect: true, reconnectInterval: 5000 }),
	disconnect: () => Meteor.disconnect(),
	reset: () => { Server.disconnect(); Server.connect(); },
	connected: () => Meteor.status().connected,
};

function formatDate({ date, isoDate }) {
	if (isoDate) date = new Date(isoDate);
	if (!date) return '';
	const hours = _.padStart(date.getHours(), 2, '0');
	const minutes = _.padStart(date.getMinutes(), 2, '0');
	const seconds = _.padStart(date.getSeconds(), 2, '0');
	const day = _.padStart(date.getDate(), 2, '0');
	const month = _.padStart(date.getMonth() + 1, 2, '0');
	const year = _.padStart(date.getFullYear(), 2, '0');

	return `${day}.${month}.${year} - ${hours}.${minutes}.${seconds}`;
}

const meteorCall = (method, params) => new Promise((resolve, reject) => {
	if (params) {
		Meteor.call(method, params, (error, result) => {
			if (error) reject(error);
			resolve(result);
		});
	} else {
		Meteor.call(method, (error, result) => {
			if (error) reject(error);
			resolve(result);
		});
	}
});

const meteorLoginWithPassword = (email, password) => new Promise((resolve, reject) => {
	Meteor.loginWithPassword(email, password, (error, result) => {
		if (error) reject(error);
		resolve(result);
	});
});

const meteorLogout = () => new Promise((resolve, reject) => {
	Meteor.logout((error) => {
		if (error) reject(error);
	});
});


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function timeOutPromise({ timeOut, promise }) {
	let handle;
	if (!timeOut) return promise;

	return Promise.race([
		promise,
		new Promise((resolve, reject) => {
			handle = setTimeout(() => {
				reject(new Error('timeOut'));
			}, timeOut);
		})
	])
		.then((v) => {
			clearTimeout(handle);
			return v;
		}, (err) => {
			clearTimeout(handle);
			throw err;
		});
}

function toto(p) {
	let { promise, timeOut } = p;
	if (!promise) promise = p;
	return timeOutPromise({ promise, timeOut })
		.then(data => ({ data }))
		.catch((err) => {
			if (err.message == 'timeOut') return ({ timeOut: true });
			else return ({ err });
		});
}

const getCurrentPosition = params => toto(new Promise((resolve, reject) => {
	navigator.geolocation.getCurrentPosition(
		position => resolve(position),
		error => reject(error),
		params
	);
}));

function pastDate({ days }) {
	const dateOffset = (24 * 60 * 60 * 1000); // day
	const past = new Date();
	let now = (new Date()).getTime();
	now = 10000000 * Math.round(now / 10000000);
	past.setTime(now - (dateOffset * days)); // month
	return past;
}

const now = () => new Date();
const isoToDate = isoDate => new Date(isoDate);

const getDeviceInfo = () => ({
	uniqueId: DeviceInfo.getUniqueID(),
	manufacturer: DeviceInfo.getManufacturer(),
	brand: DeviceInfo.getBrand(),
	model: DeviceInfo.getModel(),
	deviceId: DeviceInfo.getDeviceId(),
	systemName: DeviceInfo.getSystemName(),
	systemVersion: DeviceInfo.getSystemVersion(),
	bundleId: DeviceInfo.getBundleId(),
	buildNumber: DeviceInfo.getBuildNumber(),
	version: DeviceInfo.getVersion(),
	readableVersion: DeviceInfo.getReadableVersion(),
	deviceName: DeviceInfo.getDeviceName(),
	userAgent: DeviceInfo.getUserAgent(),
	deviceLocale: DeviceInfo.getDeviceLocale(),
	deviceCountry: DeviceInfo.getDeviceCountry(),
	timezone: DeviceInfo.getTimezone(),
	emulator: DeviceInfo.isEmulator(),
	tablet: DeviceInfo.isTablet(),
	pinOrFingerprintSet: DeviceInfo.isPinOrFingerprintSet(),
	apiLevel: DeviceInfo.getAPILevel(),
	instanceId: DeviceInfo.getInstanceID(),
	phoneNumber: DeviceInfo.getPhoneNumber(),
	firstInstallTime: DeviceInfo.getFirstInstallTime(),
	lastUpdateTime: DeviceInfo.getLastUpdateTime(),
});


const LocalStorage = {
	get: async key => AsyncStorage.getItem(key)
		.then(value => parseLodash(value))
		.catch(err => console.log(err)),
	save: async (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)),
	delete: async key => AsyncStorage.removeItem(key),
	clear: async () => AsyncStorage.clear(),
};

const set = (component, obj) => {
	return new Promise((resolve) => {
		const key = _.keys(obj)[0];
		const value = _.values(obj)[0];
		if (component.state[key] !== value) {
			component.setState(obj, () => resolve(obj));
		} else {
			resolve();
		}
	});
};

function isNumeric(x) {
	return ((typeof x === 'number' || typeof x === 'string') && !_.isNaN(Number(x)) && x !== '');
}

function arrayAssign(array, newObj) { _.forEach(array, obj => _.assign(obj, newObj)); }

function createStore(stores = {}, initialData = {}) {
	const state = observable({});
	const actions = {};
	
	_.forOwn(stores, (store, key) => {
		const storeActions = store(state, actions, initialData, key);
		actions[key] = storeActions;
	});
	
	return { state, actions };
}

function deferRun(ms) {
	return new Promise(resolve => setTimeout(() => requestAnimationFrame(resolve), ms || 100));
}

function pif(i) {
	return new Promise((resolve, reject) => {
		if (i) resolve();
		// else reject();
	});
}
function isNotEmptyString(s) {
	return typeof s == 'string' && s != '';
}

async function requestCameraPermission() {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				title: 'גישה למיקום מדוייק',
				message: 'נא אשר'
			}
		);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('You can use the camera');
		} else {
			console.log('Camera permission denied');
		}
	} catch (err) {
		console.warn(err);
	}
}


export {
	requestCameraPermission,
	isNotEmptyString,
	getCurrentPosition,
	pif,
	deferRun,
	createStore,
	arrayAssign,
	isNumeric,
	set,
	LocalStorage,
	toto,
	getDeviceInfo,
	isoToDate,
	now,
	pastDate,
	sleep,
	Server,
	difState,
	formatDate,
	parseLodash,
	meteorLogout,
	difProps,
	meteorData,
	meteorCall,
	meteorLoginWithPassword
};
