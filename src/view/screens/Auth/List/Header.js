
import React from 'react';
import { inject, observer } from 'mobx-react/native';
import { app } from 'mobx-app';

import { TouchableOpacity, FlatList, Text, View } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { formatDate } from '../../../../lib/Utils';

const Header = ({ Store }) => {
	const { data } = Store;
	const { connected, lastComm } = Store.root.app;
	if (connected) {
		return (
			<View style={{ marginBottom: 10, marginTop: 5, backgroundColor: 'powderblue', height: 35, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
				<View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text style={{ fontWeight: '400', fontSize: 18 }}>{data.length}</Text>
				</View>
			</View>
		);
	} else {
		return (
			<View style={{ marginBottom: 10, marginTop: 5, backgroundColor: '#c63644', height: 35, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<Grid>
					<Col style={{ width: 10 }} />
					<Col size={1} style={{ height: 25 }}>
						<Row>
							<Text style={{ fontWeight: '400', fontSize: 15, color: 'white' }}>{lastComm ? 'תקשורת אחרונה' : 'אין תקשורת'}</Text>
						</Row>
					</Col>
					<Col size={2} style={{ height: 25 }}>
						<Row>
							<Text style={{ color: 'white', fontWeight: '400', fontSize: 15 }}>{formatDate({ date: lastComm })}</Text>
						</Row>
					</Col>
				</Grid>
			</View>
		);
	}
};

export default inject('Store')(observer(Header));

