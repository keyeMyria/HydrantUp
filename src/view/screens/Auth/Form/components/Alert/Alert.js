import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Button from '../Button/Button';

import styles from './styles';

const Alert = ({ Store }) => (
	<Spinner visible>
		<View style={styles.overlay}>
			<Grid>
				<Row style={{ marginTop: 10 }}>
					<Col>
						<Text style={styles.title}>{Store.alertTitle}</Text>
					</Col>
				</Row>
				<Row style={{ marginTop: 30 }}>
					<Col>
						<Text style={styles.text}>{Store.alertText}</Text>
					</Col>
				</Row>
				<Row style={{ marginTop: 30, height: 50 }}>
					<Col>
						<Button {...{ Store }} onPress={() => Store.onAlertOk()} text="אשר" />
					</Col>
				</Row>
			</Grid>
		</View>
	</Spinner>
);

export default observer(Alert);

