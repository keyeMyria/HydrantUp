import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	selectBox: {
		borderRadius: 5,
		width: Dimensions.get('window').width - 40,
		borderColor: '#cccccc',
		borderWidth: 1
	},
	selectText: {
		fontSize: 16,
		color: 'black',
	},
	optionList: {
		backgroundColor: 'lightseagreen',
		borderRadius: 3,
		borderColor: 'red',
		borderWidth: StyleSheet.hairlineWidth
	},
	option: {
		height: 40,
		borderBottomColor: 'white',
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	optionText: {
		fontSize: 16,
		color: 'white',
	},
});

export default styles;
