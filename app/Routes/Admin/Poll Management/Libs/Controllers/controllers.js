const pollData = require('../../../../../Model/pollData');
const adminCred = require('../../../../../Model/adminCred');
const userPollStates = require('../../../../../Model/userPollStates');
const controllers = {};
const cloudinary = require('cloudinary').v2;
require('../../../../../../env');

controllers.getAdminPollData = (req, res) => {
  let date = new Date();
  date = date.toISOString().slice(0, 10);
  try {
    pollData.deleteMany({ expiryDate: date }, (err, result) => {
      if (err) {
        res.send({ error: 'Something went wrong!' });
      } else {
      }
    });
    const query = [{
      $match: {
        publisherId: req.token.id,
      },
    },
    {
      $unwind: {
        path: '$answerStates',
      },
    },
    {
      $sort: {
        'answerStates.submission': -1,
      },
    },
    {
      $group: {
        _id: '$_id',
        answerStates: { $push: '$answerStates' },
        publisherId: { $addToSet: '$publisherId' },
        backgroundImgPath: { $addToSet: '$backgroundImgPath' },
        question: { $addToSet: '$question' },
        totalSubmission: { $addToSet: '$totalSubmission' },
      },
    },
    {
      $unwind: {
        path: '$publisherId',
      },
    },
    {
      $unwind: {
        path: '$backgroundImgPath',
      },
    },
    {
      $unwind: {
        path: '$question',
      },
    },
    {
      $unwind: {
        path: '$totalSubmission',
      },
    },
    {
      $sort: {
        totalSubmission: -1,
      },
    },
    ];
    pollData.aggregate(query, (err, result) => {
      if (err) {
        res.send({ error: 'Something went wrong!' });
      } else {
        if (result.length === 0) {
          adminCred.find({ _id: req.token.id }, (err, result) => {
            if (err) {
              res.send({ error: 'Something went wrong!' });
            } else {
              res.send({ data: result });
            }
          });
        } else {
          res.send({ data: result });
        }
      }
    });
  } catch (error) {
    return error;
  }
};

controllers.publishPoll = (req, res) => {
  try {
    let file = req.file;
    const question = req.body.sQuestion;
    let option = req.body.options;
    option = option.split(',');
    const expiryDate = req.body.dDate;
    const answerStates = [];
    const totalSubmission = 0;
    // This is for formatting according to schema
    option.forEach((ele, index) => {
      const tempObj1 = { option: ele, submission: 0, percentage: 0 };
      answerStates.push(tempObj1);
    });
    if (req.body.file) {
      file = req.body.file;
      const tempObj = {
        publisherId: req.token.id,
        backgroundImgPath: file,
        question: question,
        expiryDate: expiryDate,
        answerStates: answerStates,
        totalSubmission: totalSubmission,
      };
      pollData.insertMany(tempObj, (err, result) => {
        if (err) {
          res.send({ error: 'Something went wrong!!' });
        } else {
          res.send({ message: 'Poll Published' });
        }
      });
    } else {
      cloudinary.uploader.upload(file.path)
          .then((result) => {
            const tempObj = {
              publisherId: req.token.id,
              backgroundImgPath: result.secure_url,
              question: question,
              expiryDate: expiryDate,
              answerStates: answerStates,
              totalSubmission: totalSubmission,
            };
            pollData.insertMany(tempObj, (err, result) => {
              if (err) {
                res.send({ error: 'Something went wrong!!' });
              } else {
                res.send({ message: 'Poll Published' });
              }
            });
          },
          )
          .catch((err) => {
            if (err) {
              res.send({ error: 'Something went wrong!!' });
            }
          });
    }
  } catch (error) {
    return {};
  }
};

controllers.deletePoll = (req, res) => {
  try {
    const pollId = req.body.pollId;
    pollData.deleteOne({ _id: pollId }, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ message: 'Poll Deleted' });
      }
    });
    userPollStates.updateMany({ pollsSubmitted: { $all: [pollId] } }, { $pull: { pollsSubmitted: pollId } }, (err) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(result)
      }
    });
  } catch (error) {
    return {};
  }
};

controllers.editPoll = (req, res) => {
  console.log(req.body);
  res.send(req.body);
  // try {
  //   const pollId = req.body.pollId
  //   let file = req.file
  //   const question = req.body.sQuestion
  //   let option = req.body.options
  //   option = option.split(',')
  //   const expiryDate = req.body.dDate
  //   const answerStates = []
  //   const totalSubmission = 0
  //   // This is for formatting according to schema
  //   for (const values in option) {
  //     const tempObj1 = { option: option[values], submission: 0, percentage: 0 }
  //     answerStates.push(tempObj1)
  //   }
  //   if (req.body.file) {
  //     file = req.body.file
  //     const tempObj = {
  //       $set: {
  //         publisherId: req.token.id,
  //         backgroundImgPath: file,
  //         question: question,
  //         expiryDate: expiryDate,
  //         answerStates: answerStates,
  //         totalSubmission: totalSubmission
  //       }
  //     }
  //     pollData.findOneAndUpdate({ pollId }, tempObj, (err, result) => {
  //       if (err) {
  //         res.send({ error: 'Something went wrong!!' })
  //       } else {
  //         res.send({ message: 'Poll Updated' })
  //       }
  //     })
  //   } else {
  //     cloudinary.uploader.upload(file.path)
  //       .then((result) => {
  //         const tempObj = {
  //           $set: {
  //             publisherId: req.token.id,
  //             backgroundImgPath: result.secure_url,
  //             question: question,
  //             expiryDate: expiryDate,
  //             answerStates: answerStates,
  //             totalSubmission: totalSubmission
  //           }
  //         }
  //         pollData.findOneAndUpdate({ pollId }, tempObj, (err, result) => {
  //           if (err) {
  //             res.send({ error: 'Something went wrong!!' })
  //           } else {
  //             res.send({ message: 'Poll Updated' })
  //           }
  //         })
  //       }
  //       )
  //       .catch((err) => {
  //         if (err) {
  //           res.send({ error: 'Something went wrong!!' })
  //         }
  //       })
  //   }
  // } catch (error) {
  //   return {}
  // }
};
controllers.test = (req, res) => {
  console.log(req.file.path);
  cloudinary.uploader.upload(req.file.path, { resource_type: 'video' }).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log('err', err);
  });
};
module.exports = controllers;
