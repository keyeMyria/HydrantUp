
import React from 'react';
import { addNavigationHelpers, TabNavigator, StackNavigator } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import _ from 'lodash';

import Form from '../view/screens/Auth/Form/Form';
import Profile from '../view/screens/Auth/Profile/Profile';

const F = inject('Store')(observer((props) => {
	console.log('props', props);
	console.log('props.Store', props.Store);
	props.Store.nav.setAuthNavigation(props.navigation);
	return (<Form />);
}));

const AuthRouter = TabNavigator(
	{
		Form: {
			screen: F,
			navigationOptions: ({ navigation: { state } }) => ({
				title: (state.params && state.params.title) || 'הידרנט'
			}),
		},
		Profile: {
			screen: Profile,
			navigationOptions: ({ navigation: { state } }) => ({
				title: (state.params && state.params.title) || 'פרופיל'
			}),
		},
	},
	{
		// headerMode: 'none',
		// mode: 'modal',
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
	}
);


export default AuthRouter;
