import React from 'react';
import { Linking } from 'react-native';

export default function openMap({ lat, lon, address }) {
	const mapLink = `http://maps.google.com/maps?q=${lat},${lon}(${address})&z=10`;
	console.log('mapLink');
	console.log(mapLink);
	Linking.openURL(mapLink).catch(err => console.error('An error occurred', err));
}
