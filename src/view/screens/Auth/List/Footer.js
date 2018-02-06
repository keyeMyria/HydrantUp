
import React from 'react';
import { inject, observer } from 'mobx-react/native';
import { app } from 'mobx-app';

import { TouchableOpacity, FlatList, Text, View } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { formatDate } from '../../../../lib/Utils';

const Footer = () => (
	<View style={{ marginBottom: 10, marginTop: 5, backgroundColor: 'powderblue', height: 35, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }} />
);

export default Footer;

