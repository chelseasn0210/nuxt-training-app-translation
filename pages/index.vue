<template>

  <section class="container">
    <div>
      <!--<ul class="topnav">-->
      <!--	<li><a class="active" href="#home">ホーム</a></li>-->
      <!--	<li><a href="#news">記録</a></li>-->
      <!--	<li><a href="#contact">マイページ</a></li>-->
      <!--	<li class="right"><a href="#about">投稿</a></li>-->
      <!--</ul>-->


      
      <div class="links">
        <Home v-if="!isLogin"></Home>
        <Mypage v-if="isLogin" :user="userData"></Mypage>
      </div>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/Logo.vue'
import firebase from '@/plugins/firebase'
import Home from '~/components/Home.vue';
import Mypage from '~/components/Mypage.vue';
export default {
  components: {
    AppLogo,
    Home,
    Mypage
  },
  asyncData (context) {
    // コンポーネントをロードする前に毎回呼び出されます
    return { name: 'Hello, World！！', isLogin:false, userData:null}
  },
  fetch () {
    // `fetch` メソッドはページの描画前にストアを満たすために使用されます
  },
  mounted: function() {
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
  background-color:#ff8d3f;
    
}
ul.topnav {
  width:100%;
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
