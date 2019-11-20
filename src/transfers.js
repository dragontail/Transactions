var http = require('http');
var dt = require('./module');
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

var options = {
	hostname: 'localhost',
	port: 8080,
	path: '/transfer',
	method: 'GET'
};

function databaseConnect() {
	var con = mysql.createConnection({
		host: 'localhost',
		user: 'test',
		password: 'test',
		database: 'banking'
	});

	return con;
}

app.get('/transfer', (req, res) => {
	res.send("Testing");
});

app.post('/transfer', (req, res) => {
	var from = req.body.from;
	var to = req.body.to;
	var amount = req.body.amount;

	if (from == undefined || to == undefined || amount == undefined) {
		res.send("One of your fields is undefined.");
		console.error("Undefined field was given.");
	}

	console.log('from: ' + from);
	console.log('to: ' + to);
	console.log('amount: ' + amount);

	con = databaseConnect();

	con.connect(err => {
		if (err) {
			console.error("error connecting: " + err.stack);
			return;
		}
		console.log("connected as id: " + con.threadId);
	});

	var subtract = "UPDATE balances SET balance = balance - " + amount + " WHERE account_number = " + from;
	var insertFrom = "INSERT INTO transactions (amount, account_number) VALUES (-" + amount + ", " + from + ")";
	var add = "UPDATE balances SET balance = balance + " + amount + " WHERE account_number = " + to;
	var insertTo = "INSERT INTO transactions (amount, account_number) VALUES (" + amount + ", " + to + ")";

	response = { 
		id: 0, 
		from: {
			id: from,
			balance: 0
		},
		to: {
			id: to,
			balance: 0
		},
		transferred: amount
	};


	con.beginTransaction(err => {
		if (err) throw err;
		con.query(subtract, (err, result) => {
			if (err) {
				con.rollback(function() {
					throw err;
				});
			}

			var log = result.insertId;

			con.query(insertFrom, (err, result) => {
				if (err) {
					con.rollback(function() {
						throw err;
					});
				}

				con.commit(err => {
					if (err) {
						con.rollback(function() {
							throw err;
						});
					}
				});
			});
		});

		con.query(add, (err, result) => {
			if (err) {
				con.rollack(function() {
					throw err;
				});
			}

			con.query(insertTo, (err, result) => {
				if (err) {
					con.rollback(function() {
						throw err;
					});
				}

				con.commit(err => {
					if (err) {
						con.rollback(function() {
							throw err;
						});
					}
				});
			});
		});

		var balanceTo = "SELECT balance FROM balances WHERE account_number = " + to;
		var balanceFrom = "SELECT balance FROM balances WHERE account_number = " + from;

		con.query(balanceTo, (err, result) => {
			if (err) throw err;

		})
	});
});

app.listen(port);
console.log("Server started at http://localhost:" + port);