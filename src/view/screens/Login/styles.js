import { LayoutAnimation, StyleSheet, Dimensions, Text, View, Image, AppState } from 'react-native';
import { colors } from '../../../config/styles';

const window = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	buttons: {
		flexDirection: 'row',
		backgroundColor: 'lightskyblue',
	},
	error: {
		height: 28,
		justifyContent: 'center',
		width: window.width,
		alignItems: 'center',
	},
	errorText: {
		color: colors.errorText,
		fontSize: 14,
	},
	header: {
		marginBottom: 25,
		alignItems: 'center',
	},
	logo: {
		width: 305,
		height: 96,
	},
	headerText: {
		fontSize: 30,
		color: colors.headerText,
		fontWeight: '600',
		// fontStyle: 'italic',
	},
	subHeaderText: {
		fontSize: 20,
		color: colors.headerText,
		fontWeight: '400',
	},
	scene: {
		flex: 1,
		padding: 18,
	},
});
