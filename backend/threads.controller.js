const Course = require("./courses.model");
const Major = require("./majors.model");
const Threads = require("./threads.model");
const User = require("./user.model");

const axios = require('axios');
const Queue = require('bull');
 

async function queryOpenAI(initialMessage, context) {
    try {
      const openaiApiKey = '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'; // Replace with your OpenAI API key
      const apiUrl = "https://api.openai.com/v1/chat/completions"
  
      // Make a POST request to the OpenAI API
      const prompt_ = initialMessage.replace(/@ai/g, '');
      const prompt = `${prompt_}`
 

var data = {
  "model": "gpt-3.5-turbo",
  "messages": [{"role":"user","content":`if needed refeence this past converstatio to ask questions${context}`},{"role": "user", "content": prompt}]
}
      const response = await axios.post(
        apiUrl,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
          },
        }
      );
        console.log(response.data.choices[0])
      // Extract the AI's response from the API response
      const aiResponse = response.data.choices[0].message.content;
  
      return aiResponse;
    } catch (error) {
      console.error('Error querying OpenAI:', error);
      throw error;
    }
  }
const aiResponses = [];

 
async function processAIResponse(message, context, receiver_id, sender_id, receiver_type, receiver_name) {
  try {
    const aiResponse = await queryOpenAI(message, context);

    // Save the AI response to the database with sender_id as 'ai' and receiver_name as 'ai'
    const aiMessage = new Threads({
      receiver_id,
      sender_id: sender_id,
      message: aiResponse,
      receiver_type,
      receiver_name: 'ai',
      isai: true,
    });

    await aiMessage.save();
  } catch (error) {
    console.error('Error processing AI response:', error);
  }
}

async function sendThread(req, res) {
  try {
    const { receiver_id, sender_id, message, receiver_type, receiver_name } = req.body;

    // Save the new message to the database
    const newMessage = new Threads({
      receiver_id,
      sender_id,
      message,
      receiver_type,
      receiver_name,
    });

    await newMessage.save();

    if (message.includes("@ai")) {
      const previousMessages = await Threads.find({ receiver_id, sender_id });
      const context = previousMessages.map((msg) => msg.message).join("\n");

       
      setTimeout(() => {
        processAIResponse(message, context, receiver_id, sender_id, receiver_type, receiver_name);
      }, 0);  
    }

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

   
  
  
  
  
  
  


  async function getThread(req, res) {
    try {
      const { receiver_id } = req.body;
  
      const messages = await Threads.find({ receiver_id }).sort({ date: 1 });
  
      
      const senderIds = [...new Set(messages.map(message => message.sender_id))];
  
      
      const users = await User.find({ _id: { $in: senderIds } });
  
      
      const userMap = {};
      users.forEach(user => {
        userMap[user._id.toString()] = user;
      });
  
      const data = { msgs: messages, users: userMap };
    //   console.log(data, 'this is the data');
      res.status(200).json(data);
    } catch (error) {
      console.error('Error retrieving thread:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  
function getThreadMajors(req,res){
    Major.find({}).then
    (majors=>{
    
        res.json(majors)
    })
    

}
function getThreadCourses(req,res){
    Course.find({}).then
    (courses=>{
        res.json(courses)
    })
    

}
module.exports = {
  getThread,
  sendThread,
  getThreadMajors,
    getThreadCourses

};
