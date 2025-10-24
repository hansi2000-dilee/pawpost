# Pappiespaw - A Social Media Platform for Puppies

## Overview

Pappiespaw is a social media application dedicated to puppy lovers. It allows users to share pictures and posts about their puppies, interact with other users' posts, and build a community around their furry friends.

## Features

*   **User Authentication:**
    *   Users can sign up for a new account using their name, email, and password.
    *   Users can log in to their existing account.
*   **Posts:**
    *   Authenticated users can create new posts, including an image and a description.
    *   Users can view a feed of all posts.
*   **Interactions:**
    *   Users can "like" and "unlike" posts.
    *   Users can add comments to posts.

## Tech Stack

*   **Frontend:** React
*   **Routing:** React Router
*   **Styling:** Material-UI (MUI)
*   **Backend:** Firebase (Authentication, Firestore, Storage)

## Plan

1.  **Project Setup:**
    *   Install necessary packages: `react-router-dom`, `@mui/material`, `@emotion/react`, `@emotion/styled`, and `firebase`.
    *   Create a basic file structure with folders for `pages` and `components`.
2.  **Firebase Setup:**
    *   Create a Firebase project.
    *   Set up a `firebase.js` configuration file in the React app.
3.  **Authentication:**
    *   Create `LoginPage` and `SignUpPage` components.
    *   Implement sign-up and login functionality using Firebase Authentication.
4.  **Homepage and Navigation:**
    *   Create a `HomePage` to display posts.
    *   Create a navigation bar that shows different links based on whether the user is logged in.
5.  **Post Creation:**
    *   Create a component to allow users to upload an image and write a caption.
    *   Save post data to Firestore and the image to Firebase Storage.
6.  **Post Feed:**
    *   Fetch and display all posts from Firestore on the `HomePage`.
7.  **Like and Comment Functionality:**
    *   Implement the ability for users to like/unlike posts.
    *   Implement the ability for users to add comments to posts.
