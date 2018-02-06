
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { app } from 'mobx-app';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { InteractionManager, TouchableOpacity, FlatList, Text, View } from 'react-native';

import Header from './Header';
import Footer from './Footer';
import Item from './Item';
import Loading from '../../../components/Loading/Loading';

const Separator = () => <View style={{ height: 10, backgroundColor: 'aliceblue' }} />;

const List = (props) => {
	console.log('rendering list');
	const Store = props.Store.events;
	console.log('Store', Store);
	return (
		<View style={{ backgroundColor: 'aliceblue', flex: 1 }}>
			<Loading timeout={7} loading />
			<Grid>
				<Col style={{ width: 10 }} />
				<Col>
					<FlatList
						data={Store.dataArray}
						ItemSeparatorComponent={Separator}
						ListHeaderComponent={() => <Header {...{ Store }} />}
						ListFooterComponent={Footer}
						keyExtractor={(item, index) => item.eventId}
						renderItem={({ item, index }) => <Item {...{ Store, item, index }} />}
					/>
				</Col>
				<Col style={{ width: 10 }} />
			</Grid>
		</View>
	);
};

export default inject('Store')(observer(List));

