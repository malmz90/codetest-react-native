import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TextInput,
	Image,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

const Search = ({ navigation }) => {
	const [search, setSearch] = useState('');
	const [masterData, setMasterData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [isLoading, setIsloading] = useState(false);
	const [error, setError] = useState();

	const searchShow = (input) => {
		setIsloading(true);
		if (input) {
			fetch(`https://api.tvmaze.com/search/shows?q=${input}`)
				.then((res) => res.json())
				.then(
					(data) => {
						setFilteredData(data), setMasterData(data);
						setIsloading(false);
					},
					(error) => {
						setIsloading(false);
						setError(error);
					}
				)
				.catch((error) => console.error(error));
		}
	};

	const getContent = () => {
		if (isLoading) {
			return <ActivityIndicator size={'large'} />;
		}
		if (error) {
			return <Text>{error}</Text>;
		}
	};

	const searchFilter = (text) => {
		if (text) {
			const newData = masterData.filter((item) => {
				const itemData = item.show.name
					? item.show.name.toUpperCase()
					: ''.toUpperCase();
				const textData = text.toUpperCase();
				return itemData.indexOf(textData) > -1;
			});
			setFilteredData(newData);
			setSearch(text);
		} else {
			setFilteredData(masterData);
			setSearch(text);
		}
	};

	const ItemView = ({ item }) => {
		return (
			<View>
				{item && (
					<TouchableOpacity
						style={{ flex: 1, flexDirection: 'row' }}
						onPress={() => navigation.navigate('ShowDetails', item)}
					>
						<View>
							{item.show.image && (
								<Image
									style={styles.tinyLogo}
									source={{ uri: item.show.image.original }}
								/>
							)}
						</View>
						<View>
							<Text style={styles.itemStyle}>
								{item.show.name.toUpperCase()}
							</Text>
						</View>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	const ItemSeparatorView = () => {
		return (
			<View
				style={{
					height: 0.5,
					width: '100%',
					backgroundColor: '#c8c8c8',
				}}
			></View>
		);
	};
	return (
		<View style={styles.container}>
			<TextInput
				style={styles.textInputStyle}
				value={search}
				placeholder="search shows"
				underlineColorAndroid="transparent"
				onChangeText={(text) => {
					searchFilter(), searchShow(text);
				}}
			/>
			{getContent()}
			{!isLoading && (
				<FlatList
					data={filteredData}
					keyExtractor={(item, index) => index.toString()}
					ItemSeparatorComponent={ItemSeparatorView}
					renderItem={ItemView}
				></FlatList>
			)}

			<StatusBar style="auto" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	itemStyle: {
		padding: 15,
	},
	textInputStyle: {
		height: 50,
		borderWidth: 1,
		paddingLeft: 20,
		margin: 5,
		borderColor: '#009688',
		backgroundColor: 'white',
	},
	tinyLogo: {
		width: 50,
		height: 50,
	},
});

export default Search;
