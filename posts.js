const BASE_URL = "https://jsonplaceholder.typicode.com/posts";
const USER_ID = 1;

/**
 *
 * @param {Response} response
 * @returns {Promise}
 * @throws {Error} If API return a status code greater than 400 
 */
function handleJSONResponse(response) {
	if (response.ok) {
		return response.json();
	} else {
		throw new Error("Error HTTP al consultar API", {
			endpoint: response.url,
			httpCode: response.status,
		});
	}
}

export function getPosts() {
	return fetch(`${BASE_URL}?userId=${USER_ID}`).then(handleJSONResponse);
}

export function createPost(title, description) {
	return fetch(BASE_URL, {
		method: "POST",
		body: JSON.stringify({
			title: title,
			body: description,
			userId: USER_ID,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
		},
	}).then(handleJSONResponse);
}

export function updatePost(id, title, description) {
	return fetch(`${BASE_URL}/${id}`, {
		method: "PATCH",
		body: JSON.stringify({
			title: title,
			body: description,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
		},
	}).then(handleJSONResponse);
}

export function deletePost(id) {
	return fetch(`${BASE_URL}/${id}`, {
		method: "DELETE",
	}).then(handleJSONResponse);
}
