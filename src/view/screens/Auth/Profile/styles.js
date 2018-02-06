import { StyleSheet } from 'react-native';
import { colors } from '../../../../config/styles';

export default StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background,
	},
	main: {
		fontSize: 18,
		textAlign: 'center',
		color: '#c63644',
		fontWeight: '400',
	},
	nameBold: {
		fontSize: 18,
		textAlign: 'center',
		color: '#c63644',
		fontWeight: '400',
	},
	name: {
		fontSize: 18,
		textAlign: 'center',
		color: colors.headerText,
		fontWeight: '400',
	},
});
