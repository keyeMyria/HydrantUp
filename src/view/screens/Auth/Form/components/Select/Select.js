
import React, { Component } from 'react';
import _ from 'lodash';
import { Dimensions, TextInput, ScrollView, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import DatePicker from 'react-native-datepicker';
import { Select, Option } from 'react-native-chooser';

import styles from './styles';

const S = ({ Store }) => (
	<Select
		indicator="down"
		indicatorColor="gray"
		textStyle={styles.selectText}
		transparent
		style={[styles.selectBox, Store.errorStatus && !Store.companyId && { borderColor: 'red' }]}
		onSelect={value => Store.onSelectCompany(value)}
		defaultText="בחר"
		selected={Store.companyId}
		optionListStyle={styles.optionList}
	>
		{Store.companies.map(el => (
			<Option
				key={el._id}
				value={el._id}
				style={styles.option}
				styleText={styles.optionText}
			>
				{el.name}
			</Option>
		))}
	</Select>
);

export default observer(S);
