# Project Blueprint

## Overview

Pappiespaw is a social media application for puppy lovers. It allows users to create accounts, share posts about their pets, and interact with a community of fellow puppy enthusiasts.

## Implemented Features

*   **User Authentication:** Users can sign up, log in, and log out using Firebase Authentication.
*   **Profile Management:** Users can view and update their profile information, including their display name and profile picture.
*   **Post Creation and Viewing:** Users can create new posts with text and images, and view a feed of all posts from all users.
*   **Commenting:** Users can add comments to posts.
*   **Basic UI:** The application has a basic user interface with a sidebar for navigation and a main content area to display pages and components.

## Current Styles and Design

*   **Component Library:** Material-UI (MUI) is used for UI components.
*   **Color Scheme:** A pink-based color scheme is used throughout the application.
*   **Typography:** The "Poppins" font is used as the primary font.
*   **Layout:** The application uses a responsive layout with a sidebar for navigation on larger screens.

## Plan for Current Request

The user is experiencing a "Dangerous site" warning from Google, which is likely due to the application's simple landing page and immediate redirect to a login form being flagged as a potential phishing attempt. The plan is to address this by making the application's entry point for unauthenticated users more informative and transparent.

**The next steps are:**

1.  **Consolidate `WelcomePage` and `LoginPage`:** Merge the welcoming aspect of the `WelcomePage` directly into the `LoginPage` to create a more descriptive and welcoming landing page.
2.  **Update routing in `App.jsx`:** Make the `LoginPage` the default route for unauthenticated users.
3.  **Remove `WelcomePage.jsx` and `SimpleNavbar.jsx`:** Delete the redundant `WelcomePage.jsx` and `SimpleNavbar.jsx` files to simplify the project structure.
