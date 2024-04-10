export default {
	"expo": {
	  "name": "vocabulary",
	  "slug": "vocabulary",
	  "version": "1.0.0",
	  "scheme": "com.alexreactdev.vocabulary",
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
		  "projectId": "88bf46ea-bb07-401a-9956-a56f5f943cba"
		}
	  },
	  "android": {
		"package": "com.alexreactdev.vocabulary",
		"googleServicesFile": process.env.GOOGLE_SERVICES_JSON
	  }
	}
  }
  