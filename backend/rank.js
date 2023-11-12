const mongoose = require('mongoose');
const Threads = require('./models/threads'); 
const User = require('./models/user'); 
const fs = require('fs');
const cron = require('node-cron');
const mongoose = require('mongoose');
const Threads = require('./models/threads'); 
const User = require('./models/user'); 


async function calculateRankings() {
  try {
    const users = await User.find({});
    
    
    const userRankings = [];

    
    for (const user of users) {
      
      const messageCount = await Threads.countDocuments({ sender_id: user._id });

      
      const activityScore = calculateUserActivity(user);

      
      const interactionScore = calculateInteractionHistory(user);

      
      const overallScore = messageCount * 0.5 + activityScore * 0.3 + interactionScore * 0.2;

      
      userRankings.push({
        user,
        messageCount,
        activityScore,
        interactionScore,
        overallScore,
      });
    }

    
    userRankings.sort((a, b) => b.overallScore - a.overallScore);

    return userRankings;
  } catch (error) {
    console.error('Error calculating rankings:', error);
    throw error;
  }
}

 
  function calculateUserActivity(user) {
    const loginFrequencyScore = calculateLoginFrequencyScore(user.loginHistory)
    const postActivityScore = calculatePostActivityScore(user.postFrequency);
    const overallActivityScore = loginFrequencyScore * 0.4 + postActivityScore * 0.6;
    return overallActivityScore;
  }
  function calculateLoginFrequencyScore(loginHistory) {
    let loginScore = 0;
    loginHistory.forEach((entry) => {
      if (entry.duration >= 60 && entry.date.startsWith('2023')) {
        
        loginScore += 2;
      } else if (entry.duration >= 30) {
        loginScore += 1;
      }
    });
  
    return loginScore;
  }
  function calculatePostActivityScore(postFrequency) {
    let postScore = 0;  
    if (postFrequency.daily >= 5) {
      postScore += 2;
    }
    if (postFrequency.weekly >= 30) {
      postScore += 1;
    }
    return postScore;
  } 
  function calculateInteractionHistory(user) {
    
    const responseScore = user.interactions.responses;
    const likesScore = user.interactions.likes;
    const commentsScore = user.interactions.comments;  
    const overallInteractionScore = responseScore * 0.4 + likesScore * 0.3 + commentsScore * 0.3;
  
    return overallInteractionScore;
  }
  
 
 
  
  class UserActivityAnalyzer {
    constructor() {}
  
    async fetchUserData(userId) {
      try {
        // Fetch user data from MongoDB based on userId
        const user = await UserModel.findOne({ id: userId });
        return user;
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    }
  
    calculateUserActivity(user) {
 
      const loginFrequencyScore = this.calculateLoginFrequencyScore(user.loginHistory);
      const postActivityScore = this.calculatePostActivityScore(user.postFrequency);
        const overallActivityScore = loginFrequencyScore * 0.4 + postActivityScore * 0.6;
  
      return overallActivityScore;
    }
  
    calculateLoginFrequencyScore(loginHistory) {      let loginScore = 0;
        loginHistory.forEach((entry) => {
        if (entry.duration >= 60 && entry.date.startsWith('2023')) {          loginScore += 2;
        } else if (entry.duration >= 30) {
          loginScore += 1;
        }
      });
  
      return loginScore;
    }
  
    calculatePostActivityScore(postFrequency) {
      let postScore = 0;
        if (postFrequency.daily >= 5) {
        postScore += 2;
      }
      if (postFrequency.weekly >= 30) {
        postScore += 1;
      }
  
      return postScore;
    }
  
    calculateInteractionHistory(user) {
      const responseScore = user.interactions.responses;
      const likesScore = user.interactions.likes;
      const commentsScore = user.interactions.comments;
        const overallInteractionScore = responseScore * 0.4 + likesScore * 0.3 + commentsScore * 0.3;
  
      return overallInteractionScore;
    }
  
    async analyzeUser(userId) {
      try {
        const user = await this.fetchUserData(userId);
        if (!user) {
          throw new Error('User not found.');
        }
  
        const userActivityScore = this.calculateUserActivity(user);
        const interactionHistoryScore = this.calculateInteractionHistory(user);
  
        return {
          userId: user.id,
          userActivityScore,
          interactionHistoryScore,
        };
      } catch (error) {
        console.error('Error analyzing user:', error);
        throw error;
      }
    }
  }
  
   
  
class Algo {
    constructor() {
      this.weights = null;
      this.bias = null;
    }
    train(X, y, learningRate, epochs) {
      const numSamples = X.length;
      const numFeatures = X[0].length;
      this.weights = new Array(numFeatures).fill(0);
      this.bias = 0;
      for (let epoch = 0; epoch < epochs; epoch++) {
        let biasGradient = 0;
        const weightsGradient = new Array(numFeatures).fill(0);
        for (let i = 0; i < numSamples; i++) {
          const prediction = this.predict(X[i]);
          const error = prediction - y[i];
  
          biasGradient += (1 / numSamples) * error;
          
          for (let j = 0; j < numFeatures; j++) {
            weightsGradient[j] += (1 / numSamples) * error * X[i][j];
          }
        }
        this.bias -= learningRate * biasGradient;
        for (let j = 0; j < numFeatures; j++) {
          this.weights[j] -= learningRate * weightsGradient[j];
        }
      }
    }
    predict(input) {
      if (!this.weights || !this.bias) {
        throw new Error('Model not trained.');
      }
      let prediction = this.bias;
      for (let i = 0; i < this.weights.length; i++) {
        prediction += this.weights[i] * input[i];
      }
  
      return prediction;
    }
  }
function saveModelToFile(model, filename) {
  const modelData = {
    weights: model.weights,
    bias: model.bias,
  };
  fs.writeFileSync(filename, JSON.stringify(modelData));
  console.log(`Model saved to ${filename}`);
}

function loadModelFromFile(filename, model) {
  if (fs.existsSync(filename)) {
    const modelData = JSON.parse(fs.readFileSync(filename, 'utf8'));
    model.weights = modelData.weights;
    model.bias = modelData.bias;
    console.log(`Model loaded from ${filename}`);
  }
}
cron.schedule('0 0 * * *', async () => {
  console.log('Starting daily model training...');

  const model = new YourCustomRegressionModel(); 
  loadModelFromFile('model.json', model); 

  
  try {
    const userRankings = await calculateRankings();
    
    

    
    saveModelToFile(model, 'model.json');
  } catch (error) {
    console.error('Error during model training:', error);
  }

  console.log('Daily model training completed.');
});



