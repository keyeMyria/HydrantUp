
import React from 'react';
import { NavigationActions, addNavigationHelpers, TabNavigator, StackNavigator } from 'react-navigation';
import { inject, observer } from 'mobx-react/native';
import Login from '../view/screens/Login/Login';
import Loading from '../view/components/Loading/Loading';
import AuthRouter from './AuthRouter';

const L = inject('Store')(observer((props) => {
	props.Store.nav.setAppNavigation(props.navigation);
	return (<Loading loading />);
}));

const AppRouter = StackNavigator(
	{
		Loading: { screen: L },
		Auth: { screen: AuthRouter },
		Login: { screen: Login },
	},
	{
		headerMode: 'none',
		mode: 'modal',
		initialRouteName: 'Loading',
		gesturesEnabled: false
	}
);

export default AppRouter;


// import {
//   createStore,
//   applyMiddleware,
//   combineReducers,
// } from 'redux';
// import {
//   createReduxBoundAddListener,
//   createReactNavigationReduxMiddleware,
// } from 'react-navigation-redux-helpers';
// import { Provider, connect } from 'react-redux';
//
// import React from 'react';
// import { NavigationActions, addNavigationHelpers, TabNavigator, StackNavigator } from 'react-navigation';
// import { inject, observer } from 'mobx-react/native';
//
//
// import Login from '../view/screens/Login/Login';
// import Loading from '../view/screens/Loading';
// import { ObservedAuthRouter } from './AuthRouter';
// import Form from '../view/screens/Auth/Form/Form';
// import Profile from '../view/screens/Auth/Profile/Profile';
//
// const AppRouter = TabNavigator(
// 	{
// 		Profile: {
// 			screen: Profile,
// 			navigationOptions: ({ navigation: { state } }) => ({
// 				title: (state.params && state.params.title) || 'פרופיל'
// 			}),
// 		},
// 		Form: {
// 			screen: Login,
// 			navigationOptions: ({ navigation: { state } }) => ({
// 				title: (state.params && state.params.title) || 'הידרנט'
// 			}),
// 		},
// 	},
// 	{
// 		headerMode: 'none',
// 		mode: 'modal',
// 		tabBarOptions: {
// 			activeTintColor: '#c63644',
// 			inactiveTintColor: '#e91e63',
// 			labelStyle: {
// 				fontSize: 18,
// 				fontWeight: '300',
// 			},
// 			style: {
// 				backgroundColor: 'aliceblue',
// 			},
// 			indicatorStyle: {
// 				backgroundColor: '#c63644',
// 			},
// 		}
// 	},
// );
// /*const AuthRouter = StackNavigator(
// 	{
// 		Loading: {
// 			screen: Loading,
// 		},
// 		Auth: {
// 			screen: AuthRouter,
// 		},
// 		Login: {
// 			screen: Login,
// 		},
// 	},
// 	{
// 		headerMode: 'none',
// 		mode: 'modal',
// 		gesturesEnabled: false
// 	},
// );*/
//
//
//
// const initialState = AppRouter.router.getStateForAction(AppRouter.router.getActionForPathAndParams('Profile'));
//
// const navReducer = (state = initialState, action) => {
// 	console.log('reeducer');
//   const nextState = AppRouter.router.getStateForAction(action, state);
//
//   // Simply return the original `state` if `nextState` is null or undefined.
//   return nextState || state;
// };
//
// const appReducer = combineReducers({
//   nav: navReducer
// });
//
// // Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
// const middleware = createReactNavigationReduxMiddleware(
//   "root",
//   state => state.nav,
// );
// const addListener = createReduxBoundAddListener("root");
//
// class App extends React.Component {
//   render() {
//     return (
//       <AppRouter navigation={addNavigationHelpers({
//         dispatch: this.props.dispatch,
//         state: this.props.nav,
//         addListener,
//       })} />
//     );
//   }
// }
//
// const mapStateToProps = (state) => ({
//   nav: state.nav
// });
//
// const AppWithNavigationState = connect(mapStateToProps)(App);
//
// const store = createStore(
//   appReducer,
//   applyMiddleware(middleware),
// );
//
// setTimeout(() => {
// //	store.dispatch(NavigationActions.reset({
// //			index: 0,
// //			actions: [NavigationActions.navigate({ routeName: 'Profile' })]
// //		}));
// 		store.dispatch(AppRouter.router.getActionForPathAndParams('Form'));
// }, 3000);
//
// //setTimeout(() => {
// //		store.dispatch(AppRouter.router.getActionForPathAndParams('Login'));
// 		//(AppRouter.router.getActionForPathAndParams('Login'))
// //}, 6000);
//
//
// class ObservedAppRouter extends React.Component {
//   render() {
//     return (
//       <Provider store={store}>
// 			<AppWithNavigationState />
//       </Provider>
//     );
//   }
// }
//
// /* const ObservedAppRouter = inject('Store')(observer(props => (
// 	<AppRouter navigation={addNavigationHelpers({
// 		dispatch: props.Store.nav.dispatchAppRouter,
// 		state: props.Store.nav.navigationStateAppRouter,
// 		addListener: ([...par]) => console.log('addlistener app', par),
// 	})}
// 	/>
// )));
//  */
// export { AppRouter, ObservedAppRouter };


