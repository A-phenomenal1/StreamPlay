const makeUser = require("../models/user.models");
const { UniqueConstraintError } = require("../helpers/errors");
const transporter = require("../helpers/sendMail");
const database = require("../db");
const path = require("path");

function makeUserList() {
  return Object.freeze({
    add,
    sentMail,
    findByEmail,
    findById,
    updateUser,
    getItems,
    remove,
    update,
    replaceWriters,
  });

  //------------------------------------------------------------

  async function getItems({ max = 100, before = 1000, after = 1 } = {}) {
    const db = await database;
    const query = {};
    if (before || after) {
      query._id = {};
      query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id;
      query._id = after ? { ...query._id, $gt: db.makeId(after) } : query._id;
    }

    return (
      await db.collection("users").find(query).limit(Number(max)).toArray()
    ).map(documentToContact);
  }

  //------------------------------------------------------------

  async function add({ userId, ...user }) {
    const db = await database;
    if (userId) {
      user._id = db.makeId(userId);
    }

    const { result, ops } = await db
      .collection("users")
      .insertOne(user)
      .catch((mongoError) => {
        const [errorCode] = mongoError.message.split(" ");
        if (errorCode === "E11000") {
          const [_, mongoIndex] = mongoError.message.split(":")[2].split(" ");
          throw new UniqueConstraintError(
            mongoIndex === "ContactEmailIndex" ? "emailAddress" : "contactId"
          );
        }
        throw mongoError;
      });
    return {
      success: result.ok === 1,
      created: documentToContact(ops[0]),
    };
  }

  //------------------------------------------------------------

  async function findById({ userId }) {
    const db = await database;
    const found = await db
      .collection("users")
      .findOne({ _id: db.makeId(userId) });
    if (found) {
      console.log(found, userId);
      return JSON.parse(JSON.stringify(found));
    }
    return null;
  }

  //------------------------------------------------------------

  async function findByEmail({ email }) {
    const db = await database;
    const results = await db.collection("users").find({ email }).toArray();
    return JSON.parse(JSON.stringify(results));
  }

  //------------------------------------------------------------

  async function remove({ userId, ...user }) {
    // const db = await database;
    // if (userId) {
    //   user._id = db.makeId(userId);
    // }
    // const { result } = await db.collection("users").deleteMany(user);
    // return result.n;
  }

  //------------------------------------------------------------

  async function updateUser({ userId, values }) {
    const db = await database;
    console.log("values: ", values);
    let result;
    try {
      result = await db.collection("users").updateOne(
        { _id: db.makeId(userId) },
        {
          $set: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            profilePic: values.profilePic,
            coverPic: values.coverPic,
          },
        }
      );
      return {
        success: 200,
        result: "Profile updated...",
      };
    } catch (e) {
      return {
        success: 500,
        result: "Failed to update",
      };
    }
  }

  //------------------------------------------------------------

  async function sentMail({ body }) {
    const filePath = path.join(__dirname, "../");
    try {
      let mailOptions = {
        from: "kumarnitesh982000@gmail.com",
        to: "kumarnitesh982000@gmail.com",
        subject: body.subject,
        html: `<h3 style="color:#000000;">${body.subject}</h3>
          <h6>From ${body.email}</h6>
          <hr/>
          <h5 style="padding:5px 0; color:"#BF1363">From ${body.name},</h5>
          <p><span style="color:#F54748;">Query:&nbsp;</span>${body.message}</p>
          <br />
          <p>Mail for feedback</p>
          <h4 style="color:#BF1363;">StreamPlay</h4>
          `,
      };
      let replymailOptions = {
        from: "kumarnitesh982000@gmail.com",
        to: body.email,
        subject: `Reply for: ${body.subject}`,
        html: `<h3 style="color:#EBA83A;"><span style="color:#BB371A;">Reply for: </span>${body.subject}</h3>
          <hr/>
          <h5 style="padding:5px 0; color:"#BF1363">Dear ${body.name},</h5>
          <p>Thank you for your enquiry. We are sorry you have been having difficulties contacting StreamPlay. One of our developer will contact you shortly on Email.</p>
          <br/>
          <p>Best regards,</p>
          <br />
          <h4 style="color:#BF1363;">StreamPlay Pvt Ltd.</h4>
          `,
        attachments: [
          {
            filename: "streamplay2.png",
            path: filePath + `/assets/streamplay2.png`,
          },
        ],
      };

      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });

      let result = await transporter.sendMail(mailOptions);
      await transporter.sendMail(replymailOptions);
      return {
        success: 200,
        result: JSON.parse(JSON.stringify(result)),
      };
    } catch (e) {
      return {
        success: 500,
        result: `failed to send mail... error: ${e}`,
      };
    }
  }

  //------------------------------------------------------------

  async function update({ isPresent, userId, updateKey, newValue }) {
    const db = await database;
    let result;
    try {
      if (updateKey === "subscribedTo") {
        if (isPresent)
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $pull: { subscribedTo: { $in: [newValue] } } }
            );
        else
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $push: { subscribedTo: { $each: [newValue] } } }
            );
      } else if (updateKey === "subscribedBy") {
        if (isPresent)
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $pull: { subscribedBy: { $in: [newValue] } } }
            );
        else
          await db
            .collection("users")
            .updateOne(
              { _id: db.makeId(userId) },
              { $push: { subscribedBy: { $each: [newValue] } } }
            );
      }
      result = await db.collection("users").findOne({ _id: db.makeId(userId) });
    } catch (e) {
      return {
        success: 500,
        error: "failed to update subscriber..",
      };
    }
    return {
      success: 200,
      result: JSON.parse(JSON.stringify(result)),
    };
  }

  //------------------------------------------------------------

  async function findByEmail({ email }) {
    const db = await database;
    const results = await db.collection("users").find({ email }).toArray();
    return JSON.parse(JSON.stringify(results));
  }

  //------------------------------------------------------------

  async function replaceWriters({ collection, userId, newUser }) {
    const db = await database;
    let results = await db
      .collection(collection)
      .updateMany(
        { "writer._id": userId },
        { $set: { writer: newUser } },
        { upsert: false }
      );
    return {
      success: 204,
      result: JSON.parse(JSON.stringify(results)),
    };
  }

  //------------------------------------------------------------

  function documentToContact({ _id: userId, ...doc }) {
    return makeUser({ userId, ...doc });
  }
}

const userList = makeUserList();

module.exports = userList;
