
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import React from 'react';
import BlurView from 'react-native-blur';
import _ from 'lodash';
import { inject, observer } from 'mobx-react/native';
import { app } from 'mobx-app';
import { observable, action, computed } from 'mobx';
import Spinner from 'react-native-loading-spinner-overlay';

@inject('Store')
@observer
class Loading extends React.Component {
	render() {
		console.log('props', this.props);
		console.log('this.props.Store', this.props.Store);
		this.props.Store.nav.setNewNavigation(this.props.navigation);
		return (
			<View>
				<Spinner {...{ visible: true }} textContent={`טוען`} />
			</View>
		);
	}
}

export default Loading;

