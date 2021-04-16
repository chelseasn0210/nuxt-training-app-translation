<template>

  <section class="container">
    <div>
      <ul class="topnav">
      	<li><a class="active" href="#home">ホーム</a></li>
      	<li><a href="#news">記録</a></li>
      	<li><a href="#contact">マイページ</a></li>
      	<li class="right"><a href="#about">投稿</a></li>
      </ul>

      <h1>タイムライン</h1>
      
      <div class="links">
        <Home v-if="!isLogin"></Home>
        <Newtimeline v-if="isLogin" :user="userData"></Newtimeline>
      </div>
      
      
      
    </div>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'
import Newtimeline from '~/components/Newtimeline.vue';
export default {
  components: {
    Newtimeline
  },
  name: 'mypage',
  props: ['user'],
  data () {
  // data (context) {
    // コンポーネントをロードする前に毎回呼び出されます
    return {
      note_content: 'hello',
      notes:[],
      icon: '',
      photos: [],
      messages:[],
      profileComment:[],
      comments:[],
      posts:[],
      profile:"",
      profileImage:"",
      view: true,
      show:true,
      dialog: false,
      profileModal:false,
      postModal:false
    };
  },
  asyncData (context) {
    // コンポーネントをロードする前に毎回呼び出されます
    return { name: 'Hello, World！！', isLogin:false, userData:null}
  },
  fetch () {
    // `fetch` メソッドはページの描画前にストアを満たすために使用されます
  },
  
  created: function() {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        this.isLogin = true;
        this.userData = user;
      } else {
        this.isLogin = false;
        this.userData = null;
      };
    });
    
  },
  methods: {
    googleLogin: function() {
      firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    }
  }
}
</script>

<style>
section{
  width:876px;
  background-color:#ff8d3f;
    
}
ul.topnav {
	overflow: hidden;
	display:flex;
	margin: 0;
	padding: 0;
	list-style-type: none;
	background-color: #1b2538;
	text-align: center;
}
ul.topnav li {
	float: left;
}
ul.topnav li a {
	display: block;
	padding: 14px 16px;
	text-align: center;
	text-decoration: none;
	color: white;
}
ul.topnav li a:hover:not(.active) {
	background-color: #a9bce2;
}
ul.topnav li a.active {
	background-color: #da3c41;
}
ul.topnav li.right {
	float: right;
}
@media screen and (max-width: 480px) {
	ul.topnav li.right, ul.topnav li {
		float: none;
	}
}


.container {
  /*min-height: 100vh;*/
  /*display: flex;*/
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  padding-top: 15px;
}
</style>
