"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig"; // Assuming you've already set up Firebase config
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
// import Chip from "@/components/chip/Chip";
import { GrCalendar, GrLocation } from "react-icons/gr";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Like {
  user_ids: string;
}

interface ExtendedEvent {
  id: string;
  title: string;
  location: string;
  description: string;
  date_started: string;
  date_ended: string;
  imageUrl: string | null;
  user_id: string;
  likes?: Like[];
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const chips = ["Technology", "Business", "Marketing", "Education", "Arts"];

  useEffect(() => {
    // Listen for Firebase Auth user state change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push("/login");
      }
    });

    // Fetch events from Firestore
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData: ExtendedEvent[] = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() } as ExtendedEvent);
      });
      setEvents(eventsData);
    };

    fetchEvents();

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [router]);

  const handleChipClick = (chip: string) => {
    alert(`Chip clicked: ${chip}`);
  };

  const handleLikeClick = async (eventId: string, hasLiked: boolean) => {
    if (!userId) return; // Ensure the user is authenticated
    const eventRef = doc(db, "events", eventId);

    if (hasLiked) {
      // Remove the user's like
      await updateDoc(eventRef, {
        likes: arrayRemove({ userId })
      });
    } else {
      // Add the user's like
      await updateDoc(eventRef, {
        likes: arrayUnion({ userId })
      });
    }
    // Refetch the events to update the UI
    const querySnapshot = await getDocs(collection(db, "events"));
    const eventsData: ExtendedEvent[] = [];
    querySnapshot.forEach((doc) => {
      eventsData.push({ id: doc.id, ...doc.data() } as ExtendedEvent);
    });
    setEvents(eventsData);
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/dashboard/event/${eventId}`);
  };

  return (
    <div>
      <h1 className="text-lg font-bold m-2">Hello, World!</h1>
      <div className="flex justify-center mt-4">
        {/* {chips.map((chip, index) => (
          <Chip
            key={index}
            label={chip}
            onClick={() => handleChipClick(chip)}
          />
        ))} */}
      </div>

      <div className="m-2 mt-7 text-3xl font-bold">
        <h1>Feed</h1>
      </div>
      {events.map((item) => {
        const likes = item.likes || [];
        const hasLiked = likes.some((like) => like.user_ids === userId);

        return (
          <div
            key={item.id}
            className="m-2 mt-8 p-2 bg-gray-800 bg-opacity-60 rounded-md shadow-lg flex cursor-pointer"
            onClick={() => handleEventClick(item.id)} // Handle event click
          >
            <div className="w-1/3 p-4 flex justify-center">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt="Event"
                  className="w-full h-auto rounded-md"
                />
              )}
            </div>

            <div className="w-2/3 p-3">
              <div className="text-xl font-bold text-white">{item.title}</div>
              <div className="text-sm text-gray-400 flex items-center mt-2">
                <GrCalendar className="mr-1" />
                {new Date(item.date_started).toDateString()}{" "}
                <GrLocation className="ml-2 mr-1" /> {item.location}
              </div>
              <div className="text-sm text-gray-200 mt-2">
                {item.description}
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the event click handler from firing
                    handleLikeClick(item.id, hasLiked);
                  }}
                  className="bg-orange-400 text-white py-1 px-3 rounded-md flex items-center"
                >
                  {hasLiked ? (
                    <FaHeart className="mr-2" />
                  ) : (
                    <CiHeart className="mr-2" />
                  )}{" "}
                  {likes.length}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the event click handler from firing
                    handleEventClick(item.id);
                  }}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-md"
                >
                  REGISTER NOW
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
