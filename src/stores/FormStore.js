
import React, { Component } from 'react';
import { InteractionManager, Dimensions, StyleSheet } from 'react-native';
import _ from 'lodash';
import axios from 'axios';
import { when, useStrict, observable, action, computed } from 'mobx';
import * as u from '../lib/Utils';
import Location from '../view/screens/Auth/Form/Dialog/Location/Location';
import Barcode from '../view/screens/Auth/Form/Dialog/Barcode/Barcode';
import Ad from '../view/screens/Auth/Form/Dialog/AdsList/AdsList';

useStrict(true);

class FormStore {
	@action s = s => _.assign(this, s)
	@observable loading = true
	@observable dialogVisible
	@observable alertVisible
	@observable alertTitle
	@observable alertText
	@observable dialogComponent
	@observable companies = []

	@observable ads = []
	@computed get adsArray() { return this.ads.peek(); }
	@action clearAds = () => {
		this.adIndex = null;
		this.ads.clear();
	}
	@observable adIndex
	@computed get ad() { return _.get(this.ads, `[${this.adIndex}].ad`); }
	
	@observable location
	@computed get lat() { return _.get(this.location, 'coords.latitude'); }
	@computed get lon() { return _.get(this.location, 'coords.longitude'); }
	@computed get accuracy() { return _.get(this.location, 'coords.accuracy'); }
	
	barcodeField
	@observable barcode
	
	@observable formValue = {}
	formRef
	@observable errorStatus
	@observable submitButtonRed
	@action setFormRef = formRef => this.s({ formRef })
	
	@computed get disableButtons() { return !this.root.app.connected; }
	@observable batchDate
	@observable companyId

	constructor(root) {
		this.root = root;
		this.loadCompanies().then(
			() => this.s({ loading: false })
		);
	}
	@action replaceCompanies = r => this.companies.replace(r)
	@action async loadCompanies() {
		this.replaceCompanies(await u.meteorCall('companies.get.all', { user: this.root.app.user }));
	}

	@action onBarCodeRead = data => this.barcode = data.data
	@action onAdSelect = adIndex => this.s({ adIndex })
	@action onFormChange = formValue => this.s({ formValue })
	@action onBatchDateSelect = batchDate => this.s({ batchDate })
	@action onSelectCompany = companyId => this.s({ companyId })
	
	@action async onSubmit() {
		const formValue = this.formRef.getValue();
		if (!formValue) {
			this.errorStatus = true;
			InteractionManager.runAfterInteractions(async () => {
				for (let i = 0; i < 3; i += 1) {
					this.s({ submitButtonRed: true });
					await u.sleep(1500);
					this.s({ submitButtonRed: false });
					await u.sleep(1200);
				}
			});
		} else {
			const { lat, lon, address, sim, bodyBarcode, description, remarks, history } = formValue;
			const { batchDate, companyId } = this;
			const doc = { lat, lon, address, sim, bodyBarcode, description, remarks, history, batchDate, companyId };

			this.s({ loading: true });
			const { deviceInfo, user } = this.root.app;
			const { err, timeOut, data } = await u.toto({
				timeOut: 15000,
				promise: u.meteorCall('mobile.hydrant.insert', { deviceInfo, user, doc })
			});
			this.s({ loading: false });

			if (data) {
				this.s({ alertTitle: 'השליחה הצליחה!' });
				this.s({ alertText: `מספר הידרנט: ${data.number}` });
				
				this.s({ formValue: null });
				this.s({ batchDate: undefined });
				this.s({ companyId: undefined });
			} else {
				this.s({ alertTitle: 'השליחה לא הצליחה' });
			}
			this.s({ alertVisible: true });
		}
	}
	@action onAlertOk() {
		console.log('alertOk');
		this.alertVisible = false;
	}

	@action onBarcodeOpen(field) {
		this.barcode = undefined;
		this.barcodeField = field;
		this.dialogComponent = Barcode;
		this.dialogVisible = true;
	}
	
	@action async onAdOpen() {
		this.dialogComponent = Ad;
		this.dialogVisible = true;
		
		this.s({ loading: true });
		for (let i = 0; i < 10; i += 1) {
			const { data, err, timeOut } = await u.toto({
				promise: axios.get(`https://maps.googleapis.com/maps/api/geocode/json?language=iw&latlng=${this.lat},${this.lon}&AIzaSyBLZ9MQsAOpEzHcubQCo-fsKhb1EoUt88U`),
				timeOut: 10000
			});
	
			this.clearAds();
			if (data && data.data && !_.isEmpty(data.data.results)) {
				_.forEach(data.data.results, el => this.ads.push({ id: el.place_id, ad: el.formatted_address }));
				break;
			}
		}
		this.s({ loading: false });
	}
	
	@action async setLocation(location) {
		console.log('location', location);
		if (!this.location || _.get(location, 'coords.accuracy') < _.get(this.location, 'coords.accuracy')) {
			this.s({ location });
		}
	}
	@action async onLocationOpen() {
		this.location = undefined;
		this.dialogComponent = Location;
		this.dialogVisible = true;
		this.s({ loading: true });
		when(() => this.location, () => this.s({ loading: false }));
		this.positionId = navigator.geolocation.watchPosition(
			l => this.setLocation(l),
			null,
			{ useSignificantChanges: false, enableHighAccuracy: true, timeout: 75000, maximumAge: 2, distanceFilter: 0 }
		);
		when(() => !this.dialogVisible, () => {
			navigator.geolocation.clearWatch(this.positionId);
			navigator.geolocation.stopObserving();
		});
	}
	
	@action onOk() {
		switch (this.dialogComponent) {
			case Location:
				if (this.lat) this.formValue.lat = this.lat;
				if (this.lon) this.formValue.lon = this.lon;
				break;
			case Ad:
				if (this.ad) this.formValue.address = this.ad;
				break;
			case Barcode:
				if (this.barcode) this.formValue[`${this.barcodeField}`] = this.barcode;
				this.barcode = undefined;
				break;
		}
		
		this.dialogVisible = false;
	}
	@action onCancel = () => this.dialogVisible = false
}

export default FormStore;

// } else {
	// this.ads.push({ id: 0, ad: 'נסה עוד פעם' });
	// this.ads.push({ id: 1, ad: `err: ${JSON.stringify(err)}` });
	// this.ads.push({ id: 2, ad: `data: ${JSON.stringify(data)}` });
	// this.ads.push({ id: 3, ad: `time out: ${JSON.stringify(timeOut)}` });
	// console.log('was error, data', data, err, timeOut);

//
// @action async runLocation(event) {
// 	if (event == 'start') this.running = true;
// 	else if (event == 'stop') {
// 		this.running = false;
// 		return;
// 	} else if (!this.running) return;
// 	const enterDate = u.now();
//
// 	const { data, err } = await u.getCurrentPosition({ enableHighAccuracy: true, timeout: 75000, maximumAge: 1000 });
// 	if (data) this.s({ location: data });
//
// 	const spent = u.now() - enterDate;
// 	setTimeout(() => this.runLocation(), (spent > 10000) ? 1000 : 10000 - spent);
// }


// @computed get styles() {
// 	if (this.disableButtons) {
// 		console.log(styles);
// 		console.log(styles.button);
// 		const button = StyleSheet.flatten([styles.button, { backgroundColor: 'lightgray' }]);
// 		const s = StyleSheet.flatten([styles, button]);
// 		console.log(s.button);
// 		return StyleSheet.flatten([styles, button]);
// 	}
// 	return styles;
// }


//
// console.log('here');
// console.log('PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)', await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION));
// console.log('PermissionsAndroid.RESULTS.GRANTED', PermissionsAndroid.RESULTS.GRANTED);

// onPress = async () => {
// 	const value = this._form.getValue();
// 	console.log('value: ', value);
// }


//
// <Button
// 	Component={TouchableOpacity}
// 	raised
// 	icon={{ name: 'x-circle', type: 'feather', size: 32 }}
// 	buttonStyle={{ backgroundColor: 'lightskyblue', borderRadius: 0 }}
// 	textStyle={styles.main}
// 	title="שמור"
// 	onPress={this.onPress}
// />


// {
// 	"results":
// 	[
// 		{
// 			"address_components": [
// 				{
// 					"long_name": "Unnamed Road",
// 					"short_name": "Unnamed Road",
// 					"types": ["route"]
// 				},
// 				{
// 					"long_name": "Akko",
// 					"short_name": "Akko",
// 					"types": ["administrative_area_level_2", "political"]
// 				},
// 				{
// 					"long_name": "North District",
// 					"short_name": "North District",
// 					"types": ["administrative_area_level_1", "political"]
// 				},
// 				{
// 					"long_name": "ישראל",
// 					"short_name": "IL",
// 					"types": ["country", "political"]
// 				}
// 			],
// 			"formatted_address": "Unnamed Road, ישראל",
// 			"geometry": {
// 				"bounds": {
// 					"northeast": {
// 						"lat": 32.848143,
// 						"lng": 35.1153166
// 					},
// 					"southwest": {
// 						"lat": 32.8448045,
// 						"lng": 35.1123327
// 					}
// 				},
// 				"location": {
// 					"lat": 32.8466061,
// 					"lng": 35.1150176
// 				},
// 				"location_type": "GEOMETRIC_CENTER",
// 				"viewport": {
// 					"northeast": {
// 						"lat": 32.848143,
// 						"lng": 35.1153166
// 					},
// 					"southwest": {
// 						"lat": 32.8448045,
// 						"lng": 35.1123327
// 					}
// 				}
// 			},
// 			"place_id": "ChIJlWQq5WS2HRURLkMz3njVkFE",
// 			"types": ["route"]
// 		},
// 		{
// 			"address_components": [
// 				{
// 					"long_name": "אזור עכו",
// 					"short_name": "אזור עכו",
// 					"types": ["administrative_area_level_3", "political"]
// 				},
// 				{
// 					"long_name": "עכו",
// 					"short_name": "עכו",
// 					"types": ["administrative_area_level_2", "political"]
// 				},
// 				{
// 					"long_name": "מחוז הצפון",
// 					"short_name": "מחוז הצפון",
// 					"types": ["administrative_area_level_1", "political"]
// 				},
// 				{
// 					"long_name": "ישראל",
// 					"short_name": "IL",
// 					"types": ["country", "political"]
// 				}
// 			],
// 			"formatted_address": "אזור עכו, ישראל",
// 			"geometry": {
// 				"bounds": {
// 					"northeast": {
// 						"lat": 32.965016,
// 						"lng": 35.198607
// 					},
// 					"southwest": {
// 						"lat": 32.823524,
// 						"lng": 35.0658259
// 					}
// 				},
// 				"location": {
// 					"lat": 32.9016717,
// 					"lng": 35.1048713
// 				},
// 				"location_type": "APPROXIMATE",
// 				"viewport": {
// 					"northeast": {
// 						"lat": 32.965016,
// 						"lng": 35.198607
// 					},
// 					"southwest": {
// 						"lat": 32.823524,
// 						"lng": 35.0658259
// 					}
// 				}
// 			},
// 			"place_id": "ChIJo0lD6GTJHRURWbwtFH8wAQE",
// 			"types": ["administrative_area_level_3", "political"]
// 		},
// 		{
// 			"address_components": [
// 				{
// 					"long_name": "מטה אשר",
// 					"short_name": "מטה אשר",
// 					"types": ["administrative_area_level_4", "political"]
// 				},
// 				{
// 					"long_name": "עכו",
// 					"short_name": "עכו",
// 					"types": ["administrative_area_level_2", "political"]
// 				},
// 				{
// 					"long_name": "מחוז הצפון",
// 					"short_name": "מחוז הצפון",
// 					"types": ["administrative_area_level_1", "political"]
// 				},
// 				{
// 					"long_name": "ישראל",
// 					"short_name": "IL",
// 					"types": ["country", "political"]
// 				}
// 			],
// 			"formatted_address": "מטה אשר, ישראל",
// 			"geometry": {
// 				"bounds": {
// 					"northeast": {
// 						"lat": 33.1007774,
// 						"lng": 35.2799089
// 					},
// 					"southwest": {
// 						"lat": 32.823524,
// 						"lng": 35.073129
// 					}
// 				},
// 				"location": {
// 					"lat": 33.0059802,
// 					"lng": 35.148879
// 				},
// 				"location_type": "APPROXIMATE",
// 				"viewport": {
// 					"northeast": {
// 						"lat": 33.1007774,
// 						"lng": 35.2799089
// 					},
// 					"southwest": {
// 						"lat": 32.823524,
// 						"lng": 35.073129
// 					}
// 				}
// 			},
// 			"place_id": "ChIJO6FHHSPKHRUR2xJMlV4rjvk",
// 			"types": ["administrative_area_level_4", "political"]
// 		},
// 		{
// 			"address_components": [
// 				{
// 					"long_name": "עכו",
// 					"short_name": "עכו",
// 					"types": ["administrative_area_level_2", "political"]
// 				},
// 				{
// 					"long_name": "מחוז הצפון",
// 					"short_name": "מחוז הצפון",
// 					"types": ["administrative_area_level_1", "political"]
// 				},
// 				{
// 					"long_name": "ישראל",
// 					"short_name": "IL",
// 					"types": ["country", "political"]
// 				}
// 			],
// 			"formatted_address": "עכו, ישראל",
// 			"geometry": {
// 				"bounds": {
// 					"northeast": {
// 						"lat": 33.1080848,
// 						"lng": 35.4390369
// 					},
// 					"southwest": {
// 						"lat": 32.748502,
// 						"lng": 35.0658259
// 					}
// 				},
// 				"location": {
// 					"lat": 32.9508463,
// 					"lng": 35.2587964
// 				},
// 				"location_type": "APPROXIMATE",
// 				"viewport": {
// 					"northeast": {
// 						"lat": 33.1080848,
// 						"lng": 35.4390369
// 					},
// 					"southwest": {
// 						"lat": 32.748502,
// 						"lng": 35.0658259
// 					}
// 				}
// 			},
// 			"place_id": "ChIJH6cBWXEzHBURVAlRiaIxsSc",
// 			"types": ["administrative_area_level_2", "political"]
// 		},
// 		{
// 			"address_components": [
// 				{
// 					"long_name": "מחוז הצפון",
// 					"short_name": "מחוז הצפון",
// 					"types": ["administrative_area_level_1", "political"]
// 				},
// 				{
// 					"long_name": "ישראל",
// 					"short_name": "IL",
// 					"types": ["country", "political"]
// 				}
// 			],
// 			"formatted_address": "מחוז הצפון, ישראל",
// 			"geometry": {
// 				"bounds": {
// 					"northeast": {
// 						"lat": 33.33280500000001,
// 						"lng": 35.896244
// 					},
// 					"southwest": {
// 						"lat": 32.3869671,
// 						"lng": 35.0272979
// 					}
// 				},
// 				"location": {
// 					"lat": 32.8972246,
// 					"lng": 35.3027226
// 				},
// 				"location_type": "APPROXIMATE",
// 				"viewport": {
// 					"northeast": {
// 						"lat": 33.33280500000001,
// 						"lng": 35.896244
// 					},
// 					"southwest": {
// 						"lat": 32.3869671,
// 						"lng": 35.0272979
// 					}
// 				}
// 			},
// 			"place_id": "ChIJdVSqdIk3HBURL7ZpTXHxZaU",
// 			"types": ["administrative_area_level_1", "political"]
// 		},
// 		{
// 			"address_components": [
// 				{
// 					"long_name": "ישראל",
// 					"short_name": "IL",
// 					"types": ["country", "political"]
// 				}
// 			],
// 			"formatted_address": "ישראל",
// 			"geometry": {
// 				"bounds": {
// 					"northeast": {
// 						"lat": 33.33280500000001,
// 						"lng": 35.896244
// 					},
// 					"southwest": {
// 						"lat": 29.47969999999999,
// 						"lng": 34.2673871
// 					}
// 				},
// 				"location": {
// 					"lat": 31.046051,
// 					"lng": 34.851612
// 				},
// 				"location_type": "APPROXIMATE",
// 				"viewport": {
// 					"northeast": {
// 						"lat": 33.33280500000001,
// 						"lng": 35.896244
// 					},
// 					"southwest": {
// 						"lat": 29.47969999999999,
// 						"lng": 34.2673871
// 					}
// 				}
// 			},
// 			"place_id": "ChIJi8mnMiRJABURuiw1EyBCa2o",
// 			"types": ["country", "political"]
// 		}
// 	],
// 		"status"
// :
// 	"OK"
// }

//
// class Store {
// 	@action set = s => _.assign(this, s)
// 	@observable.ref
// 		navigationStateAppRouter = _.set(
// 			AppRouter.router.getStateForAction(AppRouter.router.getActionForPathAndParams('Loading')),
// 			'routes[0].key', 'Loading');
// 	@observable.ref
// 		navigationStateAuthRouter =
// 				AuthRouter.router.getStateForAction(AuthRouter.router.getActionForPathAndParams('List'));
//
// 	constructor(root) {
// 		this.root = root;
// 		reaction(() => this.root.app.auth || this.root.app.auth === 0, async (a) => {
// 			if (this.root.app.auth)	{
// 				this.navigate('Auth');
// 				// if (isUserAdmin(this.root.app.user)) {
// 				// 	this.setParams('List', { tabBarVisible: true });
// 				// 	this.navigate('Auth');
// 				// 	this.navigate('List');
// 				// } else {
// 				// 	this.setParams('Form', { tabBarVisible: true });
// 				// 	this.navigate('Auth');
// 				// 	this.navigate('Form');
// 				// }
// 			} else {
// 				this.navigate('Login');
// 			}
// 		});
// 	}
//
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
//
// 	@action navigate = (routeName) => {
// 		const navigateAuth = () => this.dispatchAuthRouter(NavigationActions.navigate({ routeName }));
// 		const resetApp = () => this.dispatchAppRouter(NavigationActions.reset({
// 			index: 0,
// 			key: routeName,
// 			actions: [NavigationActions.navigate({ routeName })]
// 		}));
// 		if (_.includes(appRoutes, routeName)) {
// 			const n = this.navigationStateAppRouter;
// 			if (n && isNumeric(n.index) && n.routes && n.routes[n.index] && n.routes[n.index].key && n.routes[n.index].key != routeName) resetApp();
// 		} else if (_.includes(authRoutes, routeName)) {
// 			const n = this.navigationStateAuthRouter;
// 			if (n && isNumeric(n.index) && n.routes && n.routes[n.index] && n.routes[n.index].key && n.routes[n.index].key != routeName) navigateAuth();
// 		}
// 	}
// 	@action setParams = (routeName, params) => {
// 		const setParamsAuth = () => this.dispatchAuthRouter(NavigationActions.setParams({ params, key: routeName }));
// 		const setParamsApp = () => this.dispatchAppRouter(NavigationActions.setParams({ params, key: routeName }));
// 		if (_.includes(appRoutes, routeName)) setParamsApp();
// 		else if (_.includes(authRoutes, routeName)) setParamsAuth();
// 	}
// }
