# Jitsi Meet apps for Android and iOS

Jitsi Meet can also be built as a standalone app for Android or iOS. It uses the
[React Native] framework.

**NOTE**: This document assumes the app is being built on a macOS system.

## 1) First make sure the [React Native dependencies] are installed.

## 2) Install nvm and Node (make sure to do this step BEFORE running 'npm install'. If your machine's node version is different than we recommend, you may get errors)

  We recommend you use nvm. With it, you can easily manage different node versions on the same machine.

  - To install nvm, you can use the install script using cURL:

  ```bash
  $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
  ```

  - If you are also working on Synzi 2.x web apps, you should take note of the current version of node you have running BEFORE installing as you will need it in step 3 below.
  ```
  node --version
  ```

  - Use nvm to install Node. 
  
  ```
  $ nvm install 6.14.2
  ```

  - OR, if you want to install Node w/ nvm AND migrate npm packages from a previous Node version:

  ```
  $ nvm install 6.14.2 --reinstall-packages-from=${OLD_NODE_VERSION}
  ```

## 3) .nvmrc

 A .nvmrc file is included in this project's root directory. We will make it so that upon changing into this project's root directory, your machine will automatically switch to Node version 6.14.2

 Place the following code in your ~/.bashrc or ~/.bash_profile:

  ```
  # Run 'nvm use' automatically every time there's 
  # a .nvmrc file in the directory. Also, revert to default 
  # version when entering a directory without .nvmrc

  enter_directory() {
    if [[ $PWD == $PREV_PWD ]]; then
      return
    fi

  PREV_PWD=$PWD
    if [[ -f ".nvmrc" ]]; then
      nvm use
    fi
  }

  export PROMPT_COMMAND=enter_directory
  ```

  - If you are also working on Synzi 2.x web apps, you will need to set the default back to the noted version of node (from step 2 above). For example
  ```
  nvm alias default 10.8.0
  ```

  - Shut down and reopen terminal, and cd into project's root directory. You should see the following output:

  ```
  $ Found '/Users/Johnny/Desktop/synzi2-jisti-meet-sandbox/.nvmrc' with version <6.14.2>. Now using node v6.14.2 (npm v3.10.10)
  ```

  - If you don't see this, delete the code from ~/.bash_profile, and try ~/.bashrc or ~/.zshrc.

  - Confirm you are using Node version 6.14.2 before moving ahead:
  ```
  node --version
  ```

## 4) iOS

1. Install some extra dependencies

  - Install ios-deploy globally (in case you want to use the React Native CLI
    to deploy the app to the device)

    ```bash
    npm install -g ios-deploy
    ```

    You may need to add ```--unsafe-perm=true``` if you are running on [Mac OS 10.11 or greater](https://github.com/phonegap/ios-deploy#os-x-1011-el-capitan-or-greater).

  - Install main dependencies:

    ```bash
    npm install
    ```

  - Install the required pods (CocoaPods must be installled first, it can
    be done with Homebrew: `brew install cocoapods`)

    ```bash
    cd ios
    pod install
    pod update
    ```

    **Note, you may get errors related to CocoaPods. It could look like the following:

    ```
    [!] Failed to connect to GitHub to update the CocoaPods/Specs specs repo - Please check if you are offline, or that GitHub is down
    ```
    
  - If you get no errors, move to step 2 (Build the app). Else, follow the steps below:

  - To solve this, we are going to have to update openssl, then ruby, then CocoaPod

  ```
  $ which openssl
  /usr/bin/openssl

  $ openssl version
  OpenSSL 0.9.8zh 14 Jan 2016

  $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

  $ brew update

  $ brew install openssl

  $ brew upgrade openssl

  If you need to have this software first in your PATH run: echo 'export PATH="/usr/local/opt/openssl/bin:$PATH"' >> ~/.bash_profile

  $ echo 'export PATH="/usr/local/opt/openssl/bin:$PATH"' >> ~/.bash_profile
  $ source ~/.bash_profile

  $ which openssl
  /usr/local/opt/openssl/bin/openssl

  $ openssl version
  OpenSSL 1.0.2n  7 Dec 2017

  $ brew install rbenv ruby-build

  $ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
  $ echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.bash_profile
  $ source ~/.bash_profile

  $ rbenv install --list

  Available versions:
    1.8.5-p52
    1.8.5-p113
    1.8.5-p114
    1.8.5-p115  
    1.8.5-p231
    1.8.6
  :
    2.5.0-rc1
    2.5.0
    2.5.1
    2.6.0-dev
  :

  $ rbenv install 2.5.1

  $ rbenv versions
  * system (set by /Users/username/.rbenv/version)
  2.5.1

  $ ruby --version
  ruby 2.0.0p648 (2015-12-16 revision 53162) [universal.x86_64-darwin16]

  $ rbenv global 2.5.1

  $ rbenv versions
    system
  * 2.5.1 (set by /Users/username/.rbenv/version)

  $ ruby --version
  ruby 2.5.1p57 (2018-03-29 revision 63029) [x86_64-darwin16]

  $ gem install cocoapods -n /usr/local/bin

  $ which pod
  /usr/local/bin/pod

  $ pod --version
  1.5.3
  ```

  - Once you have followed these steps run "pod update" again in the root/ios directory. If no errors, move ahead!
  



2. Build the app

    There are 2 ways to build the app: using the CLI or using Xcode.

    Using the CLI:

    ```bash
    react-native run-ios --device
    ```

    OR, use the built in scripts in package.json to run the app:

    iOS:
    ```bash
    Care-Connect: npm run cc-ios OR Virtual-Care: npm run vc-ios
    ```
    Android:
    ```bash
    Care-Connect: npm run cc-android OR Virtual-Care: npm run vc-android
    ```

    When the app is launched from the CLI the output can be checked with the
    following command:

    ```bash
    react-native log-ios
    ```

    Using Xcode

    - Open **ios/jitsi-meet.xcworkspace** in Xcode. Make sure it's the workspace
      file!

    - Select your device from the top bar and hit the "play" button.

    When the app is launched from Xcode the Debug console will show the output
    logs the application creates.


3. Other remarks

    It's likely you'll need to change the bundle ID for deploying to a device
    because the default bundle ID points to the application signed by Atlassian.

    This can be changed in the "General" tab.  Under "Identity" set
    "Bundle Identifier" to a different value, and adjust the "Team" in the
    "Signing" section to match your own.


## Android

The [React Native dependencies] page has very detailed information on how to
setup [Android Studio] and the required components for getting the necessary
build environment.  Make sure you follow it closely.

1. Old way: Building the app

    The app can be built using the CLI utility as follows:

    ```bash
    react-native run-android
    ```

    It will be installed on the connected Android device. Because we have 2 apps, it may not launch.

2. Better way: You can launch a specific app using a script we added to the package.

    ```bash
    # Virtual Care
    npm run vc-android

    # Care Connect
    npm run cc-android
    ```

    If you have other versions (release, for example) installed on that device, you may need to uninstall the app before running the associated command. Error message looks something like this

    ```
    FAILURE: Build failed with an exception.

    * What went wrong:
    Execution failed for task ':careconnect:installDebug'.
    > com.android.builder.testing.api.DeviceException: com.android.ddmlib.InstallException: 
    INSTALL_FAILED_UPDATE_INCOMPATIBLE: Package com.synzi.careconnect signatures do not match the 
    previously installed version; ignoring!

    ```

## Debugging

The official documentation on [debugging] is quite extensive and specifies the
preferred method for debugging.

**NOTE**: When using Chrome Developer Tools for debugging the JavaScript source
code is being interpreted by Chrome's V8 engine, instead of JSCore which React
Native uses. It's important to keep this in mind due to potential differences in
supported JavaScript features.

[Android Studio]: https://developer.android.com/studio/index.html
[debugging]: https://facebook.github.io/react-native/docs/debugging.html
[React Native]: https://facebook.github.io/react-native/
[React Native dependencies]: https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies


# Release Builds

## Android 

Open up the app in Android Studio (only the "android" folder in your react-native root directory):

1) Increment the "versionCode" by 1 in "build.gradle" file, and hit 'save'.


<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/1.png" width="400">


2) Bundle the js files:
  Open terminal and navigate to the root directory of your app. Run the following command:

    ```bash
    # Virtual Care
    npm run vc-build-release

    # Care Connect
    npm run cc-build-release

    # These are app-specific shortcuts for a command like this
    # react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
    ```

  - This step will take about 5 mins to complete.

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/2.png" width="800">

3) Back in Android Studio, at the top of the screen go to "Build" > "Generate Signed Bundle / APK..."


<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/3.png" width="800">


A) A popup window will appear. Click the "Android App Bundle" radio button > "Next"

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/4.png" width="800">

B) In the next window, choose your app in the "module" dropdown list (VC uses "app", CC uses "careconnect"):

  1. If you don\'t currently have an "Android Key", import it from the synzi-meet repo. Import it by clicking "Choose Existing..."

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/5.png" width="800">

  - Navigate to synzi-meet repo > "Certs" > "Android" > "Android_Key_4". Choose it, and click "Open" 

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/6.png" width="600">

  * If you imported the key from the repo, you will also have to create a new key alias. Click the three elipses (...) across from Key Alias. It will automatically fill in the key alias for you. All you need to do is click "OK".

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/6-2.png" width="600">

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/6-3.png" width="600">

  2. Back in the "Generate Signed Bundle or APK" window, click "Next"

  3. In the next window, make sure "Build Type" is set to "Release" on the drop-down list. Click "Finish".

  - Once you click finish, it will take about 5 mins for the App Bundle to finish being created.

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/7.png" width="800">
      
  - When finished, a window in the bottom right corner of the screen will have a link to locate the file. Click it, and take note of the path of the App Bundle file.

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/8.png" width="600">

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/9.png" width="600">


4) Upload the App Bundle to Synzi's "Google Play Console". 

  A) Navigate your browser to "https://play.google.com/apps/publish/?account=6526489369478226809#AppListPlace". If you don't have access to Synzi\'s Google Play Console, ask a manager to give you access.
    
  1. On this page you will see a list of Synzi\'s apps. Click on the app you want to upload the release build for.


<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/10.png" width="800">

  2. On the next page, on the left-hand side of the page, click "Release Management" > "App Releases"


<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/11.png" width="800">


B) Find out which "track" you should upload the release to, and click "manage". For the purpose of these instructions, we\'ll upload to the "Internal Test Track".


<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/12.png" width="800">


C) On the next screen, click "Create Release"

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/13.png" width="800">


D) On the next screen, we\'ll be uploading the App Bundle to Google Play. Under the subheading "Android App Bundles and APKs to add", click "Browse Files". Navigate to the directory where your App Bundle was created, click it, and click "Open".


<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/14.png" width="800">

1. The apk will validate. Make sure the version code matches the version you updated it to.


<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/15.png" width="800">
  

2. Continue down the page. Fill in "Release Name" and "What\'s New In This Release" with the JIRA ticket numbers you've added since the last release build. Then click "Save" then "Review".


<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/16.png" width="800">


E) Finally, review everything to make sure it looks correct, and click "Start Rollout To Internal Test" at the bottom of the page. That's it!


<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/Android/17.png" width="800">


## iOS

Open up the app\'s Xcode file

1) Click on your apps target, click the "General" tab, and Increment the "Build" number by 1

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/1.png" width="700">

2) On top left of Xcode, in the device pull down, select "Generic iOS Device"

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/2.png" width="700">

3) At the top of Xcode, choose "Product" > "Archive". This will take about 5 minutes to complete.

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/3.png" width="700">

4) When Xcode finishes archiving, it will open a new window with a list of archives.
  
  - Choose the new archive, and click "Distrubute App". 

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/4.png" width="700">

5) Click the "iOS App Store" radio button and click "Next"

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/5.png" width="700">

6) Click the "Upload" radio button and click "Next"

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/6.png" width="700">

7) On the next screen, check both checkboxes and click "Next

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/7.png" width="700">

8) On the next screen, click the "Automatically Manage Signing" radio button and click "Next"

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/8.png" width="700">

9) The next part will take a minute or so. Type in your admin password when it asks for it. Finally, a button that says "Upload" will appear. Press it.

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/9.png" width="700">

10) It will begin to upload. This will take about 5 minutes.

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/10.png" width="700">

11) Finally, it will finish uploading. Click "Done", and that's it!

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/11.png" width="700">


# ARNS for AWS

When configuring the ARNs in the AWS panel, it is important to export the certificate from the keychain without explicitly clicking on the cert and key.

<img src="https://github.com/SYNZI/synzi2-jisti-meet-sandbox/blob/develop/doc/build_images/iOS/12.png" width="669">
