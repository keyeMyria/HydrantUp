import React from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import styles from '../styles';

const Separator = ({ style }) => (
	<View {...{ style }} />
);

export default Separator;
