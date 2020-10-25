document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#send-button').addEventListener('click', () => {

    console.log('Enviando email');
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.getElementById('compose-recipients').value,
        subject: document.getElementById('compose-subject').value,
        body: document.getElementById('compose-body').value
      })
    })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
        load_mailbox('inbox');
      });
      
  });

  //close popup
  // document.querySelector('#btn-close').addEventListener('click', ()=>{
  //   document.querySelector('.overlay').style.display = 'none';
  // });




  // By default, load the inbox
  load_mailbox('inbox');





});





function compose_email() {

  // Show compose view and hide other views
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


  

}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').innerHTML = "";

  //enviar


  //peticion get
  fetch('/emails/'.concat(mailbox))
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      var caja = document.getElementById('emails-view');
      emails.forEach(email => {

        if (email.read == true) {
          var back_color = "rgb(245, 245, 245);";
        } else {
          var back_color = "white";
        }
        caja.innerHTML += '<div id="email-'+ email.id+'" class="email-cont" style="background-color:' + back_color + ';">' +

          '<p  onclick="show_email(' + email.id + ');" class="email-user" > <strong> ' + email.sender +
          ' </strong>' + email.subject + '</p>' +
          //'<p class="email-subject"> ' + email.subject + '</p>' +
          '<p class="email-body"> ' + email.timestamp + '</p>' +
          '</div>';
        //document.querySelector('#emails-view').append(div);

        if (mailbox == 'archive') {

          const btn_undo = document.createElement('button');
          btn_undo.className = 'btn btn-sm btn-outline-primary';
          btn_undo.innerHTML = 'Unarchive';
          btn_undo.setAttribute("onclick", "unarchive_email("+ email.id+");");

          // btn_undo.addEventListener('click', function () {
            
          // });

          document.querySelector('#email-'+email.id).append(btn_undo);


        }
      });
      // ... do something else with emails ...

    });


  // Show the mailbox name

  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

}

function unarchive_email(id){
  fetch('/emails/'.concat(id), {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  });
  load_mailbox('inbox');
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

      caja.innerHTML = '<div ">' +

        '<p id="TX"> <strong> From: </strong>' + email.sender + '</p>' +
        '<p id="RX"> <strong> To: </strong>' + email.recipients + '</p>' +
        '<p id="subject"> <strong> Subject: </strong>' + email.subject +
        '<p id="time"> <strong> Timestamp: </strong>' + email.timestamp + '</p>' +
        '<div class="flex-cont">' +
        '<button onclick="reply_email(' + email.id + ');"class="btn btn-sm btn-outline-primary">Reply</button>' +
        '<button onclick="archived_email(' + email.id + ');"class="btn btn-sm btn-outline-primary">Archived</button>' +
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


function archived_email(id) {
  fetch('/emails/'.concat(id), {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  });
  document.querySelector('.overlay').style.display = 'flex';
  document.querySelector('#btn-close').addEventListener('click', () => {
    document.querySelector('.overlay').style.display = 'none';
  });
  document.querySelector('#btn-undo').addEventListener('click', () => {
    unarchive_email(id);
    document.querySelector('.overlay').style.display = 'none';
  });
}




// Para crear un elemento HTML y agregarle un controlador de eventos, puede usar código JavaScript como el siguiente:
// const element = document.createElement('div');
// element.innerHTML = 'This is the content of the div.';
// element.addEventListener('click', function() {
//     console.log('This element has been clicked!')
// });
// document.querySelector('#container').append(element);