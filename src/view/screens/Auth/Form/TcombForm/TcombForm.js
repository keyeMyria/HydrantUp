
import React, { Component } from 'react';
import t from 'tcomb-form-native';

const formStyles = {
	fieldset: {
		marginTop: 10,
		marginBottom: 0
	},
	formGroup: {
		normal: {
			marginBottom: 10
		},
	},
	controlLabel: {
		normal: {
			color: '#48BBEC',
			fontSize: 18,
			marginBottom: 7,
		},
		error: {
			color: 'red',
			fontSize: 18,
			marginBottom: 7,
			fontWeight: '600'
		}
	}
};

function tcombForm() {
	const { Form } = t.form;
	const TCombForm = Form;
	
	const formStruct = t.struct({
		sim: t.String,
		lat: t.Number,
		lon: t.Number,
		address: t.String,
		bodyBarcode: t.maybe(t.String),
		description: t.maybe(t.String),
		comments: t.maybe(t.String),
		history: t.maybe(t.String),
	});
	
	const formOptions = {
		fields: {
			sim: {
				label: 'סים',
			
			},
			lat: {
				label: 'קו רוחב',
			
			},
			lon: {
				label: 'קו אורך',
			
			},
			address: {
				label: 'כתובת',
			
			},
			description: {
				label: 'תיאור',
			
			},
			comments: {
				label: 'הערות',
			
			},
			history: {
				label: 'היסטוריה',
			
			},
			bodyBarcode: {
				label: 'ברקוד גוף',
			
			},
		},
		stylesheet: { ...Form.stylesheet, ...formStyles }
	};
	
	return { TCombForm, formStruct, formOptions };
}

export default tcombForm;
