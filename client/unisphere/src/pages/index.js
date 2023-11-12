import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Heart, SearchNormal1, Setting2 } from 'iconsax-react'
import { useEffect, useState } from 'react'
import college_majors_ from './data/majors.json'
import college_courses_ from './data/courses.json'
import threadApi from './api/thread.api'
import io from 'socket.io-client';
const inter = Inter({ subsets: ['latin'] })
const socket = io('http://localhost:3001');

const RenderInput = ({ handleSend, message, setMessage,topic }) => {
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);

    if (inputValue.includes('@ai ')) {
      setShowModal(false);
    } else if (inputValue.includes('@ai')) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  return (
    <div className='popup-div'>
      <input
        type="text"
        placeholder="What's going on?"
        value={message}
        onSubmit={(e) => handleSend(e)}
        onChange={handleChange}
      />

      {showModal && (
        <div className="popup-modal">
          <p>I am an AI chatbot with expertise in both general conversation handling for group chats and a specialized focus on  <b>{topic}</b> related topics. Please don't hesitate to ask me any questions or seek assistance on these subjects—I'm here to help! </p>
        </div>
      )}

      <style jsx>{`
        
      `}</style>

     
    </div>
  );
};
 

function RenderThread({receiverId,receiver,receiver_type}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(null);
  const [user, setUser] = useState(null);
  console.log({
    receiverId,receiver,receiver_type
    
  })
  const handleChange = (event) => {
    setMessage(event.target.value);
  };
  useEffect(() => {
     if (typeof window !== 'undefined') {
      const user_ = JSON.parse(localStorage.getItem('user'));
      setUser(user_);
  
    }
  }, []); 
  function getName(dat){
    if(receiver_type=='Majors'){
      return dat.major
    }
    else{
      return dat.course_name
    }
  }
  const handleSend = async (e) => {
    e.preventDefault();
    try {
      
      await threadApi.sendThread({
        receiver_id: receiverId, 
        sender_id: user._id, 
        message: message,
        receiver_type:receiver_type,
        receiver_name:getName(receiver)

      });

      
      setMessage('');

      
      await fetchMessages(receiverId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchMessages = async (receiverId) => {
    try {
      
      const response = await threadApi.getThread(receiverId, user._id); 
      setMessages(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  
  useEffect(() => {
    fetchMessages(receiverId); 
  }, [receiverId, messages]);
  function formatMsgDate(dateParam) {
    const currentDate = new Date();
    const inputDate = new Date(dateParam);
  
    const differenceInMs = currentDate.getTime() - inputDate.getTime();
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  
    if (differenceInDays === 0) {
      const timeOptions = {hour: "2-digit", minute: "2-digit"};
      return inputDate.toLocaleTimeString("en-US", timeOptions);
    } else if (differenceInDays === 1) {
      return "Yesterday";
    } else if (differenceInDays > 1 && differenceInDays < 365) {
      const day = inputDate.getDate();
      const month = inputDate.getMonth() + 1;
      const year = inputDate.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (differenceInDays >= 365) {
      const month = inputDate.getMonth() + 1;
      const year = inputDate.getFullYear();
      return `${month}/${year}`;
    }
  }
  const ws = new WebSocket('ws://localhost:3001');  

  useEffect(() => {
    ws.onopen = () => {
      console.log('WebSocket client connected');
    };

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    ws.onclose = () => {
      console.log('WebSocket client disconnected');
    };

    return () => {
      ws.close();
    };
  }, [ws]);

  return (
    <div className="app-content">
      <div className="chat-body">
      {
        messages&&
        messages.msgs.map((msg) => {
          const stat = msg.sender_id === user._id && msg.isai !=true
          const bubble_css = msg.isai ==true ? 'bubble ai' : 'bubble';
          const op = messages.users[msg.sender_id]
          const name =op!=undefined? msg.isai==true?'AI'         :   op.firstname+' '+op.lastname:''
          let css = msg.sender_id === user._id ? 'chat-item right' : 'chat-item left';
          css = msg.isai==true?'chat-item left':css
   
          return (
            <div className={css}>
              {!stat&&
              <label className='nametag'>
                {name}
              </label>
              }
              <div className={bubble_css}>
                <label htmlFor="">
                  {msg.message}
                </label>
              </div>
              <label htmlFor="" className='date'>
                {formatMsgDate(msg.date)}
              </label>
            </div>
          )
        })

      }
      
      </div>
      <div className="chat-input-box">
        <form className="chat-input"    onSubmit={(e)=>handleSend(e)}>
          <div className="input">
           
            <RenderInput topic={getName(receiver)} message={message} setMessage={setMessage} handleSend={handleSend} />
          </div>
          <div className="send">
            <button className="btn" onClick={(e)=>handleSend(e)}>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
const SkeletonLoading = ({num}) => {
  return (
    <div className="skeleton-loading">
      {
        [...Array(num)].map((e, i) => {

   
          return (
            <div className="skeleton-item" key={i}></div>
          )
          }
        )
      
      }
 
     
    </div>
  );
};
export default function Home() {
  
  function createMajorHashMap(data) {

    const majorHashMap = {};
  
    for (const item of data) {
      const major = item.major;
      const course = {
        course_number: item.course_number,
        course_name: item.course_name,
      };
  
      if (!majorHashMap[major]) {
        majorHashMap[major] = [course];
      } else {
        majorHashMap[major].push(course);
      }
    }
  
    return majorHashMap;
  }

 
  const filters = ['Majors','Courses']
  const [filter, setFilter] = useState(filters[0])
  const [selected, setSelected] = useState(null)
  const [searchQuery, setSearchQuery] = useState('');
  
  
  const [college_majors, setCollege_majors_] = useState(null);
  const [college_courses, setCollege_courses] = useState(null);

  async function getData(){
    const majors =  await threadApi.getThreadMajors()

    const courses =  await threadApi.getThreadCourses()
    console.log(courses)
    setCollege_courses(createMajorHashMap(courses))
    setCollege_majors_(majors)



  }

  useEffect(() => {
    getData()
  },[])
  function getName(dat){
    if(filter=='Majors'){
      return dat.major
    }
    else{
      return dat.course_name
    }
  }
  const [searchResults, setSearchResults] = useState([]); // Store search results

 
  const handleSearch = (e) => {
     
    setSearchQuery(e)
    if (filter === 'Majors') {
   
      const filteredMajors = college_majors.filter((major) =>
        major.major.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredMajors);
    } else if (filter === 'Courses') {
      
      const filteredCourses = {};

    for (const majorName in college_courses) {
      const filteredMajorCourses = college_courses[majorName].filter((course) =>
        course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.course_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
     
      if (filteredMajorCourses.length > 0) {
        filteredCourses[majorName] = filteredMajorCourses;
      }
    }


      setSearchResults(filteredCourses);
    }
  };

  // useEffect(() => {
  //   // Update search results whenever searchQuery changes
  //   handleSearch('');
  // }, [searchQuery]);
  const majoruse = searchQuery.length > 0 ? searchResults : college_majors;
  const courseuse = searchQuery.length > 0 ? searchResults : college_courses;
  return (
<div className='body'>
  <div className="sidebar">
    <div className="top_i">
    <div className="logo">
    UNISPHERE
    </div>
    <div className="lil">
          {
            filters.map((fil, index) => (
              <div className={`item ${filter === fil ? 'active' : ''}`} key={index} onClick={() => setFilter(fil)}>
                <label htmlFor="">{fil}</label>
              </div>
            ))
          }
        </div>
        <div className="search">
        <SearchNormal1 size="22" color="#bbb"/>
          <input type="text" placeholder='Search Majors & Courses' 
          
          value={searchQuery
          }
        
          onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        </div>
    <div className="sidebar-main">
      <div className="sec">
      {
        filter=='Majors'&&

        <div className="items">
      
          {
            college_majors==null?
            <SkeletonLoading num={50}/>
            :
            majoruse.map((major, index) => (
              <div className={major==selected?"item active ":"item"} key={index} onClick={()=>setSelected(major)} >
                <label htmlFor="">{major.major}</label>
              </div>
            ))
          }
        </div>
              }
                {
        filter=='Courses'&&

        <div className="items">

      
          {
            Object.keys(college_courses).map((major_name, index) => (
              <div>
                <div className="item-head">
                <label htmlFor="">{major_name}</label>
                <div className="line"></div>
                </div>
              {
            college_courses[major_name].map((course, index) => {

      
              return (
                <div className={course==selected?"item active ":"item"} key={index} onClick={()=>setSelected(course)} >
                <label htmlFor="">{course.course_name}</label>
              </div>
              )})
              }
             
              </div>
            ))
          }
        </div>
              }

      </div>
    </div>
  </div>
  <div className="app">
    {/* <div className="nav">
      <div className="left">
        <div className="search">
        <SearchNormal1 size="22" color="#bbb"/>
          <input type="text" placeholder='Search Groups, Majors' />
        </div>
      </div>
      <div className='right'>

      </div>
    </div> */}
    <div className="app_body">
      <div className="main-app">
        <div className="title">
         
        {
            selected!=null?
           
 
            <label htmlFor="">

{getName(selected)}
 
            </label>:
 
                 <label htmlFor="">
                  Selected Thread
</label>
          }
          <div className="right">
          <div className="search">
        <SearchNormal1 size="22" color="#333"/>
          <input type="text" placeholder='Search Chats, Messages' />
        </div>
        {/* <div className="circle">
          <Setting2 size="22" color="#333" e/>
        </div> */}
        <div className="oval">
       <label htmlFor="">
        Join
       </label>
        </div>
          </div>
        </div>
        {
          selected!=null &&
    
     <RenderThread  receiver={selected} receiverId={selected._id} receiver_type={filter}/>    }
      </div>
    </div>
  </div>
</div>
  )
}
