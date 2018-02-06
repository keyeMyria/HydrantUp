import React from 'react';
import { View, TextInput } from 'react-native';
import styles from './styles';

const GenericTextInput = props => (
	<View>
		<If condition={props.borderTop}>
			<View style={styles.divider} />
		</If>
		<TextInput
			style={styles.input}
			autoCapitalize="none"
			autoCorrect={false}
			{...props}
		/>
	</View>
);

export default GenericTextInput;
