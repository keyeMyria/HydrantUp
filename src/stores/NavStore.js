
import { NavigationActions } from 'react-navigation';
import _ from 'lodash';
import { intercept, extendObservable, observe, autorun, reaction, when, toJS, useStrict, observable, action, computed } from 'mobx';
import { arrayAssign, isNumeric, meteorLoginWithPassword, c, toto, now, Server, LocalStorage, meteorCall, getDeviceInfo, sleep } from '../lib/Utils';
// import { AppRouter } from '../router/AppRouter';
// import { getAuthRouter } from '../router/AuthRouter';

useStrict(true);

const appRoutes = ['Loading', 'Login', 'Auth'];
const authRoutes = ['Form', 'Profile'];

class Store {
	@action s = s => _.assign(this, s)

	@observable appNavigation
	@observable authNavigation
	
	@action setAppNavigation(appNavigation) { this.s({ appNavigation }); }
	@action setAuthNavigation(authNavigation) { this.s({ authNavigation }); }
	
	constructor(root) {
		this.root = root;
		reaction(() => this.root.app.auth, (auth) => {
			if (auth)	{
				this.appNavigation.dispatch(resetAction('Auth'));
			} else {
				this.appNavigation.dispatch(resetAction('Login'));
			}
		});
	}
}

function resetAction(routeName) {
	return NavigationActions.reset({
		index: 0,
		actions: [NavigationActions.navigate({ routeName })],
	});
}

export default Store;

// setTimeout(() => {
// 	this.navigation.navigate(resetAction);
// }, 1000);
//
//
// setTimeout(() => {
// 	const resetAction = NavigationActions.reset({
// 	  index: 0,
// 	  actions: [NavigationActions.navigate({ routeName: 'Login' })],
// 	});
// 	this.navigation.dispatch(resetAction);
// }, 1000);
// setTimeout(() => {
// 	const resetAction = NavigationActions.reset({
// 	  index: 0,
// 	  actions: [NavigationActions.navigate({ routeName: 'Auth' })],
// 	});
// 	this.navigation.dispatch(resetAction);
// }, 3000);
//		setTimeout(() => navigation.navigate('Login'), 1000);

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
