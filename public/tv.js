let announcements = []

function loadAnnouncements() {
  firebase.initializeApp({
    apiKey: "AIzaSyCg_FVHdzP3kvRAyrnpE2bJUsQfMRUgFW4",
    authDomain: "my-covenant.firebaseapp.com",
    databaseURL: "https://my-covenant.firebaseio.com",
    projectId: "my-covenant",
    storageBucket: "my-covenant.appspot.com",
    messagingSenderId: "945207168321",
    appId: "1:945207168321:web:e42d0845df84c8c24e65c0"
  })
  const db = firebase.firestore()
  db.collection('announcements').onSnapshot(snapshot => {
    announcements = []
    snapshot.forEach(doc => {
      announcements.push(doc.data())
    })
    const container = document.querySelector('.announcements')
    container.innerHTML = ''
    for (const item of announcements) {
      if (item.content.length < 50) {
        container.innerHTML += `<div class="item one">${item.content}</div>`
      } else {
        container.innerHTML += `<div class="item two">${item.content}</div>`
      }
    }
  })
}

window.onload = loadAnnouncements