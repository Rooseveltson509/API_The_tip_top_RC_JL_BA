require("dotenv").config();
let bcrypt = require("bcryptjs");
let jwtUtils = require("../utils/jwt.utils");
let models = require("../models");
var asyncLib = require("async");
const { randomCode } = require("../funcs/functions");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
  createTicket: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    let nbr = 100;
    var infuseur = (60 * nbr) / 100;
    var detoxOuInfusion = (20 * nbr) / 100;
    var signature = (10 * nbr) / 100;
    var coffre39 = (6 * nbr) / 100;
    var coffre69 = (4 * nbr) / 100;
    let verifTicketCode = randomCode(
      10,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );

    if (userId <= 0) {
      return res.status(400).json({ error: "missing parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId, role: "admin" },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            for (let i = 1; i <= infuseur; i++) {
              models.Ticket.create({
                adminId: userId,
                gain: "infuseur à thé",
                code: randomCode(
                  10,
                  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                ),
              })
                .then(function (newTicket) {
                  done(newTicket);
                })
                .catch(function (err) {
                  return res.status(500).json({ error: err });
                });
            }
            for (let b = 1; b <= detoxOuInfusion; b++) {
              models.Ticket.create({
                adminId: userId,
                gain: "une boite de 100g d’un thé détox ou d’infusion",
                code: randomCode(
                  10,
                  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                ),
              })
                .then(function (newTicket) {
                  done(newTicket);
                })
                .catch(function (err) {
                  return res.status(500).json({
                    error: "unable to adding ticket: thé detoxOuInfusion",
                  });
                });
            }
            for (let s = 1; s <= signature; s++) {
              models.Ticket.create({
                adminId: userId,
                gain: "une boite de 100g d’un thé signature",
                code: randomCode(
                  10,
                  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                ),
              })
                .then(function (newTicket) {
                  done(newTicket);
                })
                .catch(function (err) {
                  return res
                    .status(500)
                    .json({ error: "unable to adding ticket: thé signature" });
                });
            }
            for (let c = 1; c <= coffre39; c++) {
              models.Ticket.create({
                adminId: userId,
                gain: "un coffret découverte d’une valeur de 39€",
                code: randomCode(
                  10,
                  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                ),
              })
                .then(function (newTicket) {
                  done(newTicket);
                })
                .catch(function (err) {
                  return res
                    .status(500)
                    .json({ error: "unable to adding ticket: coffre 39€" });
                });
            }
            for (let d = 1; d <= coffre69; d++) {
              models.Ticket.create({
                adminId: userId,
                gain: "un coffret découverte d’une valeur de 69€",
                code: randomCode(
                  10,
                  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                ),
              })
                .then(function (newTicket) {
                  done(newTicket);
                })
                .catch(function (err) {
                  return res
                    .status(500)
                    .json({ error: "unable to adding ticket: coffre 69€" });
                });
            }
          } else {
            res.status(403).json({ error: "ACCESS DENIED." });
          }
        },
      ],
      function (newTicket) {
        if (newTicket) {
          return res.status(201).json(newTicket);
        } else {
          return res.status(500).json({ error: "cannot post property" });
        }
      }
    );
  },

  // Find User Ticket By code
  getTicketByCode: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);
    var code = req.params.code;

    if (userId <= 0) {
      return res.status(400).json({ error: "missing parameters" });
    }

    models.Employe.findOne({
      where: { id: userId },
    })
      .then(function (employe) {
        if (employe) {
          models.Ticket.findOne({
            attributes: ["userId", "gain", "etat", "code"],
            where: { code: code },
            include: [
              {
                model: models.User,
                attributes: [
                  "id",
                  "first_name",
                  "last_name",
                  "email",
                  "city",
                  "address",
                  "zipCode",
                ],
              },
            ],
          })
            .then(function (ticket) {
              if (ticket) {
                return res.status(200).json(ticket);
              } else {
                return res.status(404).json({ error: "Ticket not found" });
              }
            })
            .catch(function (err) {
              res.status(404).json({ error: "cannot fetch Ticket." });
            });
        } else {
          return res.status(404).json({ error: "Accès non autorisé....." });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "cannot fetch Ticket..." });
      });
  },

    // Find User Ticket By store
    getAllTicketsByStore: function (req, res) {
      // Getting auth header
      var headerAuth = req.headers["authorization"];
      var userId = jwtUtils.getUserId(headerAuth);
      var store = req.params.store;
  
      if (userId <= 0) {
        return res.status(400).json({ error: "missing parameters" });
      }
  
      models.Employe.findOne({
        where: { id: userId },
      })
        .then(function (employe) {
          if (employe) {
            models.Ticket.findAll({
              attributes: ["userId", "gain", "etat", "magasin"],
              where: { magasin: store },
              include: [
                {
                  model: models.User,
                  attributes: [
                    "id",
                    "first_name",
                    "last_name",
                    "email",
                    "city",
                    "address",
                    "zipCode",
                  ],
                },
              ],
            })
              .then(function (ticket) {
                if (ticket) {
                  return res.status(200).json(ticket);
                } else {
                  return res.status(404).json({ error: "Store not found." });
                }
              })
              .catch(function (err) {
                res.status(404).json({ error: "cannot fetch Ticket." });
              });
          } else {
            return res.status(404).json({ error: "Accès non autorisé....." });
          }
        })
        .catch(function (err) {
          res.status(500).json({ error: "cannot fetch Ticket..." });
        });
    },

  // Find all Tickets from user
  getAllTicketsFromUser: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId <= 0) {
      return res.status(400).json({ error: "missing parameters" });
    }

    models.User.findOne({
      where: { id: userId},
    })
      .then(function (user) {
        if (user) {
          models.Ticket.findAll({
            attributes: ["gain", "etat", "code", "validateAt", "createdAt"],
            order: [["validateAt", "DESC"]],
            where: { userId: userId },
          })
            .then(function (ticket) {
              if (ticket) {
                return res.status(200).json(ticket);
              } else {
                return res.status(404).json({ error: "Ticket not found" });
              }
            })
            .catch(function (err) {
              res.status(404).json({ error: "cannot fetch Ticket......" });
            });
        } else {
          return res.status(404).json({ error: "Accès non autorisé....." });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "cannot fetch Ticket..." });
      });
  },
  // Find User Ticket By code
  createTicketForUser: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    let buyer = req.body.buyer;

    if (userId <= 0) {
      return res.status(400).json({ error: "missing parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "unable to verify user " + userId });
            });
        },
        function (userFound, done) {
          if (userFound) {
            if (buyer >= 49) {
              models.Ticket.findOne({
                order: Sequelize.fn("RAND"),
                where: {
                  etat: {
                    [Op.like]: "%non-distribue%",
                  },
                },
              })
                .then(function (ticketFound) {
                  done(null, ticketFound);
                })
                .catch(function (err) {
                  res.status(500).json({ error: "cannot fetch ticket" });
                });
            } else {
              return res.status(404).json({
                error:
                  "Vous avez acheté pour: " +
                  buyer +
                  "€ plus de " +
                  (49 - buyer) +
                  "€ et vous pouvez gagner un lot...",
              });
            }
          } else {
            res.status(404).json({ error: "user not found" });
          }
        },
        function (ticketFound, done) {
          if (ticketFound) {
            ticketFound
              .update({
                userId: userId,
                etat: "distribue",
                where: { id: ticketFound.id },
              })
              .then(function () {
                done(ticketFound);
              })
              .catch(function (err) {
                res.status(500).json({ error: "cannot update ticket" });
              });
          } else {
            res.status(404).json({ error: "ticket not found..." });
          }
        },
      ],
      function (ticketFound) {
        if (ticketFound) {
          return res.status(200).json({ ticketCode: ticketFound.code });
        } else {
          return res.status(500).json({ error: "cannot update ticket" });
        }
      }
    );
  },
};
