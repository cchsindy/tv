let announcements = []
let items = []
let notifications = []
let notes = []
let n,
  fadeTime,
  displayTime,
  scrollTime,
  scrollInc = 1

function loadAnnouncements() {
  firebase.initializeApp({
    apiKey: 'AIzaSyAZdfrMH61V3Qe0zBF0Zw6K8JMPIaj1RvU',
    authDomain: 'cchs-9821e.firebaseapp.com',
    databaseURL: 'https://cchs-9821e.firebaseio.com',
    projectId: 'cchs-9821e',
    storageBucket: 'cchs-9821e.appspot.com',
    messagingSenderId: '1068116259591',
    appId: '1:1068116259591:web:9a71f9e32ee40af213cba2',
  })
  const db = firebase.firestore()
  db.collection('announcements').onSnapshot((snapshot) => {
    announcements = []
    snapshot.forEach((doc) => {
      announcements.push(doc.data())
    })
    items = []
    for (const announcement of announcements) {
      if (announcement.content.length) {
        const w = announcement.content.length > 50 ? ' wide' : ''
        items.push(
          `<div class="item ${announcement.category}${w}"><div class="item-text">${announcement.content}</div></div>`
        )
      }
    }
    const ac = document.querySelector('.announcements')
    ac.innerHTML = ''
    if (fadeTime) clearTimeout(fadeTime)
    if (displayTime) clearTimeout(displayTime)
    fade()
  })
  db.collection('notifications')
    .orderBy('student')
    .onSnapshot((snapshot) => {
      notifications = []
      snapshot.forEach((doc) => {
        notifications.push(doc.data())
      })
      n = document.querySelector('.notifications')
      const a = document.querySelector('.announcements')
      if (notifications.length > 0) {
        a.style.gridColumn = '1 / 1'
        n.style.display = 'flex'
      } else {
        a.style.gridColumn = '1 / span 2'
        n.style.display = 'none'
      }
      notes = []
      for (const notification of notifications) {
        if (notification.student.length) {
          notes.push(
            `<div class="note">${notification.student} to see ${notification.faculty}</div>`
          )
        }
      }
      n.innerHTML = ''
      notes.forEach((ni) => {
        n.innerHTML += ni
      })
      if (scrollTime) clearInterval(scrollTime)
      scrollTime = setInterval(scroll, 100)
    })
}

function fade() {
  let ans = document.querySelectorAll('.item')
  let state
  for (let a of ans) {
    a.style.opacity = a.style.opacity == 1 ? 0 : 1
    state = a.style.opacity == 1 ? true : false
  }
  if (ans.length === items.length) {
    if (!state) {
      for (let a of ans) {
        a.style.opacity = 1
      }
    }
  } else {
    if (state) {
      fadeTime = setTimeout(fade, 10000)
    } else {
      displayTime = setTimeout(displayItems, 1000)
    }
  }
}

function scroll() {
  const soff = n.scrollHeight - n.clientHeight
  if (soff > 0) {
    if (n.scrollTop >= soff) scrollInc *= -1
    if (n.scrollTop <= 0) scrollInc *= -1
    n.scrollBy(0, scrollInc)
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
  let fs = 3.9
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
