import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	listTitleText: {
		textAlign: 'center',
		padding: 10,
		fontSize: 18,
		color: 'lightseagreen',
		fontWeight: '600',
		backgroundColor: '#fff',
	},
	listItemSelectedText: {
		padding: 7,
		fontSize: 16,
		backgroundColor: 'lightseagreen',
		color: 'aliceblue',
	},
	listItemNotSelectedText: {
		padding: 7,
		fontSize: 16,
		backgroundColor: 'aliceblue',
		color: '#000',
	},
});

export default styles;
