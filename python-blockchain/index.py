import hashlib
import json
import datetime as date
import random
from flask import Flask, jsonify, request
from flask_cors import CORS

class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.hash_block()

    def hash_block(self):
        sha = hashlib.sha256()
        sha.update(
            str(self.index).encode("utf8") +
            str(self.timestamp).encode("utf8") +
            str(self.data).encode("utf8") +
            str(self.previous_hash).encode("utf8")
        )
        return sha.hexdigest()

#Create the Genesis block
def create_genesis_block():
    return Block(0, date.datetime.now(), "Genesis Block", "0")

#new block based on the previous one
def next_block(last_block, data):
    this_index = last_block.index + 1
    this_timestamp = date.datetime.now()
    this_hash = last_block.hash
    return Block(this_index, this_timestamp, data, this_hash)

blockchain = [create_genesis_block()]
previous_block = blockchain[0]
state = {}
users = {}

def update_state(txn, state):
    state = state.copy()
    for user_id, amount in txn.items():
        userAmount = int(state.get(user_id, 0))
        state[user_id] = userAmount  + amount
    return state

def is_valid_txn(txn, state):
    if sum(txn.values()) != 0:
        return False
    for user_id, amount in txn.items():
        amputUser = state.get(str(user_id), 0)
        if int(amputUser) + amount < 0:
            return False
    return True

app = Flask(__name__)
CORS(app)

@app.route('/blockchain', methods=['GET'])
def get_blockchain():
    chain_data = [block.__dict__ for block in blockchain]
    return jsonify(chain_data)

@app.route('/transaction', methods=['POST'])
def add_transaction():
    global state 
    global previous_block

    txn = request.get_json()
    print(txn)
    if not is_valid_txn(txn, state):
        return jsonify({"message": "Invalid transaction"}), 400
    
    #Update the state and create a new block
    state = update_state(txn, state)
    data = {"transactions": txn}
    new_block = next_block(previous_block, data)
    blockchain.append(new_block)
    previous_block = new_block
    return jsonify({"message": "Transaction added", "block": new_block.__dict__})

@app.route('/state', methods=['GET'])
def get_state():
    #Return a list of users with their id, name, and balance
    return jsonify([
        {"id": user_id, "name": name, "balance": state.get(user_id, 0)}
        for user_id, name in users.items()
    ])

@app.route('/add_user', methods=['POST'])
def add_user():
    user_data = request.get_json()
    name = user_data.get("name")
    balance = user_data.get("balance", 0)
    if not name:
        return jsonify({"message": "Name is required"}), 400
    user_id = str(len(users) + 1)
    users[user_id] = name
    state[user_id] = balance  #Set the balance for the new user
    return jsonify({"message": "User added", "user_id": user_id, "name": name, "balance": balance})


if __name__ == '__main__':
    app.run(debug=True)
