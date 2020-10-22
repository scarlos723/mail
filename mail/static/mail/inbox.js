document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  
  document.querySelector('form').onsubmit = function () {
    
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value 
      })
    })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
      });
    }
  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


  

      

  
  
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').innerHTML = "";

  //peticion get
  fetch('/emails/'.concat(mailbox))
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      var caja = document.getElementById('emails-view');
      emails.forEach(email => {
        // const div = document.createElement('div',"email-cont");
        // div.innerHTML = email.id;
        
        caja.innerHTML += '<div class="email-cont">' + 
        '<p class="email-user"> '+  email.sender + '</p>'+
        '<p class="email-subject"> '+  email.subject + '</p>'+
        '<p class="email-body"> '+  email.body + '</p>'+   
        '</div>';
        //document.querySelector('#emails-view').append(div);
        
      });
      // ... do something else with emails ...
    });

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
 
}