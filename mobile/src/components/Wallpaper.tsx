import settings from "@store/settings";
import { observer } from "mobx-react-lite";
import { ImageBackground, View  } from "react-native";


const Wallpaper = observer(function ({ children }: { children: React.ReactNode }) {
	const wallpaper = settings.settings.wallpaper;

	//There is component for every wallpaper, because require() doesn't accept variables

	return (
		<>
			{
				wallpaper === "1"
				?
				<ImageBackground
					source={require("@assets/wallpapers/1.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				wallpaper === "2"
				?
				<ImageBackground
					source={require("@assets/wallpapers/2.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				wallpaper === "3"
				?
				<ImageBackground
					source={require("@assets/wallpapers/3.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				wallpaper === "4"
				?
				<ImageBackground
					source={require("@assets/wallpapers/4.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				wallpaper === "5"
				?
				<ImageBackground
					source={require("@assets/wallpapers/5.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				wallpaper === "6"
				?
				<ImageBackground
					source={require("@assets/wallpapers/6.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				wallpaper === "7"
				?
				<ImageBackground
					source={require("@assets/wallpapers/7.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				wallpaper === "8"
				?
				<ImageBackground
					source={require("@assets/wallpapers/8.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				wallpaper === "9"
				?
				<ImageBackground
					source={require("@assets/wallpapers/9.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				wallpaper === "10"
				?
				<ImageBackground
					source={require("@assets/wallpapers/10.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
				:
				<ImageBackground
					source={require("@assets/wallpapers/0.jpg")}
					resizeMode="cover"
					style={{
						width: "100%",
						height: "100%"
					}}
				>
					{children}
				</ImageBackground>
			}
		</>
	)
}
)
export default Wallpaper;