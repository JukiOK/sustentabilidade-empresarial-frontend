import React, { useState } from 'react';
import BasePageLogin from '../BasePageLogin/BasePageLogin';
import firebase from 'firebase';

require('./verifyEmail.scss');

function VerifyEmail(props) {

  const [sent, setSent] = useState(false);
  const apiUrl = process.env.NODE_ENV === 'production' ? 'http://143.106.73.67:3001/' : 'http://localhost:3001';
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: apiUrl + '/login',
    // This must be true.
    handleCodeInApp: true,

  };

  function verify() {
    let user = firebase.auth().currentUser;
    user.sendEmailVerification(actionCodeSettings)
    .then(function() {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      setSent(true);
    })
    .catch(function(error) {
      // Some error occurred, you can inspect the code: error.code
    });
  }

  return (
    <BasePageLogin>
      <div className="verify-email-container">
        <span>
          Por favor clique no botão abaixo para enviarmos um link de verificação do seu email, para poder utilizar o sistema.
        </span>
        <div className="btn-confirm" onClick={verify}>Verifique o email</div>
        {
          sent &&
          <div>
            <p>Email enviado.</p>
          </div>
        }
      </div>
    </BasePageLogin>
  )
}

export default VerifyEmail;
