import { Image, StyleSheet, Text, View } from "react-native";
import SettingsGroup from "./SettingsGroup";
import { TouchableOpacity } from "react-native";
import { borderColor, fontColor } from "@styles/variables";
import { observer } from "mobx-react-lite";
import settings from "@store/settings";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation } from "@apollo/client";
import { GET_USER_SETTING, UPDATE_USER_SETTINGS } from "@query/settings";
import loadingSpinner from "@store/loadingSpinner";
import errorMessage from "@store/toastMessage";
import session from "@store/session";

const AppearanceSettings = observer(function () {
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);

	async function selectWallpapers(selected: string) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { wallpaper: selected }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		loadingSpinner.dismissLoading();
	}

	return (
		<SettingsGroup title="Appearance">
			<View style={styles.wallpapersCardsContainer}>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("none")}
				>
					{
						settings.settings.wallpaper === "none" &&
						<View style={styles.wallpapersSelected}>
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Text style={styles.placeholderText}>
						None
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("1")}
				>
					{
						settings.settings.wallpaper === "1" &&
						<View style={styles.wallpapersSelected}>
							<View style={styles.wallpapersSelectedBackground} />
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image resizeMode="cover" source={require("@assets/wallpapers/1.jpg")} style={styles.image} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("2")}
				>
					{
						settings.settings.wallpaper === "2" &&
						<View style={styles.wallpapersSelected}>
							<View style={styles.wallpapersSelectedBackground} />
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image source={require("@assets/wallpapers/2.jpg")} style={styles.image} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("3")}
				>
					{
						settings.settings.wallpaper === "3" &&
						<View style={styles.wallpapersSelected}>
							<View style={styles.wallpapersSelectedBackground} />
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image source={require("@assets/wallpapers/3-mini.jpg")} style={styles.image} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("4")}
				>
					{
						settings.settings.wallpaper === "4" &&
						<View style={styles.wallpapersSelected}>
							<View style={styles.wallpapersSelectedBackground} />
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image source={require("@assets/wallpapers/4.jpg")} style={styles.image} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("5")}
				>
					{
						settings.settings.wallpaper === "5" &&
						<View style={styles.wallpapersSelected}>
							<View style={styles.wallpapersSelectedBackground} />
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image source={require("@assets/wallpapers/5.jpg")} style={styles.image} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("6")}
				>
					{
						settings.settings.wallpaper === "6" &&
						<View style={styles.wallpapersSelected}>
							<View style={styles.wallpapersSelectedBackground} />
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image source={require("@assets/wallpapers/6.jpg")} style={styles.image} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("7")}
				>
					{
						settings.settings.wallpaper === "7" &&
						<View style={styles.wallpapersSelected}>
							<View style={styles.wallpapersSelectedBackground} />
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image source={require("@assets/wallpapers/7.jpg")} style={styles.image} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("8")}
				>
					{
						settings.settings.wallpaper === "8" &&
						<View style={styles.wallpapersSelected}>
							<View style={styles.wallpapersSelectedBackground} />
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image source={require("@assets/wallpapers/8.jpg")} style={styles.image} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("9")}
				>
					{
						settings.settings.wallpaper === "9" &&
						<View style={styles.wallpapersSelected}>
							<View style={styles.wallpapersSelectedBackground} />
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image source={require("@assets/wallpapers/9.jpg")} style={styles.image} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.wallpapersCard}
					activeOpacity={0.8}
					onPress={() => selectWallpapers("10")}
				>
					{
						settings.settings.wallpaper === "10" &&
						<View style={styles.wallpapersSelected}>
							<Ionicons name="checkmark-circle" size={20} color="green" />
						</View>
					}
					<Image source={require("@assets/wallpapers/10-mini.jpg")} style={styles.image} />
				</TouchableOpacity>
				<View style={{...styles.wallpapersCard, backgroundColor: "transparent", borderWidth: 0 }} />
			</View>
		</SettingsGroup>
	)
})

const styles = StyleSheet.create({
	wallpapersCardsContainer: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
		rowGap: 10
	},
	wallpapersCard: {
		position: "relative",
		width: 100,
		height: 100,
		borderRadius: 15,
		borderWidth: 1,
		borderColor: borderColor,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		backgroundColor: "#eee"
	},
	wallpapersSelected: {
		position: "absolute",
		width: 20,
		height: 20,
		top: 5,
		right: 5,
		zIndex: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	wallpapersSelectedBackground: {
		position: "absolute",
		width: 10,
		height: 10,
		backgroundColor: "#eee",
		borderRadius: 50,
		zIndex: -1
	},
	image: {
		width: 100,
		height: 100
	},
	placeholderText: {
		color: fontColor
	}
})

export default AppearanceSettings;