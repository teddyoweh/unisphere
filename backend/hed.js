const { Client, CryptoTransferTransaction, AccountId, Hbar } = require("@hashgraph/sdk");
const mongoose = require('mongoose');
const Threads = require('./models/threads');
const User = require('./models/user');
const fs = require('fs');
const cron = require('node-cron');


const ACCOUNT_ID = "0.0.12345"; 
const PRIVATE_KEY = "302e020100300506032b6570042204202f50848d97f31e411c9a14916a4d22d9d784b5c89c9d6a33a1d9516b5e6c1d96"; // Replace with a valid private key
;

async function sendHbarTransaction(recipientAccountId, amount) {
  try {
    const client = Client.forTestnet(); 
    client.setOperator(AccountId.fromString(ACCOUNT_ID), PRIVATE_KEY);

    const senderAccountId = client.operatorAccountId;
    const senderAccount = await AccountId.fromString(senderAccountId);

    const transactionId = await new CryptoTransferTransaction()
      .addSender(senderAccount, Hbar.fromTinybars(amount))
      .addRecipient(AccountId.fromString(recipientAccountId), Hbar.fromTinybars(amount))
      .execute(client);

    const receipt = await transactionId.getReceipt(client);

    console.log(`Hbar transfer successful! Transaction ID: ${transactionId.toString()}`);
    return true;
  } catch (error) {
    console.error("Error sending Hbars:", error);
    return false;
  }
}

async function calculateRankingsAndReward() {
  try {
    const users = await User.find({});

    const userRankings = [];

    for (const user of users) {
      const messageCount = await Threads.countDocuments({ sender_id: user._id });
      

      const overallScore = messageCount * 0.5 +1    ;

      userRankings.push({
        user,
        messageCount,
        overallScore,
      });
    }

    userRankings.sort((a, b) => b.overallScore - a.overallScore);

    
    const topUsersToReward = 3; 
    const hbarAmountToReward = 100; 

    for (let i = 0; i < topUsersToReward && i < userRankings.length; i++) {
      const user = userRankings[i].user;
      const userId = user._id; 
      const recipientAccountId = "RECIPIENT_HEDERA_ACCOUNT_ID"; 

      
      const success = await sendHbarTransaction(recipientAccountId, hbarAmountToReward);
      if (success) {
        console.log(`Rewarded user ${userId} with ${hbarAmountToReward} Hbars.`);
      } else {
        console.log(`Failed to reward user ${userId}.`);
      }
    }
  } catch (error) {
    console.error('Error calculating rankings and rewarding:', error);
  }
}


cron.schedule('0 0 * * *', async () => {
  console.log('Starting daily ranking calculation and reward...');

  await calculateRankingsAndReward();

  console.log('Daily ranking calculation and reward completed.');
});
