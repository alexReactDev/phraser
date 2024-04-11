export default {
	"expo": {
	  "name": "Phraser",
	  "slug": "phraser",
	  "version": "1.0.0",
	  "scheme": "com.alexreactdev.phraser",
	  "orientation": "portrait",
	  "icon": "./assets/icon.png",
	  "userInterfaceStyle": "light",
	  "splash": {
		"image": "./assets/splash.png",
		"resizeMode": "contain",
		"backgroundColor": "#ffffff"
	  },
	  "assetBundlePatterns": [
		"**/*"
	  ],
	  "ios": {
		"supportsTablet": true
	  },
	  "extra": {
		"eas": {
			"projectId": "f5e88cd4-a385-47cd-b2ae-9ede5a6d171d"
		}
	  },
	  "android": {
		"package": "com.alexreactdev.phraser",
		"googleServicesFile": process.env.GOOGLE_SERVICES_JSON
	  }
	}
  }
  