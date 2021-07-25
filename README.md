# Story Synth

![Version 1.0.2](https://img.shields.io/badge/version-1.0.2-blue)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)

## Realtime Storytelling App

This app is geared for designers of simple storytelling games who want to playtest online. The gist is that a designer can:

1. Create and edit content in a Google Sheet
2. Create a room in the app that links to that content
3. Share that link with players so that they can play in realtime without screen sharing

[See the app live at storysynth.org](https://storysynth.org)

[Video tour of Story Synth in action](https://www.loom.com/share/93ccd693401b42f4a8ddfa4a209b2f48)

You can use the app as a starting point for more complex or polished games. Here's the final version of a game using the "monster" template: [Dawn of the Monster Invasion](https://monster.diegeticgames.com/#/)

Read more about the app at [About Story Synth](https://storysynth.org/about)

## Getting the app working locally

The app uses Vue.js as it's main framework, with Bootstrap as a visual framework. Game content is loaded via Google Sheets and game state is shared among players via Firebase.

The app is designed to be serverless, so you can use Firebase Hosting or Github Pages to run it for free.

A quick overview of the most relevant libraries in use:

- [Vue.js](https://vuejs.org/) – the framework that runs the app, including routing and views
- [Firebase](https://firebase.google.com/) – the real time database that keeps data in sync among different users looking at the same page
- [VueFire](https://vuefire.vuejs.org/) – the binding between Vue and Firebase; it keeps the Firebase data in sync with the app data
- [Bootstrap](https://getbootstrap.com/) – the css framework that makes it easy to make the app look decent
- [BootstrapVue](https://bootstrap-vue.org/) – easy access to Bootstrap's js components such as modals and tooltips
- [Axios](https://www.npmjs.com/package/axios) – the http libary used to pull data from Google Sheets

### Project setup

Make sure you have [Node.js and npm](https://www.npmjs.com/get-npm) installed locally, then clone or download this project repo, navigate to the folder, and run:

```
npm install
```

Then set up a free Firebase project, which will give you an API key. You can follow steps one and two of [the offical guide](https://firebase.google.com/docs/web/setup#create-firebase-project):

1. Create a new project
2. Register your app with firebase

Also – install the [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) tool if you haven't yet.

Some potentially non-obvious steps are:

- Set up both a "firestore database" and a "realtime database" via the Firebase console in order for a DatabaseURL to appear in your config
- Configure security rules for each database. Firestore needs read and write both set to "if request.auth != null;" while Realtime only needs read set to "true"

Then, update the project with your Firebase credentials by adding them to a new .env file in the root folder of Story Synth. You need to add your your firebase api key, database url and project ID, replacing TODO in the following:

```
VUE_APP_FIREBASE_API_KEY=TODO
VUE_APP_FIREBASE_DATABASE_URL=TODO
VUE_APP_FIREBASE_PROJECT_ID=TODO
```

Finally, you'll need enable the Google Sheets API for the same API Key. Do that by going to the [Google Cloud Platform Console – API Library – Google Sheets API](https://console.cloud.google.com/apis/api/sheets.googleapis.com/overview) and enable the API.

For analytics, you can optionally create a free [Mixpanel](https://mixpanel.com/) account and add your account ID in the main.js file.

### Run your app locally

When you're testing the app on your machine, use:

```
npm run serve
```

and then go to [localhost:8080](localhost:8080) in your browser

### Compiles and minifies for production hosting

When you're ready to save the app and share it online, run:

```
npm run build
```

This will efficently compile the app into the `/dist` folder.

### Firebase Hosting

If you're using Firebase's free hosting, you can push to their servers with:

```
firebase deploy --only hosting
```

You can build and deploy at the same time with:

```
npm run build && firebase deploy --only hosting
```

If you run into any issues, you may need to follow more of the steps in the above mentioned [Firebase guide](https://firebase.google.com/docs/web/setup#create-firebase-project).

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
