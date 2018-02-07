
import React from 'react';
import { addNavigationHelpers, TabNavigator, StackNavigator } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import _ from 'lodash';

import Form from '../view/screens/Auth/Form/Form';
import Profile from '../view/screens/Auth/Profile/Profile';

const F = inject('Store')(observer((props) => {
	props.Store.nav.setAuthNavigation(props.navigation);
	return (<Form />);
}));

const AuthRouter = TabNavigator(
	{
		Form: {
			screen: F,
			navigationOptions: {
				title: 'הידרנט',
			},
		},
		Profile: {
			screen: Profile,
			navigationOptions: {
				title: 'פרופיל',
			},
		},
	},
	{
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
