invoicer-fullstack
==================

Simple Invoicer app

Deploy:

1) run rhc setup to make sure openshift authorization token is valid and
everything is up to date.

2) After app modification run
	grunt build

3) Then deploy with
 Note: nedd to install (https://github.com/robwierzbowski/grunt-build-control)
	grunt buildcontrol:openshift


To restart the app in openshift use:
rhc app-restart -a my-openshift-app

If you have issues.. you might need to re-create the app with:
 yo angular-fullstack:openshift

Throubleshooting
Login to OpenShift and click on the ssh link for remote access.

Then run help for a list of command options..

A usefull one is:


Status:

Having issues with the calculation of group hours.
