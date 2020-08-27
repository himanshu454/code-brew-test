# code-brew-test
## To build the project follow below steps:

-   Install NodeJS, if not installed (Require Node version >= 8.0.0)

```
    $ wget -qO- https://deb.nodesource.com/setup_10.x | bash -
    $ sudo apt-get install -y nodejs
```

-   Install npm, if not installed (Require NPM version >= 6.0.0)

```
    $ npm install
```


    Create .env file which should have these env variable [API_KEY].

-   To run the application with default settings

```
    $ npm start
```

-   Start with PM2

```
    $ pm2 start ./index.js --name 'fuel-booking-module'
```

-   Postman Collection

```
-   $ https://www.getpostman.com/collections/b2ac5fefd60cca9e4549

```
