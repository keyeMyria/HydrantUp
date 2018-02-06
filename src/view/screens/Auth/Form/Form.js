
import React, { Component } from 'react';
import _ from 'lodash';
import { Dimensions, TextInput, ScrollView, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import Spinner from 'react-native-loading-spinner-overlay';

import Dialog from './Dialog/Dialog';
import Alert from './components/Alert/Alert';

import Button from './components/Button/Button';
import Separator from './components/Separator';

import tcombForm from './TcombForm/TcombForm';
import Select from './components/Select/Select';
import Date from './components/Date/Date';

import styles from './styles';

const F = ({ Store: S }) => {
	const Store = S.form;
	console.log('rendering Form', Store.formValue);
	const { TCombForm, formStruct, formOptions } = tcombForm();
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Spinner {...{ visible: Store.loading }} textContent="טוען..." />
			<If condition={Store.dialogVisible && !Store.loading} >
				<Dialog {...{ Store }} />
			</If>
			<If condition={Store.alertVisible && !Store.loading} >
				<Alert {...{ Store }} />
			</If>
			<If condition={!Store.root.app.connected} >
				<Text style={styles.notConnected}>מנסה להתחבר</Text>
			</If>
			<Button {...{ Store }} onPress={() => Store.onBarcodeOpen('sim')} text="ברקוד סים" />
			<Button {...{ Store }} onPress={() => Store.onBarcodeOpen('bodyBarcode')} text="ברקוד גוף" />
			<Button {...{ Store }} disabled={!Store.lat || !Store.lon} onPress={() => Store.onAdOpen()} text="כתובת" />
			<Button {...{ Store }} onPress={() => Store.onLocationOpen()} text="מיקום" />

			<TCombForm
				ref={f => Store.setFormRef(f)}
				type={formStruct}
				options={formOptions}
				value={Store.formValue}
				onChange={value => Store.onFormChange(value)}
			/>

			<Text style={styles.label}>חברה</Text>
			<Select {...{ Store }} />

			<Separator style={{ height: 15 }} />
			
			<Text style={styles.label}>תאריך ייצור</Text>
			<Date {...{ Store }} />

			<Separator style={{ height: 35 }} />
			
			<Button
				{...{ Store }}
				style={Store.submitButtonRed && { borderColor: 'red', borderWidth: 3 }}
				onPress={() => Store.onSubmit()}
				text="שמור"
			/>
		</ScrollView>
	);
};


export default inject('Store')(observer(F));
