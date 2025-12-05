<template>
  <div class="hello">
    <h1>Authentication demo</h1>
    <p>{{ msg }}</p>
    <input type="button" @click="sendWebRequest('login', 'post', { username: 'joeuser', userpass: 'joeXXX' })" value="LOGIN BAD" />
    <input type="button" @click="sendWebRequest('login', 'post', { username: 'joeuser', userpass: 'joepass' })" value="LOGIN USER" />
    <input type="button" @click="sendWebRequest('login', 'post', { username: 'joeadmin', userpass: 'joepass' })" value="LOGIN ADMIN" />
    <input type="button" @click="sendWebRequest('user', 'get')" value="ACCESS /user" />
    <input type="button" @click="sendWebRequest('admin', 'get')" value="ACCESS /admin" />
    <input type="button" @click="sendWebRequest('protected', 'get')" value="ACCESS /protected" />
    <input type="button" @click="sendWebRequest('logout', 'get')" value="LOGOUT" />
  </div>
</template>

<script>
export default {
  name: 'AuthenticationDemo',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    async sendWebRequest(endpoint, methodParam, bodyObjParam = null) {
      let url = "http://localhost:9000/auth/" + endpoint;
      try {
        const response = await fetch(url, {
            credentials: "include",
            method: methodParam,
            body: bodyObjParam == null ? null : JSON.stringify(bodyObjParam),
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log("<FETCH>");
        console.log(result);
        console.log("</FETCH>");
        this.msg = JSON.stringify(result);
        return result;
      } catch (error) {
        console.error(error.message);
      }
    }
  },

}
</script>
