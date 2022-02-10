import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';
// const BASE_URL = 'https://fantasy-football-assistant.herokuapp.com';

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class UsersApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = 'get') {
    console.debug('API Call:', endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${UsersApi.token}` };
    const params = method === 'get' ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error('API Error:', err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Add a new user. */

  static async addUser(user) {
    let res = await this.request('auth/register', user, 'post');
    return res.token;
  }

  /** Update an existing user. */

  static async updateUser(username, user) {
    let res = await this.request(`users/${username}`, user, 'patch');
    return res.user;
  }

  /** Login an exister user. */

  static async loginUser(user) {
    let res = await this.request('auth/token', user, 'post');
    return res.token;
  }

  /** Get user details. */

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }
}

// for now, put token ("testuser" / "password" on class)
UsersApi.token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ' +
  'SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0.' +
  'FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc';

export default UsersApi;
