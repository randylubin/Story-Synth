# Story Synth
## Realtime Storytelling App

This app is geared for designers of simple storytelling games who want to playtest online. The gist is that a designer can:

1. Create and edit content in a Google Sheet
2. Create a room in the app that links to that content
3. Share that link with players so that they can play in realtime without screen sharing

There are two styles of game available. The first is inspired by 'For the Queen' by Alex Roberts: players first read through several instructions and then answer randomly shuffled prompts. The other is timer based, inspired by Jason Morningstar's game 'Find / Fix / Finish': players received new information or prompts based on what role they are and how much time has elapsed.

[Demo of the app in action](https://story-synth.diegeticgames.com)

You can use the app as a starting point for more complex or polished games. Here's the final version of a game using the "monster" template: [Dawn of the Monster Invasion](https://monster.diegeticgames.com/#/)

# Getting the app working locally

The app uses Vue.js as it's main framework, with Bootstrap as a visual framework. Game content is loaded via Google Sheets and game state is shared among players via Firebase.

The app is designed to be serverless, so you can use Firebase Hosting or Github Pages to run it for free.

A quick overview of the most relevant libraries in use:
- [Vue.js](https://vuejs.org/) – the framework that runs the app, including routing and views
- [Firebase](https://firebase.google.com/) – the real time database that keeps data in sync among different users looking at the same page
- [VueFire](https://vuefire.vuejs.org/) – the binding between Vue and Firebase; it keeps the Firebase data in sync with the app data
- [Bootstrap](https://getbootstrap.com/) – the css framework that makes it easy to make the app look decent
- [BootstrapVue](https://bootstrap-vue.org/) – easy access to Bootstrap's js components such as modals and tooltips
- [Axios](https://www.npmjs.com/package/axios) – the http libary used to pull data from Google Sheets

## Project setup
Make sure you have [Node.js and npm](https://www.npmjs.com/get-npm) installed locally, then clone or download this project repo, navigate to the folder, and run:

```
npm install
```

Then set up a free Firebase project, which will give you an API key. You can follow steps one and two of [the offical guide](https://firebase.google.com/docs/web/setup#create-firebase-project)

Then, update the project with your Firebase credentials:

/src/firebase.js should have your project name and api key

### Compiles and hot-reloads for development
When you're testing the app on your machine, use:

```
npm run serve
```

and then go to localhost:8080 in your browser

### Compiles and minifies for production
When you're ready to save the app and share it online, run:

```
npm run build
```

### Firebase Hosting
If you're using Firebase hosting, you can push to their servers with:

```
firebase deploy --only hosting
```

In order to do this you'll have to follow more of the steps in the above mentioned [Firebase guide](https://firebase.google.com/docs/web/setup#create-firebase-project)

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
