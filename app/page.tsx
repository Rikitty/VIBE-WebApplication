"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


type QuestionId = 'question1' | 'question2' | 'question3';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); 
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const [isExpanded, setIsExpanded] = useState<Record<QuestionId, boolean>>({
    question1: false,
    question2: false,
    question3: false,
  });

  const toggleExpand = (questionId: QuestionId) => {
    setIsExpanded((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-between pt-8"
          style={{
            backgroundImage: 'url("/assets/background2.png")',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>

      <header className="w-full flex justify-between items-center px-10">
        <img src="/assets/6.png" alt="VIBE Logo" className="w-48 h-auto" />
        <div className="flex space-x-4">
          <Button 
            className="h-12 w-24 bg-transparent text-white font-semibold border border-yellow-500 hover:bg-yellow-500 hover:text-black px-4 py-2 rounded transition-colors"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          <Button 
            className="h-12 w-24 bg-yellow-500 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-600 hover:text-black transition-colors"
            onClick={() => router.push('/signup')}
          >
            Sign up
          </Button>
        </div>
      </header>

      {/* Main Content Section */}
      <section className="text-center my-20">
        <h2 className="text-4xl font-bold mb-4">
          Making <span className="text-yellow-500">Volunteerism</span> more Exciting
        </h2>
        <p className="text-xl mb-8">Join the force to create a fun and exciting experience</p>
        
        <div className="flex justify-center items-center">
          <div className="my-5 bg-gradient-to-t from-yellow-500 via-yellow-500/0 to-transparent text-white font-normal text-5xl py-6 px-12 h-96 w-80 flex justify-center items-center rounded-xl border-2 border-yellow-500">
            {formatTime(timeLeft)}
          </div>
        </div>
      </section>

      {/* Increaser in Action Section */}
      <section className="my-24">
        <h3 className="text-3xl font-light mb-6 flex justify-center">
          Increaser in<span className="mx-2 text-yellow-500">Action</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-8 lg:mx-12">
          {/* Repeat for each increaser action card */}
          <div className="bg-gray-500 p-6 rounded-lg shadow-lg">
            <p className="text-lg">Mia Wilson</p>
            <p className="text-gray-300 mt-4">Capability to connect to different social profiles of the volunteer.</p>
          </div>
          <div className="bg-gray-500 p-6 rounded-lg shadow-lg">
            <p className="text-lg">Ethan Davis</p>
            <p className="text-gray-300 mt-4">Ensure that the app can handle errors with minimal down time.</p>
          </div>
          <div className="bg-gray-500 p-6 rounded-lg shadow-lg">
            <p className="text-lg">Noah Johnson</p>
            <p className="text-gray-300 mt-4">Expected to be delivered in a web-based platform then a mobile a version upon gaining some feedback about the website. </p>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="my-24 text-center">
        <h2 className="text-4xl font-light mb-8">Welcome to Your <br></br>Partner In <span className="text-yellow-500">Volunteerism</span></h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          <span className="text-yellow-500">VIBE (Volunteer Impact Blockchain Ecosystem)</span> tackles the challenge of low volunteer engagement by making volunteering more fun and rewarding. Through a gamified approach, volunteers earn digital tokens for their contributions and task completion. Smart contracts ensure secure and transparent management of both internal funds and crypto donations from supporters. This system benefits everyone involved. Volunteers gain valuable networking opportunities while earning tokens, and organizations can build a strong community by connecting with active volunteers. VIBE essentially hits two birds with one stone – making volunteering enjoyable and fostering stronger connections within the community.
        </p>
      </section>

      {/* Questions Section */}
      <section className="my-20 mb-40 text-center">
        <h2 className="text-5xl font-bold mb-10">
          <span className="text-yellow-500">Questions?</span> Were Here to Help
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Will there will be mobile app for user?</p>
            <svg
              className="w-4 h-4 text-gray-400 cursor-pointer ml-auto"
              onClick={() => toggleExpand('question1')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
          {isExpanded.question1 && (
            <p className="text-white-400 ml-4 flex">Yes, VIBE (Volunteer Impact Blockchain Ecosystem) will have a mobile app where users can use the app.</p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Can different community can post there event?</p>
            <svg
              className="w-4 h-4 text-gray-400 cursor-pointer ml-auto"
              onClick={() => toggleExpand('question2')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
          {isExpanded.question2 && (
            <p className="text-white-400 ml-4 flex">Yes, VIBE (Volunteer Impact Blockchain Ecosystem) is open to ALL Community</p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-gray-400">How can I get my rewards?</p>
            <svg
              className="w-4 h-4 text-gray-400 cursor-pointer ml-auto"
              onClick={() => toggleExpand('question3')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
          {isExpanded.question3 && (
            <p className="text-white-400 ml-4 flex">Rewards can be thru token or redeem reward convertible to points.</p>
          )}
        </div>
      </section>

      <footer className="relative text-center flex flex-col items-center justify-between py-8 px-4 min-h-[35rem] w-full overflow-hidden bg-center bg-cover bg-no-repeat">
        <div className="absolute inset-0 z-0 bg-[url('/assets/test.jpg')] bg-center bg-cover opacity-10"></div>

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-6xl font-bold m-20 text-white">
            Be <span className="text-yellow-500">Heard</span>
          </p>
          <Button onClick={() => router.push('/signup')} className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded mb-6 h-[4rem] w-[12rem] shadow-2xl shadow-black">
            Sign up
          </Button>
        </div>

        <p className="text-gray-300 mt-auto font-normal">
          <em>VeeBy Software Development Services 2024</em>
        </p>

        <div className="absolute inset-0 z-0 bg-[url('/assets/test.jpg')] bg-center bg-current opacity-30"></div>
      </footer>

    </main>
  );
}