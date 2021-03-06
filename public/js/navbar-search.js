import { handleErrors, api, addMarkers } from './utils.js';

document.addEventListener('DOMContentLoaded', async (e) => {
	// NavBar Selectors
	const navbarSearchForm = document.querySelector('.navbar-search');
	const dropDown = document.querySelector('.dropdown');
	const dropDownToggle = document.querySelector('.dropdown-toggle');
	const dropDownMenu = document.querySelector('.dropdown-menu');
	const dropDownName = document.getElementById('item-name');
	const dropDownLocation = document.getElementById('item-location');
	const dropDownTag = document.getElementById('item-tag');
	const searchField = document.querySelector('.searchField');
	const collapseButton = document.querySelector('.navbar-collapse');
	const categorySearch = document.getElementById('category-tags');
	let tagValue;

	dropDown.addEventListener('click', (e) => {
		e.stopPropagation();
		dropDownMenu.classList.toggle('show');
	});

	document.addEventListener('click', () => {
		dropDownMenu.classList.remove('show');
	});

	collapseButton.addEventListener('click', () => {
		// TODO: show collapsed elements when clicking button
		collapseButton.classList.toggle('show');
	});

	dropDownMenu.addEventListener('click', async (event) => {
		// help me dry up this code please
		if (event.target === dropDownName) {
			dropDownToggle.innerHTML = 'Search by: ' + dropDownName.innerHTML;
			searchField.placeholder = '< ' + dropDownName.innerHTML + ' >';

			// when the dropdown for name is selected, hide the category dropdown and display the text search and set the search tag key in session storage to null
			searchField.classList.remove('hidden');
			categorySearch.classList.add('hidden');
			sessionStorage.removeItem('SEARCH_TAG');
		} else if (event.target === dropDownLocation) {
			dropDownToggle.innerHTML = 'Search by: ' + dropDownLocation.innerHTML;
			searchField.placeholder = dropDownLocation.innerHTML;
		} else {
			dropDownToggle.innerHTML = 'Search by: ' + dropDownTag.innerHTML;

			// when the dropdown for tag is selected, hide the text search and display the category dropdown and set the search value to null
			searchField.classList.add('hidden');
			categorySearch.classList.remove('hidden');
			document.getElementById('navbarSearch').value = '';
			sessionStorage.removeItem('SEARCH_VALUE');

			categorySearch.addEventListener('change', (event) => {
				tagValue = event.target.value;
				sessionStorage.setItem('SEARCH_TAG', tagValue);
			});
		}
	});

	// fetch the tags and create dropdown of tags in navbar
	try {
		const res = await fetch(`${api}businesses/tags`);
		const { categories } = await res.json();
		categories.forEach((category) => {
			const createOption = document.createElement('option');
			createOption.setAttribute('class', 'category-item');
			createOption.setAttribute('id', `category-${category.id}`);
			createOption.innerHTML = category.type;
			categorySearch.appendChild(createOption);
		});
	} catch (err) {
		handleErrors(err);
	}
	categorySearch.addEventListener('change', (event) => {
		tagValue = event.target.value;
		sessionStorage.setItem('SEARCH_TAG', tagValue);
	});

	// set up the event listener for the submit button
	navbarSearchForm.addEventListener('submit', async (e) => {
		// Prevent the default behavior of the submit button
		e.preventDefault();
		const searchValue = document.getElementById('navbarSearch').value;
		sessionStorage.setItem('SEARCH_VALUE', searchValue);

		window.location.href = '/search';
	});
});
