---
description: Simple Firebase authentication client for testing APIs and more.
github: https://github.com/bill-kerr/firebase-auth-client
previewImg: /img/firebase-auth-client-preview.webp
tags:
  - Firebase
  - Svelte
  - TypeScript
  - TailwindCSS
title: Firebase Authentication Client
web: https://auth-client.netlify.app
---

# Firebase Authentication Client

Firebase Authentication Client is a simple frontend that helps you login and get user and authentication details from Google's [Firebase](https://firebase.google.com) service.

After building multiple backend applications utilizing Firebase for authentication, it became apparent that I needed a way to easily get authentication tokens, evaluate custom claims, and other tasks that require a frontend Firebase client. To that end, I created this frontend client as a general purpose tool for anyone's use.

Visit the application at [https://auth-client.netlify.app](https://auth-client.netlify.app).

## How to use it

The authentication client allows users to input configuration data for a Firebase web client. In most cases, only the "apiKey" field is required. Once your Firebase configuration is successfully applied, a green check mark will appear causing the Login/Logout and Access Token tabs to become available.

In order to access user data, navigate to the Login/Logout tab and login as a registered user on your Firebase project. Once the login is successful, user data will be displayed, along with logout and clear session buttons.

The logout button simply logs out the current user and returns you to the login form. If "Logout & clear local session" is clicked, it will log the user out and clear any local session storage from the browser.

Once logged in, you may view the "Access Token" tab, which will contain the raw token value along with its decoded version, including any custom claims set by the application.

#### Preferences

Auto-Login - If this option is enabled, the authentication client will automatically log in any user for whom it detects a local session.

## How it's built

The frontend application is built with [Svelte](https://svelte.dev) and uses [TailwindCSS](https://tailwindcss.com) for styling.
