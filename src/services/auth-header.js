export default function authHeader() {
    let jwt = localStorage.getItem('jwt');
    if (jwt) {
      return { Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/json' };
    } else {
      return { 'Content-Type': 'application/json' };
    }
  }