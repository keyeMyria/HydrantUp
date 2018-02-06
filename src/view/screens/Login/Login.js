import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import to from 'await-to-js';
import _ from 'lodash';
import { useStrict, observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { app } from 'mobx-app';

import Button from '../../components/Button/Button';
import GenericTextInput from '../../components/GenericTextInput/GenericTextInput';
import InputWrapper from '../../components/GenericTextInput/InputWrapper';
import logoImage from '../../../config/logo.jpg';
import Loading from '../../components/Loading/Loading';

import styles from './styles';

useStrict(true);

@inject('Store') @observer
export default class Login extends Component {
	// static navigationOptions = ({ navigation }) => ({
	// 	title: navigation.state.params && navigation.state.params.title || 'Login',
	// });
	@observable email = ''
	@observable password = ''
	@observable confirmPassword = ''
	@observable confirmPasswordVisible = false
	@observable error = null
	@observable loading = false

	@action set = (s) => {
		if (s.password || s.email) s.error = '';
		return _.assign(this, s);
	}

	@action handleError = error => this.set({ error })

	validInput(overrideConfirm) {
		const { email, password, confirmPassword, confirmPasswordVisible } = this;

		let valid = true;

		if (email.length === 0 || password.length === 0) {
			this.handleError('אימייל או סיסמה ריקים');
			valid = false;
		}

		if (!overrideConfirm && confirmPasswordVisible && password !== confirmPassword) {
			this.handleError('אימייל או סיסמה ריקים');
			valid = false;
		}

		if (valid) {
			this.handleError(null);
		}

		return valid;
	}

	@action handleSignIn = async () => {
		if (this.validInput(true)) {
			const { email, password } = this;
			this.set({ loading: true });
			const err = await this.props.Store.app.login({ email, password });
			if (err) {
				this.set({ loading: false });
				this.handleError(err);
			}
		}
	}

	render() {
		console.log('rendering login');
		const { error } = this;
		
		return (
			<View style={styles.container}>
				<Loading loading={this.loading} />
				<View style={styles.header}>
					<Image
						style={styles.logo}
						source={logoImage}
					/>
				</View>

				<InputWrapper>
					<GenericTextInput
						placeholder="Email"
						onChangeText={email => this.set({ email })}
					/>
					<GenericTextInput
						placeholder="Password"
						onChangeText={password => this.set({ password })}
						secureTextEntry
					/>
				</InputWrapper>

				<View style={styles.error}>
					<Text style={styles.errorText}>{error}</Text>
				</View>

				<View style={styles.buttons}>
					<Button text="היכנס" onPress={this.handleSignIn} />
				</View>
			</View>
		);
	}
}

// componentWillMount() {
// 	this.mounted = true;
// }
//
// componentWillUnmount() {
// 	this.mounted = false;
// }
//
// handleError(error) {
// 	if (this.mounted) {
// 		this.setState({ error });
// 	}
// }
