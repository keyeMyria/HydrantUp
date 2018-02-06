
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
	mounted
	@observable spinner = 3
	@observable spinnerInc = 1
	@observable timeout = this.props.timeout || 0
	@action set = s => _.assign(this, s)

	intSpinner() {
		if (!this.mounted) return;
		console.log('this.timeout');
		console.log(this.timeout);
		if (this.timeout && this.timeout > 0) this.set({ timeout: this.timeout - 1 });
		if (!this.timeout) clearInterval(this.spinnerInterval);
		const { spinner } = this;
		let inc = this.spinnerInc;
		this.set({ spinner: spinner + inc });
		if (spinner > 10) this.set({ spinnerInc: -1 });
		else if (spinner <= 4) this.set({ spinnerInc: 1 });
	}
	componentDidMount() {
		this.mounted = true;
		console.log('loading mounted');
		if (this.props.loading && this.props.timeout && !this.spinnerInterval) this.spinnerInterval = setInterval(() => this.intSpinner(), 1 * 1000);
	}
	componentWillReceiveProps(props) {
		if (this.props.loading && this.props.timeout) {
			if (!this.spinnerInterval) this.spinnerInterval = setInterval(() => this.intSpinner(), 1 * 1000);
		} else {
			clearInterval(this.spinnerInterval);
		}
	}
	componentWillUnmount() {
		this.mounted = false;
		console.log('loading UNmounted');
		clearInterval(this.spinnerInterval);
	}
	render() {
		const spinner = _.repeat('.', this.spinner);
		const visible = this.props.loading && ((this.props.timeout && !!this.timeout) || !this.props.timeout);
		return (
			<View>
				<Spinner {...{ visible }} textContent={`${spinner}טוען`} />
			</View>
		);
	}
}

export default Loading;

//
// {/*<Overlay isVisible={this.props.Store.loading}>*/}
// {/*<BlurView style={styles.background} blurType="dark">*/}
// 	{/*<ActivityIndicator*/}
// 		{/*size="large"*/}
// 		{/*animating*/}
// 		{/*style={styles.spinner}*/}
// 	{/*/>*/}
// 	{/*<Text style={{ fontSize: 27, textAlign: 'center', fontWeight: '400' }}>טוען{spinner}</Text>*/}
// {/*</BlurView>*/}
// {/*</Overlay>*/}

//
// <View style={{ backgroundColor: '#F5F2F9', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' }}>
// 	<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
// 		<ActivityIndicator size="large" color="#0000ff" />
// 		<Text style={{ fontSize: 27, textAlign: 'center', fontWeight: '400' }}>טוען{spinner}</Text>
// 	</View>
// </View>

//
// //
// // {/*<Spinner visible overlayColor={color} textContent="טוען..." textStyle={{ color: '#000' }} animation="fade" />*/}
