import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface IProps {
	placeholder?: string,
	initialState: string,
	onChange: (query: string) => void
}

function Search({ onChange, initialState, placeholder = "Search..." }: IProps) {
	const [ query, setQuery ] = useState(initialState);

	useEffect(() => {
		const timeout = setTimeout(() => onChange(query), 600);
		return () => clearTimeout(timeout);
	}, [query]);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.iconContainer}
				activeOpacity={0.8}
				onPress={() => onChange(query)}
			>
				<Ionicons name="search" size={20} color="grey" />
			</TouchableOpacity>
			<TextInput
				style={styles.input}
				value={query}
				onChangeText={setQuery}
				onSubmitEditing={() => onChange(query)}
				placeholder={placeholder}
				placeholderTextColor="grey"
				inputMode="search"
				enterKeyHint="search"
				autoCapitalize="none"
				autoComplete="off"
				autoCorrect={false}
			></TextInput>
			{
				query &&
				<TouchableOpacity
					style={styles.crossContainer}
					activeOpacity={0.8}
					onPress={() => setQuery("")}
				>
					<Ionicons name="close-outline" size={24} color="grey" />
				</TouchableOpacity>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		marginBottom: 8,
		paddingHorizontal: 8
	},
	iconContainer: {
		position: "absolute",
		zIndex: 1,
		left: 5,
		top: 8
	},
	input: {
		borderBottomWidth: 1,
		borderBottomColor: "grey",
		paddingVertical: 4,
		paddingHorizontal: 24
	},
	crossContainer: {
		position: "absolute",
		zIndex: 1,
		top: 7,
		right: 5
	}
});

export default Search;