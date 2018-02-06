
import React, { Component } from 'react';
import _ from 'lodash';
import { Dimensions, TextInput, ScrollView, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import DatePicker from 'react-native-datepicker';

import styles from './styles';

const Date = ({ Store }) => (
	<DatePicker
		style={{ width: Dimensions.get('window').width - 40 }}
		date={Store.batchDate}
		onDateChange={date => Store.onBatchDateSelect(date)}
		mode="date"
		androidMode="spinner"
		placeholder="בחר"
		format="DD/MM/YYYY"
		minDate="01/01/2000"
		customStyles={{
			dateText: styles.dateText,
			placeholderText: styles.placeholderText,
			dateIcon: styles.dateIcon,
			dateInput: [styles.dateInput, Store.errorStatus && !Store.batchDate && { borderColor: 'red' }],
		}}
	/>
);

export default observer(Date);
