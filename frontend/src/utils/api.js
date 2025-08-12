class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  async _makeRequest(url, method, body) {
    const options = {
      method,
      headers: this._headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(this._baseUrl + url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .catch((err) => console.log(err));
  }

  getUser() {
    return this._makeRequest("/users/me");
  }

  updateUser(name, about) {
    return this._makeRequest("/users/me", "PATCH", {
      name: name,
      about: about,
    });
  }

  updateAvatar(avatarLink) {
    return this._makeRequest("/users/me/avatar", "PATCH", {
      avatar: avatarLink,
    });
  }

  getInitialCards() {
    return this._makeRequest("/cards");
  }

  createCard(card) {
    return this._makeRequest("/cards", "POST", card);
  }

  deleteCard(cardId) {
    return this._makeRequest(`/cards/${cardId}`, "DELETE");
  }

  addLike(cardId) {
    return this._makeRequest(`/cards/${cardId}/likes`, "PUT");
  }

  removeLike(cardId) {
    return this._makeRequest(`/cards/${cardId}/likes`, "DELETE");
  }
}

const api = new Api({
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1",
  headers: {
    authorization: "6776f0e2-04cc-4374-8e7e-91a09af225f0",
    "Content-Type": "application/json",
  },
});

export default api;
