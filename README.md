# spring-react-boilerplate

[![CircleCI](https://circleci.com/gh/pram/spring-react-boilerplate.svg?style=svg)](https://circleci.com/gh/pram/spring-react-boilerplate) [![Coverage Status](https://coveralls.io/repos/github/pram/spring-react-boilerplate/badge.svg?branch=master)](https://coveralls.io/github/pram/spring-react-boilerplate?branch=master)

Boilerplate application to demonstrate how to wire up Spring, JWT Authentication, React, Redux and Websockets.

## Local Development

Install [Maven](https://maven.apache.org/) and [Yarn](https://yarnpkg.com)

Start `com.naughtyzombie.boilerplate.springreactboilerplate.SpringReactBoilerplateApplication` in your IDE

Then start the front end

    cd src/main/app
    yarn start
    
The front end will start on [port 3000](http://localhost:3000).

## Running locally

To build and run locally

    mvn spring-boot:run
    
You can now access the app on [port 8080](http://localhost:8080)

## Build deployable package

To build a deployable artifact

    mvn package
    
The self contained jar will be created in `${project.basedir}/target`

To run the app

    java -jar target/spring-react-boilerplate-0.0.1-SNAPSHOT.jar
    
You can now access the app on [port 8080](http://localhost:8080)    

## User details

    admin/admin
    user/password

