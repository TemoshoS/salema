<div align="center">
  <h3 align="center">Salema App</h3>

  <p align="center">
      Salema is a mobile application designed to provide users with a reliable means of summoning help in emergency situations.
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Salema is an innovative mobile application designed to provide users with a reliable and swift means of summoning help in emergency situations. By combining intuitive features such as shake-to-alert functionalities, the system eliminates the need for a login process, ensuring that users can initiate distress signals without any delay. The application allows users to designate up to five emergency contacts, who receive immediate notifications along with the user's real-time GPS location when an emergency alert is triggered. Simultaneously, the system notifies the nearest security services to expedite response times. With a focus on user-friendliness, security, and rapid emergency response, this project seeks to empower individuals and enhance overall personal safety in an increasingly dynamic world.

The Salema app include the following key features:
Add Up to 5 Emergency Contacts: Users can easily designate up to five trusted contacts to be notified in the event of an emergency.
Shake-to-Alert: A unique and intuitive feature where users can simply shake their phones to trigger an emergency alert. This ensures a quick and discreet way to call for help.
No Login Requirement: During emergency situations, time is of the essence. The system eliminates the need for login, enabling users to send distress signals swiftly without any impediments.
GPS Location Sharing: The system will automatically include the user's current GPS coordinates in the alert, aiding emergency responders in locating the user quickly.


### Built With


* [Firebase](https://firebase.google.com)
* [React Native Expo](https://docs.expo.dev)
* [API SMS Portal](https://www.twilio.com/docs/
  
## Getting Started

This are step guide to run the project locally.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a SMS API Key at (https://www.twilio.com)
2. Installing
   ```sh
   npm install -g expo-cli
   ```
3. Clone the repo
   ```sh
   git clone https://github.com/TemoshoS/salema.git
   ```
4. Navigate to project 
   ```sh
   cd salema
   ```
5. Install NPM packages
   ```sh
   npm install
   ```
6. Enter your API in `shakeTrigger.js` 
   ```js
    const API_KEY = 'ENTER YOUR API';
    const authorizationToken = 'App -API_KEY';
   ```
7. Run poject locally
    ```sh
   npx expo start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
