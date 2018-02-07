
import { spy, intercept, extendObservable, observe, autorun, reaction, when, toJS, useStrict, observable, action, computed } from 'mobx';


import NavStore from './NavStore';
import AppStore from './AppStore';
import FormStore from './FormStore';

useStrict(true);

class Store {
	constructor() {
		console.log('mounted store');
		this.app = new AppStore(this);
		this.nav = new NavStore(this);
		
		console.log('this.app.auth', this.app.auth);
		reaction(() => this.app.auth, async (auth) => {
			if (auth) {
				this.form = new FormStore(this);
			} else {
				delete this.form;
			}
		});
	}
}

const store = new Store();

export default store;
