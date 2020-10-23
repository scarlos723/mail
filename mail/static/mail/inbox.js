document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);




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

        if (email.read == true) {
          var back_color = "rgb(209, 209, 209);";
        } else {
          var back_color = "white";
        }
        caja.innerHTML += '<div class="email-cont" style="background-color:' + back_color + ';">' +

          '<p  onclick="show_email(' + email.id + ');" class="email-user" > <strong> ' + email.sender +
          ' </strong>' + email.subject + '</p>' +
          //'<p class="email-subject"> ' + email.subject + '</p>' +
          '<p class="email-body"> ' + email.timestamp + '</p>' +
          '</div>';
        //document.querySelector('#emails-view').append(div);

      });
      // ... do something else with emails ...
    });

  // Show the mailbox name

  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

}


function show_email(id) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').innerHTML = "";

  //document.querySelector('#test').innerHTML=`<h2> Mensaje de prueba el id es ${id} </2>`;

  fetch('/emails/'.concat(id))
    .then(response => response.json())
    .then(email => {
      // Print emails
      console.log(email);

      var caja = document.getElementById('emails-view');
      var back_color = "white";
      // ... do something else with email ...

      caja.innerHTML = '<div >' +

        '<p id="TX"> <strong> From: </strong>' + email.sender + '</p>' +
        '<p id="RX"> <strong> To: </strong>' + email.recipients + '</p>' +
        '<p id="subject"> <strong> Subject: </strong>' + email.subject +
        '<p id="time"> <strong> Timestamp: </strong>' + email.timestamp + '</p>' +
        '<div class="flex-cont">' +
        '<button onclick="reply_email(' + email.id + ');"class="btn btn-sm btn-outline-primary">Reply</button>' +
        '<button onclick=""class="btn btn-sm btn-outline-primary">Archived</button>' +
        '</div>' +
        '</div>' +
        '<hr color="blue" size=3>' +

        '<div>' +
        '<p id="body"> ' + email.body + '</p>' +
        '</div>';
    });

}

function reply_email(id) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  fetch('/emails/'.concat(id))
    .then(response => response.json())
    .then(email => {
      // Print emails
      console.log(email);

      var caja = document.getElementById('emails-view');
      var back_color = "white";
      // ... do something else with email ...
      document.querySelector('#compose-recipients').value = email.sender;
      document.querySelector('#compose-subject').value = 'RE: ' + email.subject;
      document.querySelector('#compose-body').value = 'On ' + email.timestamp + email.sender + ' wrote: ' + email.body;
    });




}