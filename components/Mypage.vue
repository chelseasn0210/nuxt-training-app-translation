<template>
<div id="mypage">

      <ul class="topnav">
      	<li><a class="active" href="#home">ホーム</a></li>
      	<li><a href="#news">記録</a></li>
      	<!--<li><a href="#contact">マイページ</a></li>-->
        <li  @click="profileModal = 'true'" class="open"><a>プロフィール編集</a></li>
        <li  @click="postModal = 'true'" class="open"><a href="#post">投稿</a></li>
        <li @click="logout" class="open"><a>ログアウト</a></li>
      </ul>
      
<!--<button @click="returnTimeline">タイムラインへ戻る</button>-->

  <!--<Modal title="abc" content="abc"/>-->
    <div class="modal" v-show="profileModal === 'true'">
        <div　class="profilePost">
          <h4>プロフィール編集</h4>
        <input type="file" @change="changeprofileImage" data-label="画像の送信"　class="padding　photocolor" ref="profileimage" v-if="view">
        <form @submit.prevent="introduction" class="padding">
        <h5>プロフィールテキスト</h5>
          <input  type="text"  class="white" v-model="profileComment" ref="introductiontext">
          <input type="submit">
        </form>
        </div>
    <div class="close" @click="profileModal = 'false'">×閉じる</div>
  </div>
  
  <br>
  
  <div class="modal" v-show="postModal === 'true'">
      
<!--投稿入力-->
    <div　ref="postadd" class="">
      <h4>新しい投稿</h4>
      <label class="postImage-appendBtn">
        <input type="file" data-label="画像の添付" class="padding photocolor" ref="image" v-if="view">
        <br>
      </label>
      <form @submit.prevent="post" class="padding">
        <h5>コメント</h5>
        <input  class="white" type="text" v-model="messages" ref="comment">
        <input type="submit">
      </form>
  </div>
        
    <div class="close" @click="postModal = 'false'">×閉じる</div>
  </div>


<!--プロフィール-->
    <div class="profile">
    <span class="name">{{ user.displayName }}</span>
    
    <!--<p>{{user.uid}}</p>-->
    <br>
    <!--<p>プロフィール写真</p>-->
    <img v-bind:src="profileImage"　class="profileImage" >
    <br>
    <!--<div v-for="t in profile">-->
    <div>
    <!--<p>プロフィールテキスト</p>-->
    <div v-bind:value="profile">
      <p class="profileText">{{profile}}</p>
    </div>
    </div>
    </div>
    
    
    
    



<!--投稿表示-->
  <div class="post" v-if="show">
    <div v-for="(p,index) in posts" class="postImage" v-bind:class="p.postId">
        <div>
        <!--<p>{{p.postId}}</p>-->
        <!--<p>{{index}}</p>-->
        <p class="postParts">{{p.name}}の投稿</p>
        <img :src="p.url" >
        <!--<p>{{p.uid}}より</p>-->
        <p>{{p.text}}</p>
        </div>
        
        <br>
        
        <!--チャット-->
        <!--<div class="comment_button">-->
        <!--<form @submit.prevent="chatadd" class="padding">-->
        <!--  <input  type="text"  class="white" v-model="chat" ref="chatcomment">-->
        <!--  <input type="submit">-->
        <!--</form>-->
          <!--<button @click="comment(p.postId,index)">-->
          <!--  コメント-->
          <!--</button>-->
        <!--</div>-->
        
        <!--投稿を削除-->
        <div class="book-item__delete-wrapper">
          <button @click="deletePost(p.postId,index)" class="btn btn-danger book-item__delete postParts" >
            <i class="fas fa-trash-alt" aria-hidden="true"></i>
            削除
          </button>
        </div>
    </div>
  </div>
<!--投稿表示ここまで-->
  
</div>

</template>

<script>
import firebase from '@/plugins/firebase';
import 'firebase/storage';
import 'firebase/database';
import Modal from '~/components/Modal.vue';
// import Text from '~/components/Text.vue';

export default {
  components: {
    // Text,
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
      chat:[],
      comment:[],
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





  created: function() {
    firebase.database().ref('/posts').on('child_added',(Snapshot)=>{
      // let database = firebase.database();
      // let dataRef = database.ref('/posts');
      // console.log(dataRef);
      // const pos=[];
      const postId = Snapshot.key;
      const message = Snapshot.val();
      
      message.postId = postId;
      
      
      // pos.push(postId);
      // pos.push(message);
      
      this.posts.push(message);
      
      
      // console.log(Snapshot.val());
      // console.log(this.posts);
    });
    // 自己紹介文
    firebase.database().ref('users/' + this.user.uid +'/introductiontext/').on('child_added',(Snapshot)=>{
      const postId = Snapshot.key;
      const message = Snapshot.val();
      // this.profile.push(message);
      // this.profile.shift();
      this.profile=message.text;
    });
    // プロフィール写真
    firebase.database().ref('users/' + this.user.uid +'/profileImage/').on('child_added',(Snapshot)=>{
      const postId = Snapshot.key;
      const Image = Snapshot.val();
      // this.profile.push(message);
      // this.profile.shift();
      this.profileImage=Image.url;
    });
  },

  mounted:function(){

  },








  methods: {
    openModal:function(){
      this.modal=true;
      
    },
    
     returnTimeline(){
        this.$router.push('/timeline')
  },
    // フォームをリセット
    resetForm:function(){
      // const postadd=this.$refs.postadd
      // postadd=""
      this.messages='';
      this.profileComment='';
      this.chat='';
      this.view = false
      this.$nextTick(function () {
      this.view = true
      })
    },
    
    
    // 投稿する
    post () {
        // const file = e.target.files[0]
        const file=this.$refs.image.files[0]
        const storageRef = firebase.storage().ref('users/' + this.user.uid + '/images/' + file.name)
        // 画像をStorageにアップロード
        storageRef.put(file).then(() => {
          console.log("アップロード完了")
          console.log(this.user.uid);
            // アップロードした画像のURLを取得
            firebase.storage().ref('users/' + this.user.uid + '/images/' + file.name).getDownloadURL().then((url) => {
            const imageLocation= 'users/' + this.user.uid + '/images/' + file.name;
            let comments = this.$refs.comment;
            const postData = {
                      filename:file.name,
                      imageDataL:imageLocation,
                      url:url,
                      uid:this.user.uid,
                      text: comments.value,
                      createdAt: firebase.database.ServerValue.TIMESTAMP,
                      name:this.user.displayName
                    };
                firebase.database().ref('/posts').push(postData)
                
            // let database = firebase.database();
            // let dataRef = database.ref('/posts');
            console.log(comments.value);
            
            console.log(this.posts)
                // アップロードした画像のURLと画像名をDBに保存
            this.resetForm();
            }).catch((error) => {
                console.log(error)
            })
        })
    },
    // コメント
    chatadd:function(){
      // let chats = this.$refs.chatcomment;
      let chats = this.chat;
      // const textData={
      //   uid:this.user.uid,
      //   text:chat.value,
      //   name:this.user.displayName,
      //   createdAt: firebase.database.ServerValue.TIMESTAMP,
      // }
      // firebase.database().ref("posts/"+ postId + "chatlist").push(textData);
      console.log(chats.value);
      this.resetForm();
    },
    
    // 投稿を削除する
    deletePost:function(postId,index){
    console.log(postId);
      firebase
    .database()
    .ref("posts/"+postId)
    .remove();
    
    firebase.database().ref('posts').off('child_added');
    // firebase.database().ref('posts').off('child_removed');
    
    this.posts.splice(index,1);
    // postIdのクラスを隠す
    // firebase.database().ref('posts').on('child_removed',(Snapshot)=>{
    // const psId = Snapshot.key;
    // const post = this.$refs.p.postId;
    // console.log(psId);
    // console.log(post);
    
    // // let psps = this.$el.getElementById('p.postId');
    // // console.log(psps);
    // // psps.hide();
    // // this.show= false;
    // // post.hide();
    
    // });
    
    // const post = this.posts.splice(index, 1);
    },
    
    // プロフィール写真
    changeprofileImage : function() {
        // const file = e.target.files[0]
        const file=this.$refs.profileimage.files[0]
        const storageRef = firebase.storage().ref('users/' + this.user.uid + '/profileimages/' + file.name)
        // 画像をStorageにアップロード
        storageRef.put(file).then(() => {
          console.log("アップロード完了")
          console.log(this.user.uid);
            // アップロードした画像のURLを取得
            firebase.storage().ref('users/' + this.user.uid + '/profileimages/' + file.name).getDownloadURL().then((url) => {
            const imageLocation= 'users/' + this.user.uid + '/profileimages/' + file.name;
            const profileData = {
                      filename:file.name,
                      imageDataL:imageLocation,
                      url:url,
                      uid:this.user.uid,
                      createdAt: firebase.database.ServerValue.TIMESTAMP,
                    };
                firebase.database().ref('users/' + this.user.uid +'/profileImage/').push(profileData);
                
            let database = firebase.database();
            let dataRef = database.ref('/profileImage');
            console.log(dataRef);
                // アップロードした画像のURLと画像名をDBに保存
            this.resetForm();
            }).catch((error) => {
                console.log(error)
            })
        })
    },
    
    // 自己紹介文
    introduction:function(){
      let introtext = this.$refs.introductiontext;
      const textData={
        uid:this.user.uid,
        text:introtext.value,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      }
      firebase.database().ref('users/' + this.user.uid +'/introductiontext/').push(textData);
      this.resetForm();
      console.log(this.user);
    },
    
    
    
    
    messageAdd:function(){
      
      
          const message = {
            uid: this.user.uid,
      };

      firebase
      .database()
      .ref('messages')
      .push(message);
      
      this.upload();
      // if(process.client){ // 追加
      //     // const commentMessage= document.getElementById(".comment")
      //     // const commentMessage= this.$.comment.val();
      //     // console.log(commentMessage);

      // }
      // const message=this.messages.val()
      // var messageKey=firebase.database().ref().child('messages').push().key;
      // firebase
      //   .database()
      //   .ref('messages/' + this.user.uid　+ '/' + messageKey)
      //   .push(value)
    },
// ここまでmessageAdd

    logout: function() {
      firebase.auth().signOut();
    },
    saveContent: function(value) {
      // 新しいテキストのためのキーを取得
      var newNoteKey = firebase.database().ref().child('notes').push().key;
      firebase
        .database()
        .ref('notes/' + this.user.uid　+ '/' + newNoteKey)
        .set({content:value})
    }
  }
}

</script>

<style>

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


.padding{
  padding:20px;
}


.profile{
  width:100%;
  height:200px;
  margin-bottom:10px;
  padding-bottom:10px;
  border-bottom:solid 1px;
  /*border-top:solid 1px;*/
}
.name{
  font-weight:bold;
  border-bottom:solid 1px;
}
.profileText{
  margin:50px 0;
}
.profileImage{
  border-radius: 50%;  /* 角丸半径を50%にする(=円形にする) */
    width:  180px;       /* ※縦横を同値に */
    height: 180px;       /* ※縦横を同値に */
    float: left;
}


.post{
  display:flex;
  flex-wrap:wrap;
  width:1161px;
  
}
.postImage{
  border:solid 1px;
  /*padding:20px;*/
  width:387px;
}
img{
  width:385px;
  height:450px;
  padding:10px;
}

.book-item__delete{
  margin:10px;
}

/* 角丸半径を50%にする(=円形にする) */
.open, .close {
    /*border-radius: 5%;  */
    /*border: 1px solid #fff;*/
    /*width: 170px;*/
    cursor: pointer;
    /*margin:auto;*/
    background-color:#1b2538;
    color:#fff;
}

.white{
  background-color:white;
}
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 300px;
    background-color: #1b2538;
    color:#fff;
    border-radius: 5%;  /* 角丸半径を50%にする(=円形にする) */
    /*display: none;*/
}
.postParts{
  /*display: block;*/
	padding: 14px 16px;
	text-align: center;
	color: white;
	background-color: #1b2538;
}
.photocolor{
  color:black;
}
</style>
