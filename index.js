const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const path = require('path');
const fetch = require('node-fetch');

const { mapAPI, api, port, geoAPI } = require('./config');

const csrfProtection = csrf({ cookie: true });
const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

// Create the express app
const app = express();

// Set the pug view engine
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
	res.locals.mapAPI = mapAPI;
	res.locals.api = api;
	res.locals.geoAPI = geoAPI;
	next();
});

// Defining the routes
app.get('/', async (req, res) => {
	res.render('index', { title: 'Home' });
});

app.get('/sign-up', (req, res) => {
	res.render('sign-up', { title: 'Sign Up' });
});

app.get('/log-in', (req, res) => {
	res.render('log-in', { title: 'Log In' });
});

app.get(
	'/businesses/new',
	csrfProtection,
	asyncHandler(async (req, res) => {
		const data = await fetch(`${api}businesses/tags`);
		const { categories } = await data.json();
		let business = {};
		res.render('new-business', {
			title: 'Add Business',
			categories,
			business,
			errors: [],
			csrfToken: req.csrfToken()
		});
	})
);

app.get(
	`/businesses/:id(\\d+)`,
	csrfProtection,
	asyncHandler(async (req, res) => {
		const fetchBusiness = await fetch(`${api}businesses/${req.params.id}`);
		const { business } = await fetchBusiness.json();
		let splitPhotos;
		if (business.photoContent) {
			splitPhotos = business.photoContent.split(',');
		}
		res.render('business', {
			title: business.name,
			business,
			photos: splitPhotos,
			csrfToken: req.csrfToken()
		});
	})
);

app.get(
	'/businesses/:id/write-a-review',
	csrfProtection,
	asyncHandler(async (req, res) => {
		const fetchBusiness = await fetch(`${api}businesses/${req.params.id}`);
		const { business } = await fetchBusiness.json();
		res.render('write-a-review', { title: 'Write a Review', business });
	})
);

app.get(
	'/businesses/reviews/:id(\\d+)/edit',
	csrfProtection,
	asyncHandler(async (req, res) => {
		const fetchBusiness = await fetch(`${api}reviews/${req.params.id}`);
		console.log(fetchBusiness);
		const { review } = await fetchBusiness.json();
		console.log(review);
		res.render('edit-review', { title: 'Edit Review', review });
	})
);

app.get('/search', (req, res) => {
	res.render('search', {
		title: 'Search',
		businesses: []
	});
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
