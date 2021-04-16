<template>
<div id="mypage">
    <h1>ニュータイムライン</h1>
<button @click="returnMypage">マイページへ戻る</button>

    
    
    
    
  <p class="padding"><button @click="logout">ログアウト</button></p>



<!--投稿表示-->
  <div class="post" v-if="show">
    <div v-for="(p,index) in timelinePosts" class="postImage" v-bind:class="p.postId">
        <div>
        <!--<p>{{p.postId}}</p>-->
        <!--<p>{{index}}</p>-->
        <p>{{p.name}}さんの投稿</p>
        <img :src="p.url" >
        <p>{{p.uid}}さんより</p>
        <p>{{p.text}}</p>
        </div>
        <div class="book-item__delete-wrapper">
          <button @click="deletePost(p.postId,index)" class="btn btn-danger book-item__delete" >
            <i class="fas fa-trash-alt" aria-hidden="true"></i>
            削除
          </button>
        </div>
    </div>
  </div>
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
      comments:[],
      posts:[],
      profile:"",
      profileImage:"",
      view: true,
      show:true,
      dialog: false,
      profileModal:false,
      postModal:false,
      timelinePosts:[]
    };
  },

  created: function() {
    firebase.database().ref('users/' + '/posts/'+ this.user.uid).on('child_added',(Snapshot)=>{
      // let database = firebase.database();
      // let dataRef = database.ref('/posts');
      // console.log(dataRef);
      // const pos=[];
      const postId = Snapshot.key;
      const message = Snapshot.val();
      
      message.postId = postId;
      
      
      // pos.push(postId);
      // pos.push(message);
      
      this.timelinePosts.push(message);
      console.log(this.posts);
      
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
    
     returnMypage(){
        this.$router.push('/')
  },
    // フォームをリセット
    resetForm:function(){
      // const postadd=this.$refs.postadd
      // postadd=""
      this.messages='';
      this.profileComment='';
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
                firebase.database().ref('users/' + this.user.uid +'/posts/').push(postData)
            let database = firebase.database();
            let dataRef = database.ref('/posts');
            console.log(dataRef);
            
            console.log(this.posts)
                // アップロードした画像のURLと画像名をDBに保存
            this.resetForm();
            }).catch((error) => {
                console.log(error)
            })
        })
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
    
    // 投稿を削除する
    deletePost:function(postId,index){
      firebase
    .database()
    .ref("posts/"+postId)
    .remove();
    
    firebase.database().ref('posts').off('child_added');
    // firebase.database().ref('posts').off('child_removed');
    
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
    this.posts.splice(index,1);
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
#mypage{
  width:876px;
}

.name{
  font-weight:bold;
}

.padding{
  padding:20px;
}


.profile{
  width:876px;
  height:200px;
  margin:10 auto;
  border-bottom:solid;
}
.profileText{
  background-color: white;
}
.profileImage{
  border-radius: 50%;  /* 角丸半径を50%にする(=円形にする) */
    width:  180px;       /* ※縦横を同値に */
    height: 180px;       /* ※縦横を同値に */
    float: left;
}


img{
  width:250px;
  height:450px;
  padding:10px;
}
.post{
  display:flex;
  flex-wrap:wrap;
  width:876px;
  
}
.postImage{
  border:solid 2px;
  padding:20px;
  width:292px;
}

.book-item__delete{
  margin:10px;
}

.open, .close {
    border-radius: 5%;  /* 角丸半径を50%にする(=円形にする) */
    border: 1px solid #fff;
    width: 170px;
    cursor: pointer;
    margin:auto;
    background-color:#1b2538;
    color:#fff;
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

</style>
