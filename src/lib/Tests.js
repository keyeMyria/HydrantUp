
import store from '../stores/Store';
import { sleep } from './Utils';

async function testRouter() {
	await sleep(3000);
	store.navigate('Auth');
	await sleep(2000);
	store.navigate('Auth');
	store.navSetParams('Auth', { title: 'changed' });
	await sleep(1000);
	store.navSetParams('Auth', { title: 'changed1' });
	await sleep(3000);
	
	store.navigate('Profile');
	await sleep(2000);
	store.navigate('Profile');
	await sleep(2000);
	store.navSetParams('Profile', { title: 'changed' });
	await sleep(1000);
	store.navSetParams('Profile', { title: 'changed1' });
	await sleep(3000);
	
	store.navigate('List');
	await sleep(2000);
	store.navigate('List');
	await sleep(2000);
	store.navSetParams('List', { title: 'changed' });
	await sleep(1000);
	store.navSetParams('List', { title: 'changed1' });
	await sleep(3000);
	
	store.navigate('Login');
	await sleep(2000);
	store.navigate('Login');
	await sleep(2000);
	store.navSetParams('Login', { title: 'changed' });
	await sleep(1000);
	store.navSetParams('Login', { title: 'changed1' });
	await sleep(3000);
	
	store.navigate('Auth');
	await sleep(2000);
	store.navigate('Auth');
	await sleep(2000);
	store.navSetParams('Auth', { title: 'changed' });
	await sleep(1000);
	store.navSetParams('Auth', { title: 'changed1' });
}
