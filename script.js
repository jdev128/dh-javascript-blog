import { getPosts, createPost, updatePost, deletePost } from "./posts.js";

const POSTS_LIST = document.querySelector("#previous-posts ul");

const ADD_FORM = document.forms["new-post"];
const TO_ADD_TITLE = ADD_FORM.querySelector("input[id='title']");
const TO_ADD_DESCRIPTION = ADD_FORM.querySelector("textarea[id='description']");

const EDIT_MODAL = document.querySelector(`dialog[id='edit-post']`);
const DIALOG_CLOSER = EDIT_MODAL.querySelector("button[id='dialog-closer']");
const CANCEL_BUTTON = EDIT_MODAL.querySelector("button[type='reset']");

const EDIT_FORM = EDIT_MODAL.querySelector("form");
const TO_EDIT_ID = EDIT_MODAL.querySelector("input[id='edited-id']");
const TO_EDIT_TITLE = EDIT_MODAL.querySelector("input[id='edited-title']");
const TO_EDIT_DESCRIPTION = EDIT_MODAL.querySelector(
	"textarea[id='edited-description']"
);

let INTERACTED_POST;

function updateInteractedPost(event) {
	INTERACTED_POST = event.target.closest("li[id]");
}

function renderPost(id, title, description) {
	const NEW_POST = document.createElement("li");
	NEW_POST.id = id;

	NEW_POST.innerHTML = `
    <article class="post">
        <section class="data">
            <p class="title">${title}</p>
            <p class="content">${description}</p>
        </section>
        <section class="actions">
        </section>
    </article>`;

	const EDIT_BUTTON = document.createElement("button");
	EDIT_BUTTON.innerHTML = "<i class='bx bxs-pencil'></i>";
	EDIT_BUTTON.classList.add("secondary-button");
	EDIT_BUTTON.addEventListener("click", (event) => {
		updateInteractedPost(event);
		showEditModal(id);
	});

	NEW_POST.querySelector("section.actions").appendChild(EDIT_BUTTON);

	const REMOVE_BUTTON = document.createElement("button");
	REMOVE_BUTTON.innerHTML = "<i class='bx bxs-trash-alt'></i>";
	REMOVE_BUTTON.classList.add("secondary-button");
	REMOVE_BUTTON.addEventListener("click", (event) => {
		updateInteractedPost(event);
		removePost(id);
	});

	NEW_POST.querySelector("section.actions").appendChild(REMOVE_BUTTON);

	POSTS_LIST.prepend(NEW_POST);
}

function addPost(title, description) {
	createPost(title, description)
		.then((post) => {
			renderPost(post.id, post.title, post.body);
			ADD_FORM.reset();
		})
		.catch((error) => alert(error.message));
}

function editPost(id, title, description) {
	updatePost(id, title, description)
		.then(() => {
			INTERACTED_POST.querySelector(".title").textContent = title;
			INTERACTED_POST.querySelector(".content").textContent = description;
		})
		.catch((error) => alert(error.message));
}

function removePost(id) {
	deletePost(id)
		.then(() => {
			INTERACTED_POST.remove();
		})
		.catch((error) => alert(error.message));
}

/* Modal Handlers */

function showEditModal(id) {
	TO_EDIT_ID.value = id;
	TO_EDIT_TITLE.value = INTERACTED_POST.querySelector(".title").textContent;
	TO_EDIT_DESCRIPTION.value =
		INTERACTED_POST.querySelector(".content").textContent;

	document.body.style.overflow = "hidden";
	EDIT_MODAL.showModal();
}

export function closeEditModal() {
	document.body.style.overflow = "auto";
	EDIT_MODAL.querySelector("main").scrollTo(0, 0);
	EDIT_MODAL.close();
}

/* Listeners registration */

getPosts()
	.then((posts) =>
		posts.forEach((post) => {
			renderPost(post.id, post.title, post.body);
		})
	)
	.catch((error) => alert(error.message));

ADD_FORM.addEventListener("submit", (event) => {
	event.preventDefault();
	const TITLE = TO_ADD_TITLE.value.trim();
	const DESCRIPTION = TO_ADD_DESCRIPTION.value.trim();
	if (!TITLE || !DESCRIPTION) {
		alert(
			"Cada campo debe tener al menos un (1) caracter distinto de espacio para poder continuar."
		);
	} else {
		addPost(TITLE, DESCRIPTION);
	}
});

EDIT_FORM.addEventListener("submit", (event) => {
	event.preventDefault();
	const TITLE = TO_EDIT_TITLE.value.trim();
	const DESCRIPTION = TO_EDIT_DESCRIPTION.value.trim();
	if (!TITLE || !DESCRIPTION) {
		alert(
			"Cada campo debe tener al menos un (1) caracter distinto de espacio para poder continuar."
		);
	} else {
		editPost(
			TO_EDIT_ID.value,
			TITLE,
			DESCRIPTION
		);
		closeEditModal();
	}
});

DIALOG_CLOSER.addEventListener("click", closeEditModal);
CANCEL_BUTTON.addEventListener("click", closeEditModal);
