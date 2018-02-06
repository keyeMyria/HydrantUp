
import _ from 'lodash';
import Meteor, { createContainer } from 'react-native-meteor';
import * as DeviceInfo from 'react-native-device-info';
import { AsyncStorage } from 'react-native';
import { intercept, extendObservable, observe, autorun, reaction, when, toJS, useStrict, observable, action, computed } from 'mobx';
import Settings from '../config/settings';

const isUserAdmin = user => user && user.role == 0;
const isUserControl = user => user && user.role == 1;
const isUserSecurity = user => user && user.role == 2;

export {
	isUserAdmin,
	isUserControl,
	isUserSecurity,
};
