let announcements = []
let items = []
let fadeTime, displayTime

function loadAnnouncements() {
  firebase.initializeApp({
    apiKey: 'AIzaSyCg_FVHdzP3kvRAyrnpE2bJUsQfMRUgFW4',
    authDomain: 'my-covenant.firebaseapp.com',
    databaseURL: 'https://my-covenant.firebaseio.com',
    projectId: 'my-covenant',
    storageBucket: 'my-covenant.appspot.com',
    messagingSenderId: '945207168321',
    appId: '1:945207168321:web:e42d0845df84c8c24e65c0'
  })
  const db = firebase.firestore()
  db.collection('announcements').onSnapshot(snapshot => {
    announcements = []
    snapshot.forEach(doc => {
      announcements.push(doc.data())
    })
    items = []
    for (const announcement of announcements) {
      const w = announcement.content.length > 50 ? ' wide' : ''
      items.push(
        `<div class="item one${w}"><div class="item-text">${announcement.content}</div></div>`
      )
    }
    if (fadeTime) clearTimeout(fadeTime)
    if (displayTime) clearTimeout(displayTime)
    fade()
  })
}

function fade() {
  let ans = document.querySelectorAll('.item')
  let state
  for (let a of ans) {
    a.style.opacity = a.style.opacity == 1 ? 0 : 1
    state = a.style.opacity == 1 ? true : false
  }
  if (state) {
    fadeTime = setTimeout(fade, 10000)
  } else {
    displayTime = setTimeout(displayItems, 1000)
  }
}

function displayItems() {
  const ac = document.querySelector('.announcements')
  ac.innerHTML = ''
  let m = 0
  let br = document.body.getBoundingClientRect()
  for (let i = 0; i < items.length; i++) {
    ac.innerHTML += items[i]
    // check bounds
    let r = ac.lastElementChild.getBoundingClientRect()
    if (i === 0) m = r.top
    if (r.bottom > br.bottom - m) {
      ac.lastElementChild.remove()
      let last = items.splice(i)
      let first = items.splice(0, i)
      items = last.concat(first)
      break
    }
  }
  // check font size
  let ans = document.querySelectorAll('.item')
  let fs = 2.9
  m = 0
  for (let a of ans) {
    m =
      a.lastElementChild.getBoundingClientRect().left -
      a.getBoundingClientRect().left
    while (a.lastElementChild.clientHeight > a.clientHeight - m) {
      a.style.fontSize = fs + 'em'
      fs -= 0.1
    }
  }
  fade()
}

window.onload = loadAnnouncements
