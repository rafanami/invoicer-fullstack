invoicer-fullstack
==================

#Simple Invoicer app

##Deploy:

1) run ``` rhc setup ``` to make sure openshift authorization token is valid and
everything is up to date.

2) After app modification run
```grunt deploy```

it will build and deploy the app to openshit using grunt-build-control (https://github.com/robwierzbowski/grunt-build-control)


To restart the app in openshift use:
```rhc app-restart -a invoicer```

##OpenShift
Login to OpenShift and copy on the ssh link for remote access.

Then run help for a list of command options..

A usefull one is:
```tail_all``` to see all logs files

Usefull link with console commands: https://developers.openshift.com/en/managing-remote-connection.html

##Setup Google Authentication
Check what enviroment variable are configured:
```rhc env list invoicer```
Add Google parameters:
```rhc env set GOOGLE_ID=<Google's CLIENT ID> -a <you openshift app name>```
```rhc env set GOOGLE_SECRET=<Google's CLIENT SECRET> -a <you openshift app name>```
```rhc env set DOMAIN=<openshift app url> -a <you openshift app name>```

##Throubleshooting

If you still have issues.. you might need to re-create the app with:
```yo angular-fullstack:openshift```


## Status:

Having issues with the calculation of group hours.
