import axios from 'axios';
class AuthService {
    register(userJSON) {
        return axios.post('user', userJSON);
    }
    login(userJSON) {
        var parseJwt = function (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        
            return JSON.parse(jsonPayload);
        }
        return axios
        .post('auth', userJSON)
        .then(response => {
            if (response.data.token) {
                localStorage.setItem('jwt', response.data.token);
                localStorage.setItem('user', parseJwt(response.data.token).sub)
            }
            return JSON.parse(localStorage.getItem('user'));
        });
    }
    logout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
    }
}
export default new AuthService();