// const Message = require('../models/message');

let allMessages = document.querySelector('.all-messages');

allMessages.addEventListener('click', function(e) {

  console.log(e.target);

  targetElement = e.target;

  function findMessage(targetElement) {

    if (targetElement.className === 'single-message') {
      const messageID = targetElement.getAttribute('data-id');
      console.log(messageID);
      window.location = `/readmessage/${ messageID }`;
    } else {
      targetElement = targetElement.parentElement;
      findMessage(targetElement);
    }

  }

  findMessage(targetElement);
});
