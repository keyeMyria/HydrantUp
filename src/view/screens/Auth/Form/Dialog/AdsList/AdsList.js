import React, { Component } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react/native';
import { TouchableOpacity, FlatList, View, Text } from 'react-native';

import styles from './styles';
import Separator from '../../components/Separator';

const Item = observer(({ Store, index }) => {
	const item = Store.ads[index];
	return (
		<TouchableOpacity onPress={() => Store.onAdSelect(index)}>
			<View style={Store.adIndex == index ? styles.listItemSelected : styles.listItemNotSelected}>
				<Text style={Store.adIndex == index ? styles.listItemSelectedText : styles.listItemNotSelectedText}>
					{item.ad}
				</Text>
			</View>
		</TouchableOpacity>
	);
});

const AdsList = ({ Store }) => (
	<View style={{ marginTop: 10, flex: 1 }}>
		<Text style={styles.listTitleText}>בחר</Text>
		<FlatList
			data={Store.adsArray}
			ItemSeparatorComponent={() => Separator({ style: { height: 2, backgroundColor: '#fff' } })}
			keyExtractor={(item, index) => item.id}
			renderItem={({ item, index }) => <Item {...{ Store, item, index }} />}
		/>
	</View>
);

export default observer(AdsList);

