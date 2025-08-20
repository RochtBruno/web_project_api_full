class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
  }

  async _makeRequest(url, method, body, token) {

    const headers = {
      "Content-type": "application/json"
    }

    const options = {
      method,
      headers
    };

    if(token){
      headers["Authorization"] = `Bearer ${token}`
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(this._baseUrl + url, options)
      .then((res) => {
        if (!res.ok) {
          return res.json().then(err => { throw err });
        }
        return res.json();
      })
      // .catch((err) => console.log(err));
  }

  getUser(token) {
    return this._makeRequest("/users/me", "GET", null, token);
  }

  updateUser(name, about, token) {
    return this._makeRequest("/users/me", "PATCH", {
      name: name,
      about: about,
    }, token);
  }

  updateAvatar(avatarLink, token) {
    return this._makeRequest("/users/me/avatar", "PATCH", {
      avatar: avatarLink,
    },token);
  }

  getInitialCards(token) {
    return this._makeRequest("/cards", "GET", null, token);
  }

  createCard(card, token) {
    return this._makeRequest("/cards", "POST", card, token);
  }

  deleteCard(cardId, token) {
    return this._makeRequest(`/cards/${cardId}`, "DELETE", null, token);
  }

  addLike(cardId, token) {
    return this._makeRequest(`/cards/${cardId}/likes`, "PUT", null, token);
  }

  removeLike(cardId, token) {
    return this._makeRequest(`/cards/${cardId}/likes`, "DELETE", null, token);
  }
}

const api = new Api({
  baseUrl: "http://localhost:3000"
});

export default api;
