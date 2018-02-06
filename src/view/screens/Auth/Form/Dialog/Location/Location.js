import React, { Component } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';

import styles from './styles';

const Location = ({ Store }) => (
	<View style={{ marginTop: 20, flex: 1 }}>
		<Text style={styles.locationText}>דיוק:         {Math.round(_.get(Store.location, 'coords.accuracy'))} מטר </Text>
		<Text style={styles.locationText}>קו רוחב:   {_.get(Store.location, 'coords.latitude')}</Text>
		<Text style={styles.locationText}>קו אורך:   {_.get(Store.location, 'coords.longitude')}</Text>
	</View>
);

export default observer(Location);
