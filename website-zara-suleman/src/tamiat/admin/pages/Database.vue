<template>
  <div class="container">

    <!-- notification -->
    <transition mode="out-in" name="fade">
      <div v-if="notification.message" :class="'notification is-' + notification.type">
        <button class="delete" @click="hideNotifications"></button>{{notification.message}}
      </div>
    </transition>

    <h2>Database State</h2>
    <div class="box">
      <div class="columns">
        <div class="column">
          <div>
            Settings:
            <span v-if="settings.length === 0" class="has-text-danger">
              Empty
              <button class="button is-info" @click="addDemoSettings">Add Demo Settings</button>
            </span>
            <span v-else class="has-text-success">Contains data</span>
          </div>

          <div>
            Media:
            <span v-if="media.length === 0" class="has-text-danger">
              Empty <button class="button is-info" @click="addDemoLogo">Add Demo Logo</button>
            </span>
            <span v-else class="has-text-success">Contains data</span>
          </div>

          <div>
            Nav:
            <span v-if="nav.length === 0" class="has-text-danger">
              Empty <button class="button is-info" @click="addDemoNav">Add Demo Nav</button>
            </span>
            <span v-else class="has-text-success">Contains data</span>
          </div>

           <div>
            Content:
            <span v-if="contents.length === 0" class="has-text-danger">
              Empty
              <button class="button is-info" @click="addDemoContent">Add Demo Content</button>
            </span>
            <span v-else class="has-text-success">Contains data</span>
          </div>

           <div>
            Fields:
            <span v-if="fields.length === 0" class="has-text-danger">
              Empty
              <button class="button is-info" @click="addDemoFields">Add Demo Field</button>
            </span>
            <span v-else class="has-text-success">Contains data</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import _ from 'lodash';
import { demoData } from '../../tamiat.config.json';
import notifier from '../../admin/mixins/notifier';
import { settingsRef, mediaRef, navRef, contentsRef, fieldsRef, routesRef } from '../../admin/firebase_config';

export default {
	data() {
		return { ...demoData, con: '' };
	},
	firebase: {
		settings: settingsRef,
		media: mediaRef,
		nav: navRef,
		fields: fieldsRef,
		contents: contentsRef,
		routes: routesRef
	},
	mixins: [notifier],
	methods: {
		addDemoPost() {
			const storageRef = firebase.storage().ref();
			const postImageRef = storageRef.child('images/demo-post-img.png');
			let imgDownloadURL = '';

			this.fetchLogoBlob()
				.then(blob => postImageRef.put(blob))
				.then(snapshot => {
					imgDownloadURL = snapshot.downloadURL;
					const demoPost = { ...this.demoPost };
					demoPost.created = Date.now();
					demoPost.img = imgDownloadURL;
					demoPost.body += `<p><img src="${imgDownloadURL}"></p>`;
					const key = _.find(this.contents, { name: 'Posts' })['.key'];
					return this.$firebaseRefs.contents.child(`${key}/data`).push(demoPost);
				})
				.then(() => this.$firebaseRefs.media.push({
					name: 'demo-post-img.png',
					path: postImageRef.fullPath,
					src: imgDownloadURL
				}))
				.then(() => {
					// this.showNotification('success', 'Demo Content added successfully')
				});
		},
		addDemoNews() {
			const storageRef = firebase.storage().ref();
			const postImageRef = storageRef.child('images/demo-post-img.png');
			let imgDownloadURL = '';

			this.fetchLogoBlob()
				.then(blob => postImageRef.put(blob))
				.then(snapshot => {
					imgDownloadURL = snapshot.downloadURL;
					const demoNews = { ...this.demoNews };
					demoNews.img = imgDownloadURL;
					return this.$firebaseRefs.contents.child(`${this.con}/data`).push(demoNews);
				})
				.then(() => this.$firebaseRefs.media.push({
					name: 'demo-post-img.png',
					path: postImageRef.fullPath,
					src: imgDownloadURL
				}))
				.then(() => {
					this.addDemoRoutesForNews();
					this.showNotification('success', 'Demo Content added successfully');
				});
		},
		addDemoRoutesForNews() {
			let i = this.demoRoutes.length;
			this.demoRoutes.forEach(route => {
				this.$firebaseRefs.routes.push(route)
					.then(() => {
						i--;
						if (i === 0) {
							this.showNotification('success', 'Demo Route added successfully');
						}
					});
			});
		},
		addDemoSettings() {
			this.$firebaseRefs.settings.update(this.demoSettings)
				.then(() => {
					this.showNotification('success', 'Demo Settings added successfully');
				});
		},
		addDemoNav() {
			let i = this.demoNav.length;
			this.demoNav.forEach(link => {
				this.$firebaseRefs.nav.push(link)
					.then(() => {
						i--;
						if (i === 0) {
							this.showNotification('success', 'Demo Nav added successfully');
						}
					});
			});
		},
		addDemoLogo() {
			const storageRef = firebase.storage().ref();
			const logoRef = storageRef.child('images/tamiatlogo.png');

			this.fetchLogoBlob()
				.then(blob => {
					logoRef
						.put(blob)
						.then(snapshot => {
							this.addDemoLogoToDB(snapshot);
						});
				});
		},
		fetchLogoBlob() {
			return fetch(this.demoLogoLink)
				.then(res => res.blob());
		},
		addDemoLogoToDB(snapshot) {
			this.$firebaseRefs.media.push({
				name: 'WebsiteLogo',
				path: snapshot.ref.fullPath,
				src: snapshot.downloadURL
			})
				.then(() => {
					this.showNotification('success', 'Demo Logo added successfully');
				});
		},
		addDemoFields() {
			let i = this.demoFields.length;
			this.demoFields.forEach(field => {
				this.$firebaseRefs.fields.push(field)
					.then(() => {
						i--;
						if (i === 0) {
							this.showNotification('success', 'Demo fields added successfully');
						}
					});
			});
		},
		addDemoContent() {
			let i = this.demoContent.length;

			this.demoContent.forEach(content => {
				this.$firebaseRefs.contents.push(content)
					.then(c => {
						i--;
						if (i === 0) {
							this.con = c.key;
							this.addDemoPost();
							this.addDemoNews();
						}
					});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.column > div {
  margin-top: 15px;
  &:first-child {
    margin-top: 0px;
  }
}

button {
  vertical-align: middle !important;
  margin-left: 30px;
}
</style>
