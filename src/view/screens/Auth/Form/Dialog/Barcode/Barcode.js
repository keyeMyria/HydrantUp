
import React, { Component } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import Camera from 'react-native-camera';

import styles from './styles';

const Barcode = ({ Store }) => (
	<View style={{ flex: 1 }}>
		<Camera
			style={styles.camera}
			onBarCodeRead={barcode => Store.onBarCodeRead(barcode)}
			aspect={Camera.constants.Aspect.fill}
		>
			<Text style={styles.cameraText}>{Store.barcode}</Text>
		</Camera>
	</View>
);

export default observer(Barcode);

//
// onBarCodeRead = (e) => {
// 	console.log(
// 		'Barcode Found!',
// 		'Type: ' + e.type + '\nData: ' + e.data
// 	);
// }
// ref={cam => this.camera = cam}
// style={styles.preview}


