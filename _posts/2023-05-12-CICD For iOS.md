---
title: iOS CI/CD
commentable: flase
Edit: 2023-05-12
mathjax: true
mermaid: true
tags: CI/CD Github
categories: swift
description: Setting up CI/CD for Mobile Apps with Github Actions, Fastlane, and App Testing Platforms
---

Continuous Integration and Continuous Deployment (CI/CD) has become an essential part of mobile app development. It helps to automate the entire mobile app development process, including building, testing, and deployment. Github Actions, Fastlane, and App testing platforms like Testflight and AppCenter, along with a self-hosted Github Action Runner, can help set up an effective CI/CD workflow for mobile app development.
In this article, we will go through the steps to set up a CI/CD workflow for mobile app development with Github Actions, Fastlane, and App Testing Platforms. These steps are designed to be an internal training resource for developers at Wiredcraft who are interested in setting up a CI/CD workflow for their mobile app projects.

## Part 1: Setting up CI for Mobile Apps

### Step 1: Setting up Github Actions for Android with Gradle
- Creating a new Github repository for the Android mobile app project
- Enabling Github Actions and creating a workflow YAML file
- Defining the jobs for building and testing the Android mobile app with Gradle, the example YAML file can be found at [TBD](TBD)

### Step 2: Setting up Github Actions for iOS with Fastlane
- Creating a new Github repository for the iOS mobile app project
- Enabling Github Actions and creating a workflow YAML file
- Defining the jobs for building and testing the iOS mobile app with Fastlane, the example YAML file can be found at [TBD](TBD)
 
## Part 2: Setting up CD for Mobile Apps

### Step 3: Integrating Fastlane with Github Actions for iOS CD
- Create a new YAML file for Distribution that contains Fastlane actions for iOS. Refer to [Manage Environments for Mobile Apps](TBD) for environment switching using Fastlane.
- Configuring Fastlane actions for deploying the iOS mobile app to Testflight. The example YAML file can be found at [TBD](TBD)
- Follow App Store Connect API Key to generate key for Uploading builds to Testflight
 
## Part 3: [OPTIONAL]Setting up a Self-Hosted Github Action Runner

### Step 5: Setting up a Self-Hosted Github Action Runner
This is only needed from a cost-saving perspective or if you see the GitHub provided machine doesn’t fits your needs for distributing iOS applications. You can refer to the official guideline for set-up a Self-Hosted Github Action Runner on your macOS machine.

## Conclusion
Setting up a CI/CD workflow for mobile app development with Github Actions, Fastlane, and App Testing Platforms can save time, improve app quality, and increase developer productivity. By following the steps outlined in this article, developers at Wiredcraft can set up an effective CI/CD workflow for their mobile app projects.
