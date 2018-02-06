import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center'
	},
	button: {
		height: 36,
		backgroundColor: '#48BBEC',
		// backgroundColor: disabled ? 'lightgray' : '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
});

export default styles;

// const styles = StyleSheet.create({
// 	buttonText: {
// 		fontSize: 18,
// 		color: 'white',
// 		alignSelf: 'center',
// 		padding: 7,
// 	},
// 	button: {
// 		flex: 1,
// 		backgroundColor: '#48BBEC',
// 		// backgroundColor: disabled ? 'lightgray' : '#48BBEC',
// 		borderColor: '#48BBEC',
// 		// borderWidth: 1,
// 		borderRadius: 5,
// 		// marginBottom: 10,
// 		alignSelf: 'stretch',
// 		justifyContent: 'center',
// 		margin: -3,
// 	},
// 	buttonView: {
// 		margin: 5,
// 		borderColor: '#48BBEC',
// 		borderWidth: 5,
// 		borderRadius: 5,
// 	},
// });
