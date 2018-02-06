import React from 'react';
import { StyleSheet, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react/native';

import styles from './styles';

const Button = ({ Store, text, style, onPress, disabled }) => (
	<TouchableOpacity
		
		{...{ onPress, disabled: Store.disableButtons || disabled }}
		style={[styles.button, style, (Store.disableButtons || disabled) && { backgroundColor: 'lightgray' }]}
		underlayColor="#99d9f4"
	>
		<Text style={styles.buttonText}>
			{text}
		</Text>
	</TouchableOpacity>
);

export default observer(Button);


// const Button = ({ Store, text, style, onPress }) => (
// 	<View style={styles.buttonView}>
// 		<TouchableOpacity
// 			{...{ onPress, disabled: Store.disableButtons }}
// 			style={styles.button}
// 			underlayColor="#99d9f4"
// 		>
// 			<Text style={styles.buttonText}>
// 				{text}
// 			</Text>
// 		</TouchableOpacity>
// 	</View>
// );
