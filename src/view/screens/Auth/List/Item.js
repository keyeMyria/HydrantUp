
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import _ from 'lodash';

import { InteractionManager, TouchableOpacity, FlatList, Text, View } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/EvilIcons';

import * as u from '../../../../lib/Utils';
import { styles } from '../../../../config/styles';

const Item = ({ Store, index }) => {
	const item = Store.data[index];
	
	const backgroundColor = index % 2 ? 'lightskyblue' : 'lightskyblue';

	let textStyle, headerTextStyle;
	if (item.isNew) {
		textStyle = styles.dataNew;
		headerTextStyle = styles.headerNew;
	} else {
		textStyle = styles.data;
		headerTextStyle = styles.header;
	}
	return (
		<TouchableOpacity onPress={() => Store.onItemPressed(index)}>
			<View style={{ backgroundColor, height: 80, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<Grid>
					<Col style={{ width: 10 }} />
					<Col size={3} style={{ height: 65 }}>
						<Row>
							<Text style={headerTextStyle}>תאריך</Text>
						</Row>
						<Row>
							<Text style={headerTextStyle}>מספר הידרנט</Text>
						</Row>
						<Row>
							<Text style={headerTextStyle}>האירוע</Text>
						</Row>
					</Col>
					<Col size={6} style={{ height: 65 }}>
						<Row>
							<Text style={textStyle}>{u.formatDate({ isoDate: item.createdAt })}</Text>
						</Row>
						<Row>
							<Text style={textStyle}>{item.hydrantNumber}</Text>
						</Row>
						<Row>
							<Text style={textStyle}>{item.codeText}</Text>
						</Row>
					</Col>
					<Col size={1} style={{ height: 65, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Row>
							<If condition={item.lat && item.lon}>
								<Icon name="location" size={30} color="#c63644" />
							</If>
						</Row>
					</Col>
				</Grid>
			</View>
		</TouchableOpacity>
	);
};

export default observer(Item);

