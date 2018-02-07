
import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'mobx-react';
import AppRouter from '../router/AppRouter';
import Store from '../stores/Store';

const App = () => {
	console.log('rendering app');
	return (
		<Provider {...{ Store }}>
			<AppRouter />
		</Provider>
	);
};

export default App;


//
// import React from 'react';
// import { Provider } from 'mobx-react';
// // import { createStore } from 'mobx-app';
// import { ObservedAppRouter } from '../router/AppRouter';
// import AppStore from '../stores/AppStore';
// import NavStore from '../stores/NavStore';
// import EventsStore from '../stores/EventsStore';
// import { createStore } from '../lib/Utils';
//
// const stores = { AppStore, NavStore, EventsStore };
//
// const { state, actions } = createStore(stores);
//
// const App = () => (
// 	<Provider {...{ actions, state }}>
// 		<ObservedAppRouter />
// 	</Provider>
// );
//
// export default App;



// import React from 'react';
// import { Actions, Router, Tabs, Drawer, Scene, Stack, Lightbox } from 'react-native-router-flux';
// import { Text } from 'react-native';
// import { Provider } from 'mobx-react';
// import { inject, observer } from 'mobx-react/native';
//
// import Login from '../view/screens/Login/Login';
// import Loading from '../view/components/Loading/Loading';
// import List from '../view/screens/Auth/List/List';
// import Profile from '../view/screens/Auth/Profile/Profile';
//
// import Store from './Store';
// import styles from './styles';
//
// const TabIcon = observer(props => (
// 	<Text style={{ fontSize: 18, fontWeight: '300', color: props.focused ? 'black' : '#c63644' }}>
// 		{props.title}
// 	</Text>
// ));
//
//
// const App = () => {
// 	console.log('rendering app');
// 	const store = new Store();
// 	return (
// 		<Provider {...{ store }}>
// 			<Router wrapBy={observer}>
// 				<Stack>
// 					<Scene key="loading" component={Loading} loading hideNavBar />
// 					<Scene key="login" component={Login} type="reset" hideNavBar />
//
// 					<Scene type="reset" key="app" hideNavBar panHandlers={null}>
// 						<Tabs
// 							swipeEnabled
// 							showLabel={true}
// 							labelStyle={styles.labelStyle}
// 							activeBackgroundColor="aliceblue"
// 							inactiveBackgroundColor="lightskyblue"
// 						>
// 							<Scene key="list" component={List} icon={TabIcon} title="llllist" hideNavBar />
// 							<Scene key="profile" component={Profile} icon={TabIcon} title="pppprofile" hideNavBar />
// 						</Tabs>
// 					</Scene>
// 				</Stack>
// 			</Router>
// 		</Provider>
// 	);
// };
//
// export default App;
//
//
// {/*<Scene key="loading" initial component={Loading} />*/}
//


//
// const App = () => {
// 	console.log('rendering app');
// 	const store = new Store();
// 	return (
// 		<Provider {...{ store }}>
// 			<Router wrapBy={observer}>
// 				<Lightbox>
// 					<Stack>
// 						<Scene key="init" component={Loading} initial on={store.init} success="app" failure="login" />
// 						<Scene key="login" component={Login} type="reset" onLogin="doAuth" title="Login" />
// 						<Tabs key="app">
// 							<Stack>
// 								<Scene title="loading" on={store.load} initial component={Loading} success="list"/>
// 								<Scene title="list" component={List} />
// 							</Stack>
// 							<Scene title="profile" onLogout="logout" component={Profile} />
// 						</Tabs>
// 						<Scene key="logout" component={Loading} on={store.logout} success="init" />
// 					</Stack>
// 					<Scene key="doAuth" on={store.login} success="app" failure="login" />
// 				</Lightbox>
// 			</Router>
// 		</Provider>
// 	);
// };


