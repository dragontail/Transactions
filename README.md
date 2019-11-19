# Transactions

Coding Challenge #3

## Table of Contents
1. [Summary](#summary)
2. [Approach](#approach)
3. [Usage](#usage)

## Summary

The purpose of this coding challenge is to design an API that allows for the transfer of money between two bank accounts.

The bank's database has the following structure:
```
TABLE transactions
	- reference (unique)
	- amount
	- account number
```

The transactions table registers any transaction in an account (i.e. Person A paid $20 for a movie).
```
TABLE balances
	- account number (unique)
	- balance
```

The balances table represents the account balance of customers (i.e. Person A has $5000 in account).

The bank uses a relational database (MySQL) to store information. The task is to write the ```transfer``` API method.