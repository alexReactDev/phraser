import { Image, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../../query/user";
import { observer } from "mobx-react-lite";
import session from "../../../store/session";
import ErrorComponent from "../../../components/Errors/ErrorComponent";
import { borderColor, fontColor, fontColorFaint } from "../../../styles/variables";
import moment from "moment";
import Loader from "../../../components/Loader";

const UserInfo = observer(function () {
	const { data, error, loading } = useQuery(GET_USER, { variables: { id: session.data.userId }});

	const createdDate = moment(data?.getUser.created).format("D MMM YYYY");

	if(loading) return <Loader />

	if(error || !data) return <ErrorComponent message="Failed to load user data" />

	return (
		<View style={styles.container}>
			<View style={styles.picture}>
				<Image source={require("../../assets/user.png")} />
			</View>
			<View style={styles.data}>
				<Text style={styles.title}>
					{data?.getUser.name}
				</Text>
				<Text style={styles.text}>
					Login: {data?.getUser.login}
				</Text>
				<Text style={styles.text}>
					Joined: {data?.getUser.created && createdDate}
				</Text>
			</View>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		margin: 10,
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: borderColor,
		borderRadius: 5,
		backgroundColor: "#fefefe"
	},
	picture: {
		width: "30%",
		alignItems: "center",
		justifyContent: "center"
	},
	data: {
		width: "70%",
		padding: 10
	},
	title: {
		fontSize: 24,
		marginBottom: 4,
		color: fontColor
	},
	text: {
		marginBottom: 5,
		color: fontColorFaint,
		fontSize: 12
	}
});

export default UserInfo;