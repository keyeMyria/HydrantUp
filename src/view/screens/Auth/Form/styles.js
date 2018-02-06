import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		marginBottom: 50,
		padding: 20,
		backgroundColor: '#ffffff',
		paddingVertical: 20
	},
	label: {
		color: '#48BBEC',
		fontSize: 18,
		marginBottom: 7,
		marginTop: 1,
	},
	notConnected: {
		marginBottom: 20,
		flex: 1,
		textAlign: 'center',
		// alignSelf: 'center',
		fontSize: 18,
		backgroundColor: 'red',
		color: 'white',
	},
});

export default styles;
