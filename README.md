# BLMIS

php artisan syncdb:public
php artisan syncdb:private

## Getting Started

Clone the project repository by running the command below if you use SSH

```bash
git clone https://github.com/shahnoman4/BLMIS.git
```

If you use https, use this instead

```bash
git clone https://github.com/shahnoman4/BLMIS.git
```

After cloning, run:

```bash
composer install
```

```bash
npm install
```

```bash
npm run dev
```

`OR`

```bash
npm run prod
```


Duplicate `.env.example` and rename it `.env`

Then run:

```bash
php artisan key:generate
```

### Prerequisites

Be sure to fill in your database details in your `.env` file before running the db scripts:

Excecute db scripts 

```bash
php artisan migrate
```

Create Super Admin user

```bash
 php artisan make:super-admin
```


Run a service worker in background to listen for queued tasks (emails & notifications will be dispatched asynchronous)

```bash
php artisan queue:listen
```


And finally, start the application:

```bash
php artisan serve
```

and visit [http://localhost:8000](http://localhost:8000) to see the application in action.

## Built With

* [Laravel](https://laravel.com) - The PHP Framework For Web Artisans
* [React](https://reactjs.org) - A JavaScript library for building user interfaces
