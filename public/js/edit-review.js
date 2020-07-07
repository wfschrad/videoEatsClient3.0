import { handleErrors, api } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
	if (!localStorage.getItem('VIDEO_EATS_ACCESS_TOKEN')) {
		window.location.href = '/log-in';
		return;
	}
});
