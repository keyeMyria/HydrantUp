
import React from 'react';
import { addNavigationHelpers, TabNavigator, StackNavigator } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import _ from 'lodash';

import Loading from '../view/screens/Loading';
import Form from '../view/screens/Auth/Form/Form';
import Profile from '../view/screens/Auth/Profile/Profile';

const getAuthRouter = (role) => {
	const tabs = {};
	tabs.Form = {
		screen: Form,
		navigationOptions: ({ navigation: { state } }) => ({
			title: (state.params && state.params.title) || 'הידרנט'
		}),
	};
	
	tabs.Profile = {
		screen: Profile,
		navigationOptions: ({ navigation: { state } }) => ({
			title: (state.params && state.params.title) || 'פרופיל'
		}),
	};
	
	const config = {
		headerMode: 'none',
		mode: 'modal',
		tabBarOptions: {
			activeTintColor: '#c63644',
			inactiveTintColor: '#e91e63',
			labelStyle: {
				fontSize: 18,
				fontWeight: '300',
			},
			style: {
				backgroundColor: 'aliceblue',
			},
			indicatorStyle: {
				backgroundColor: '#c63644',
			},
		}
	};
	const AuthRouter = TabNavigator(tabs, config);
	return AuthRouter;
};

const ObservedAuthRouter = inject('Store')(observer(props => (
	React.createElement(props.Store.nav.AuthRouter, {
		navigation: addNavigationHelpers({
			dispatch: props.Store.nav.dispatchAuthRouter,
			state: props.Store.nav.navigationStateAuthRouter,
			addListener: ([...par]) => console.log('addlistener auth', par),
		})
	})
)));

export { getAuthRouter, ObservedAuthRouter };
