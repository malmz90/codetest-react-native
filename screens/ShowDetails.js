import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';

const ShowDetails = ({ navigation }) => {
	const [show, setShow] = useState([]);
	const [isLoading, setIsloading] = useState(false);
	const [error, setError] = useState();
	const searchShow = (input) => {
		setIsloading(true);
		if (input) {
			fetch(`https://api.tvmaze.com/shows/${input}`)
				.then((res) => res.json())
				.then((data) => {
					setShow(data);
					setIsloading(false);
				})
				.catch((error) => console.error(error));
		}
	};

	useEffect(() => {
		let canceled = false;
		if (!navigation.state.params.show.id) {
			return;
		}
		if (!canceled) {
			searchShow(navigation.state.params.show.id);
		}

		return () => {
			canceled = true;
		};
	}, []);

	const getContent = () => {
		if (isLoading) {
			return <ActivityIndicator size={'large'} />;
		}
		if (error) {
			return <Text>{error}</Text>;
		}
	};

	return (
		<View style={styles.container}>
			{getContent()}
			{show && show.image && !isLoading && (
				<View>
					<Image
						style={styles.logo}
						source={{ uri: show.image.original }}
					/>

					<Text>{show.name}</Text>
					<Text>
						Rating:
						{show.rating.average
							? show.rating.average
							: 'No rating'}
					</Text>
				</View>
			)}

			<StatusBar style="auto" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	logo: {
		width: 350,
		height: 200,
		marginTop: 2,
	},
});

export default ShowDetails;
