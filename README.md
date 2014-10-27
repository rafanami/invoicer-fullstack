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

##Setup MongoDB
If you're using Mac OSX, just need to do
```brew install mongo```

After the installation, you might need to define a data folder, and start mongodb like this:
```mkdir <path to the data folder>```
```mongod --dbpath=<path to the data folder>```

Open another terminal, to create the database of the application
```mongo```
```use invoicer-dev```

##Initial Setup
Run ```npm install --save-dev``` to create all the node dependencies.
After this, run ```bower install --save-dev``` to create all UI dependencies.
And lastly, run ```grunt serve``` to start the server.

##Throubleshooting

If you still have issues.. you might need to re-create the app with:
```yo angular-fullstack:openshift```


## Tasks:

# Task Panel
 -> Set the current workstream in the dropbox

# Workstream page

 -> Refresh Workstream page after changes (add task, change task)

 -> Display summary of hours at the top

 ->
