
import { NavigationActions } from 'react-navigation';
import _ from 'lodash';
import { intercept, extendObservable, observe, autorun, reaction, when, toJS, useStrict, observable, action, computed } from 'mobx';

useStrict(true);

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
