
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Button from '../components/Button/Button';

import styles from './styles';

const Dialog = ({ Store }) => (
	<Spinner visible>
		<View style={styles.overlay}>
			<Grid>
				<Row>
					{React.createElement(Store.dialogComponent, { Store })}
				</Row>
				<Row style={{ marginTop: 30, height: 50 }}>
					<Col>
						<Button {...{ Store }} onPress={() => Store.onOk()} text="אשר" />
					</Col>
					<Col style={{ width: 20 }} />
					<Col>
						<Button {...{ Store }} onPress={() => Store.onCancel()} text="בטל" />
					</Col>
				</Row>
			</Grid>
		</View>
	</Spinner>
);

export default observer(Dialog);

