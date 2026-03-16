(loadPage = () => {
	fetch("http://localhost:3000/items")
		.then((res) => res.json())
		.then((data) => {
			displayUser(data);
		});
})();
const userDisplay = document.querySelector(".table");
displayUser = (data) => {
	userDisplay.innerHTML = `
    <thead>
    <tr>
      <th>Id</th>
      <th>Nimi</th>
      <th>Puhelin</th>
      <th>Poista</th>
      <th>Muokkaa</th>
    </tr>
    </thead>
     
    `;
	displayRow(data);
};

const displayRow = (data) => {
	let htmlString = "";

	data.forEach((user) => {
		htmlString += `
			<tr>
				<td>${user.id}</td>
				<td>${user.nimi}</td>
				<td>${user.puhelin}</td>
				<td><input type="button" onClick="removeRow(${user.id})" value="x"/></td>
				<td>		
					<div class="dropdown">
					<button
						type="button"
						class="btn btn-secondary dropdown-toggle"
						data-bs-toggle="dropdown"
						aria-expanded="false"
						data-bs-auto-close="outside"
					>
						Muokkaa
					</button>
					<form class="dropdown-menu p-4">
						<div class="mb-3">
						<label class="form-label">Nimi</label>
						<input
							type="text"
							class="form-control"
							name="name"
							value="${user.nimi}"
							required
							readonly
						/>
						</div>
						<div class="mb-3">
						<label class="form-label">Puhelin</label>
						<input
							type="text"
							class="form-control"
							name="phone"
							value="${user.puhelin}"
							required
						/>
						</div>
						<button type="button" class="btn btn-success" onClick="editRow(${user.id}, this)">Tallenna</button>
					</form>
					</div>
				</td>
			</tr>
		
			`;
	});
	userDisplay.innerHTML += `<tbody>${htmlString}</tbody>`;
};

editRow = async (id, btn) => {
	const form = btn.closest("form");
	const phone = form.elements.phone.value;

	let path = "http://localhost:3000/items/" + id;

	try {
		const res = await fetch(path, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ puhelin: phone }),
		});

		if (res.ok) console.log("Muokkaus onnistui");
		else console.error("Käyttäjän muokkaus ei onnistunut");
	} catch (error) {
		console.error("Virhe: ", error);
	}
};

removeRow = async (id) => {
	let path = "http://localhost:3000/items/" + id;

	try {
		const res = await fetch(path, { method: "DELETE" });

		if (res.ok) console.log("Käyttäjän poisto onnistui");
		else console.log("Kayttäjän poisto ei onnistunut");
	} catch (error) {
		console.error("Virhe: ", error);
	}
};

/**
 * Helper function for POSTing data as JSON with fetch.
 *
 * @param {Object} options
 * @param {string} options.url - URL to POST data to
 * @param {FormData} options.formData - `FormData` instance
 * @return {Object} - Response body from URL that was POSTed to
 */
async function postFormDataAsJson({ url, formData }) {
	const plainFormData = Object.fromEntries(formData.entries());
	const formDataJsonString = JSON.stringify(plainFormData);

	const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: formDataJsonString,
	};

	const response = await fetch(url, fetchOptions);

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}

	return response.json();
}

/**
 * Event handler for a form submit event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
 *
 * @param {SubmitEvent} event
 */
async function handleFormSubmit(event) {
	event.preventDefault();

	const form = event.currentTarget;
	const url = form.action;

	try {
		const formData = new FormData(form);

		const responseData = await postFormDataAsJson({ url, formData });
		await loadPage(); //päivitetään taulukkoon

		console.log({ responseData });
	} catch (error) {
		console.error(error);
	}
}

const exampleForm = document.getElementById("puhelintieto_lomake");
exampleForm.addEventListener("submit", handleFormSubmit);
