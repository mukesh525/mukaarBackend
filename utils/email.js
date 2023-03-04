// Require objects.
let aws = require("aws-sdk");
//let file =require('./utils/data.html')
const config = require("../config");
let fromEmailAddress = "Mukaar New Contact <support@mukaar.com>";
let fs = require("fs");


aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: "ap-south-1"
});

let ses = new aws.SES();
const sendmail = (title, message, to, password) => {
  let msg = template
    .toString()
    .replace(/reset/g, message)
    .replace(/Password/g, password);
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: msg
        },
        Text: {
          Charset: "UTF-8",
          Data: title
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: title
      }
    },
    Source: fromEmailAddress,
    ReplyToAddresses: [to]
  };

  return ses.sendEmail(params).promise();
};
const sendTextEmail = (title, message, to) => {
  //console.log(config.AWS_SECRET_ACCESS_KEY, config.AWS_ACCESS_KEY_ID)
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message
        },
        Text: {
          Charset: "UTF-8",
          Data: title
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: title
      }
    },
    Source: fromEmailAddress,
    ReplyToAddresses: [to]
  };

  return ses.sendEmail(params).promise();
};

const sendWelcome = (title, username, to) => {
  let msg = welcome.toString().replace("[UserName]", username);
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: msg
        },
        Text: {
          Charset: "UTF-8",
          Data: title
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: title
      }
    },
    Source: fromEmailAddress,
    ReplyToAddresses: [to]
  };

  return ses.sendEmail(params).promise();
};
const sendProfileViwed = (username, user, to) => {
  username = username.split(" ")[0]
  let msg = viewedhtml.toString().replace("[Firstname]", username);
  msg = msg.replace("[title]", user.title);
  msg = msg.replace("[image]", user.profileImage == undefined ? `https://www.gravatar.com/avatar/?d=identicon` : `https://peoplenode.s3.us-west-1.amazonaws.com/${user.profileImage}`);
  msg = replaceAll(msg, "[name]", user.name.split(" ")[0]);
  msg = msg.replace("[title]", user.title);
  msg = msg.replace("[Sender_Username]", user.username);

  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: msg
        },
        Text: {
          Charset: "UTF-8",
          Data: "Someone on People App viewed your profile"
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Someone on People App viewed your profile"
      }
    },
    Source: fromEmailAddress,
    ReplyToAddresses: [to]
  };

  return ses.sendEmail(params).promise();
};
const sendMessageMail = (username, user, to) => {
  username = username.split(" ")[0]
  let msg = messageRecived.toString().replace("[Firstname]", username);
  msg = msg.replace("[image]", user.profileImage == undefined ? `https://www.gravatar.com/avatar/?d=identicon` : `https://peoplenode.s3.us-west-1.amazonaws.com/${user.profileImage}`);
  msg = replaceAll(msg, "[name]", user.name.split(" ")[0]);
  msg = msg.replace("[title]", user.title);
  msg = msg.replace("[Sender_Username]", user.username);

  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: msg
        },
        Text: {
          Charset: "UTF-8",
          Data: `You've received message(s) from ${user.name.split(" ")[0]}`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `You've received message(s) from ${user.name.split(" ")[0]}`
      }
    },
    Source: fromEmailAddress,
    ReplyToAddresses: [to]
  };

  return ses.sendEmail(params).promise();
};
const sendVerification = (title, username, firstname, url, to) => {
  if (url === 'localhost:4000') url = "web.people-app.org"
  let msg = verify_email
    .toString()
    .replace("[username]", username)
    .replace("[Firstname]", firstname)
    .replace("{USER}", username)
    .replace("{HOST}", url);
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: msg
        },
        Text: {
          Charset: "UTF-8",
          Data: title
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: title
      }
    },
    Source: fromEmailAddress,
    ReplyToAddresses: [to]
  };

  return ses.sendEmail(params).promise();
};

getTemplate = message => {
  return "";
};


replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

//export default sendmail
exports.sendmail = sendmail;
exports.sendWelcome = sendWelcome;
exports.sendVerification = sendVerification;
exports.sendTextEmail = sendTextEmail;
exports.sendProfileViwed = sendProfileViwed;
exports.sendMessageMail = sendMessageMail;
