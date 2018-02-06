
import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from 'react-native-elements';
import RNRestart from 'react-native-restart';
// import { Actions } from 'react-native-router-flux';
import { InteractionManager, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { app } from 'mobx-app';
import { useStrict, observable, action, computed } from 'mobx';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Loading from '../../../components/Loading/Loading';
import { deferRun, sleep } from '../../../../lib/Utils';

import styles from './styles';

useStrict(true);

@inject('Store') @observer
export default class Profile extends Component {
	@observable loading = false
	@action set = s => _.assign(this, s)

	render() {
		setTimeout(() => {
			this.props.navigation.navigate('Login');
		}, 5000);
		console.log('profile');
		console.log(this.props);
		const { props } = this;
		const { navigation } = props;
		const { navigate } = navigation;
		const { Store } = props;
		const { user } = Store.app;
		const { name, email, companyName } = user || {};
		return (
			<View style={{ backgroundColor: 'aliceblue', flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch' }}>
				<Loading loading={this.loading} />
				<View style={{ paddingTop: 10, height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text style={styles.nameBold}>שם</Text>
				</View>
				<View style={{ height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text style={styles.name}>{name}</Text>
				</View>
				<View style={{ paddingTop: 10, height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text style={styles.nameBold}>אימייל</Text>
				</View>
				<View style={{ height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text style={styles.name}>{email}</Text>
				</View>
				<View style={{ paddingTop: 10, height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text style={styles.nameBold}>חברה</Text>
				</View>
				<View style={{ height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text style={styles.name}>{companyName}</Text>
				</View>
	
				<View style={{ margin: 20, height: 40, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
					<Button
						Component={TouchableOpacity}
						raised
						icon={{ name: 'log-out', type: 'feather', size: 32 }}
						buttonStyle={{ width: 150, backgroundColor: 'lightskyblue', borderRadius: 0 }}
						textStyle={styles.main}
						title="לצאת"
						onPress={Store.app.logout}
					/>
				</View>
				<If condition={Store.events}>
					<View style={{ margin: 5, height: 50, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
						<Button
							Component={TouchableOpacity}
							raised
							icon={{ name: 'x-circle', type: 'feather', size: 32 }}
							buttonStyle={{ width: 150, backgroundColor: 'lightskyblue', borderRadius: 0 }}
							textStyle={styles.main}
							title="קראתי הכל"
							onPress={async () => {
								await sleep(200);
								this.set({ loading: true });
								await sleep(500);
								Store.events.toggleAllDataNew();
								await sleep(1500);
								this.set({ loading: false });
								navigate('List');
							}}
						/>
					</View>
				</If>
				<TouchableOpacity onPress={() => RNRestart.Restart()} style={{ height: 50, backgroundColor: 'powderblue' }} />
			</View>
		);
	}
}

//
// <Grid>
// 	<Row size={1}>
// 		<Col size={1}>
// 			<Row style={{ height: 40 }}>
// 				<View style={{ paddingTop: 10, height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
// 					<Text style={styles.nameBold}>שם</Text>
// 				</View>
// 			</Row>
// 			<Row style={{ height: 40 }}>
// 				<View style={{ height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
// 					<Text style={styles.name}>{name}</Text>
// 				</View>
// 			</Row>
// 		</Col>
// 		<Col size={1}>
// 			<Text>12</Text>
// 		</Col>
// 		<Col size={1}>
// 			<Row style={{ height: 40 }}>
// 				<View style={{ paddingTop: 10, height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
// 					<Text style={styles.nameBold}>אימייל</Text>
// 				</View>
// 			</Row>
// 			<Row style={{ height: 40 }}>
// 				<View style={{ height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
// 					<Text style={styles.name}>{email}</Text>
// 				</View>
// 			</Row>
// 		</Col>
// 	</Row>
// 	<Row size={1}>
// 		<Col size={1}>
// 			<Text>21</Text>
// 		</Col>
// 		<Col size={1}>
// 			<Text>22</Text>
// 		</Col>
// 		<Col size={1}>
// 			<Text>23</Text>
// 		</Col>
// 	</Row>
// 	<Row size={1}>
// 		<Col size={1}>
// 			<Text>31</Text>
// 		</Col>
// 		<Col size={1}>
// 			<Row style={{ height: 40 }}>
// 				<View style={{ paddingTop: 10, height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
// 					<Text style={styles.nameBold}>חברה</Text>
// 				</View>
// 			</Row>
// 			<Row style={{ height: 40 }}>
// 				<View style={{ height: 7, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
// 					<Text style={styles.name}>{companyName}</Text>
// 				</View>
// 			</Row>
// 		</Col>
// 		<Col size={1}>
// 			<Text>33</Text>
// 		</Col>
// 	</Row>
// </Grid>


