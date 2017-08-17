// const Message = require('../models/message');

let allMessages = document.querySelector('.all-messages');

allMessages.addEventListener('click', function(e) {

  console.log(e.target);

  targetElement = e.target;

  function findMessage(targetElement) {

    if (targetElement.className === 'single-message') {
      const messageID = targetElement.getAttribute('data-id');
      console.log(messageID);
      markAsRead(messageID);
    } else {
      targetElement = targetElement.parentElement;
      findMessage(targetElement);
    }

  }

  findMessage(targetElement);


  function markAsRead(id) {
    fetch(`/readmessage/${ id }`, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      method: 'post',
      body: { '_id': id }
    }).then((response) => {
      return response.json();
    }).then((result) => {
      console.log(result);
    });
  };

});
