"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext"; // Assuming you have an AuthContext to get the logged-in user
// import Chip from "@/components/chip/Chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FaUser } from "react-icons/fa";

const Profile: React.FC = () => {
  const { user } = useAuth(); // Use your AuthContext to get the Firebase authenticated user
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [userLikedEvents, setUserLikedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch user details from the "tech_leaders" collection in Firestore
        const userDocRef = doc(db, "tech_leaders", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserDetails({
            community_name: data.community_name || "Unknown Community",
            email: data.email || "No email provided",
            name: data.name || "Anonymous",
            user_id: data.user_id || user.uid,
          });
        } else {
          // Set default values if no document exists
          setUserDetails({
            community_name: "Unknown Community",
            email: "No email provided",
            name: "Anonymous",
            user_id: user.uid,
          });
        }

        // Fetch events created by the logged-in user
        const eventsQuery = query(collection(db, "events"), where("user_id", "==", user.uid));
        const eventsSnapshot = await getDocs(eventsQuery);
        setUserEvents(eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        // Fetch events liked by the user
        const likedEventsQuery = query(collection(db, "events"), where("likedBy", "array-contains", user.uid));
        const likedEventsSnapshot = await getDocs(likedEventsQuery);
        setUserLikedEvents(likedEventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Delete event handler
  const handleDeleteEvent = async (eventId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "events", eventId));
        setUserEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        alert("Event deleted successfully.");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const chips = ["JavaScript", "TypeScript", "React", "Next.js"];

  const handleChipClick = (chip: string) => {
    alert(`Chip clicked: ${chip}`);
  };

  return (
    <div className="text-lg m-2">
      <h1 className="font-bold">Profile</h1>
      <div className="flex justify-center mt-4">
        {/* {chips.map((chip, index) => (
          <Chip key={index} label={chip} onClick={() => handleChipClick(chip)} />
        ))} */}
      </div>

      <Separator className="my-4" />

      <div className="flex justify-center mt-4">
        <div className="flex w-1/3 items-center justify-center">
          <Avatar className="h-32 w-32">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 w-2/3">
          <p>Email: {userDetails?.email}</p>
          <p>Username: {userDetails?.name}</p>
          <p>Community Name: {userDetails?.community_name}</p>
          <div>
            <FaUser className="text-2xl text-yellow-500 mt-4" />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <h2 className="font-bold mt-4 flex justify-end"><a href="/dashboard">See all</a></h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {userEvents.map((event) => (
          <div
            key={event.id}
            className="relative bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={event.imageUrl || 'path/to/default/image.jpg'}
              alt={event.title || 'Event image'}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="block text-gray-500">{event.location}</span>
                <span className="block text-gray-500">
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {event.description}
              </p>
              <div className="flex justify-between items-center">
                <a
                  href={`/dashboard/event/${event.id}/edit`}
                  className="text-blue-500 font-semibold hover:underline"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-500 font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-10"/>

      <h2 className="font-bold mt-4 text-2xl text-yellow-500">Favorites</h2>
      <div className="mt-4">
        {userLikedEvents.map((event) => (
          <div key={event.id} className="mb-4 bg-gray-800 rounded-lg overflow-hidden flex">
            <img
              src={event.imageUrl || 'path/to/default/image.jpg'}
              alt={event.title}
              className="w-1/2 h-64 object-cover"
            />
            
            <div className="w-1/2 p-4 bg-white text-gray-900 border-2 border-yellow-500 ">
              <p className="text-lg font-bold text-yellow-500 ">Event Favorites</p>
              <p className="text-sm text-gray-600">{event.location}</p>
              <h3 className="mt-4 text-xl font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm text-gray-600">Username: {userDetails?.name}</p>
              <div className="flex justify-between mt-8">
                <p className="text-gray-600">Signed</p>
                <p className="text-gray-600">Signed</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
