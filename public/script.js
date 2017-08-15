// const Message = require('../models/message');

let allMessages = document.querySelector('.all-messages');

allMessages.addEventListener('click', function(e) {
  if (e.target.className === 'message-footer') {
    alert('hi');
    console.log(e.target);
    const message = e.target.previousElementSibling;
    let messageID = message.getAttribute('data-id');
    if (message.classList.contains('hide')) {
      message.classList.remove('hide');
      e.target.textContent = 'Hide';
      fetch(`/readmessage/${ messageID }`, {
        method: 'POST',
        body: {
          read: true
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {
          return response.json();
      }).then((json) => {
          console.log(json);
        });
      // .then((result) => {
      //   console.log('RESULT===================================================================================================================================', result);
      // })
    } else {
      message.classList.add('hide');
      e.target.textContent = 'Show';
    }
  }
});
