import axios from "axios";

export function queryApi(query) {
  if (!axios.defaults.headers.common["Authorization"]) {
    setAuthorizationHeaderToken(localStorage.token);
  }

  return new Promise((resolve, reject) => {
    axios({
      url:
        process.env.NODE_ENV === "production"
          ? "/graphql"
          : "http://localhost:8080/graphql",
      method: "post",
      data: {
        query: `
        ${query}
        `
      }
    })
      .then(result => {
        resolve(result.data);
      })
      .catch(err => reject(err));
  });
}

export function setAuthorizationHeaderToken(token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
