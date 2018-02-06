import { StyleSheet } from 'react-native';

const colors = {
	background: '#F5F2F9',
	errorText: '#FA3256',
	headerText: '#444444',
	buttonBackground: 'lightskyblue',
	buttonText: '#FFFFFF',
	inputBackground: '#FFFFFF',
	inputDivider: '#E4E2E5',
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background,
	},
	main: {
		fontSize: 20,
		textAlign: 'center',
		color: colors.headerText,
		fontWeight: '400',
		// fontStyle: 'italic',
	},
	event: {
		// fontSize: 20,
		// textAlign: 'center',
		color: 'blue',
		// fontWeight: '400',
		// fontStyle: 'italic',
	},
	newEvent: {
		// fontSize: 20,
		// textAlign: 'center',
		color: 'red',
		// fontWeight: '400',
		// fontStyle: 'italic',
	},
	data: {
		fontSize: 14,
		textAlign: 'center',
		color: '#333333',
		fontWeight: '500',
	},
	dataNew: {
		fontSize: 15,
		textAlign: 'center',
		color: '#c63644',
		fontWeight: '500',
	},
	header: {
		fontSize: 13,
		textAlign: 'center',
		color: 'black',
		fontWeight: '100',
	},
	headerNew: {
		fontSize: 13,
		textAlign: 'center',
		color: 'black',
		fontWeight: '100',
	},
});

export { colors, styles };
