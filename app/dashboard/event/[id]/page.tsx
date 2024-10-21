"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GrCalendar, GrLocation } from "react-icons/gr";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { db } from "@/lib/firebaseConfig"; // Firestore instance
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface Like {
  user_ids: string | null;
}

interface ExtendedEvent {
  id: string; // Firestore document ID will be a string
  title: string;
  location: string;
  details: string;
  date_started: Date;
  date_ended: Date;
  image: string | null;
  user_id: string;
  likes?: Like[] | null;
}

const SingleEventPage: React.FC = () => {
  const [event, setEvent] = useState<ExtendedEvent | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const { id } = useParams(); // Get event ID from dynamic route
  const { user } = useAuth(); // Get authenticated user from FireAuth

  useEffect(() => {
    const fetchEventDetails = async (id: string) => {
      console.log("Fetching event with id:", decodeURIComponent(id)); // Debug: Log Decoded ID

      try {
        const eventRef = doc(db, "events", decodeURIComponent(id)); // Decode the id before passing it to Firestore
        const docSnap = await getDoc(eventRef);

        if (docSnap.exists()) {
          console.log("Event found:", docSnap.data()); // Debug: Log Event Data

          const data = docSnap.data();

          // Convert Firestore timestamp to JavaScript Date
          const date_started = data.date_started?.toDate
            ? data.date_started.toDate()
            : new Date(data.date_started);
          const date_ended = data.date_ended?.toDate
            ? data.date_ended.toDate()
            : new Date(data.date_ended);

          setEvent({
            id: docSnap.id,
            title: data.title,
            location: data.location,
            details: data.details,
            date_started, // JavaScript Date object
            date_ended, // JavaScript Date object
            image: data.image,
            user_id: data.user_id,
            likes: data.likes || [],
          });

          setHasLiked(
            data.likes?.some((like: Like) => like.user_ids === user?.uid)
          );
        } else {
          console.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event details from Firestore:", error);
      }
    };

    if (id && user) {
      const eventId = decodeURIComponent(Array.isArray(id) ? id[0] : id); // Decode the eventId
      fetchEventDetails(eventId);
    }
  }, [id, user]);

  const handleLikeClick = async () => {
    if (!event || !user) return;

    try {
      const eventRef = doc(db, "events", event.id);

      if (hasLiked) {
        await updateDoc(eventRef, {
          likes: arrayRemove({ userId: user.uid }),
        });
      } else {
        await updateDoc(eventRef, {
          likes: arrayUnion({ userId: user.uid }),
        });
      }

      setHasLiked(!hasLiked);
      setEvent({
        ...event,
        likes: hasLiked
          ? event.likes?.filter((like) => like.user_ids !== user.uid)
          : [...(event.likes || []), { user_ids: user.uid }],
      });
    } catch (error) {
      console.error("Error updating likes in Firestore:", error);
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-2 mt-8 p-2 bg-gray-800 bg-opacity-60 rounded-md shadow-lg flex">
      <div className="w-1/3 p-4 flex justify-center">
        {event.image && (
          <img
            src={event.image}
            alt="Event"
            className="w-full h-auto rounded-md"
          />
        )}
      </div>

      <div className="w-2/3 p-3">
        <div className="text-xl font-bold text-white">{event.title}</div>
        <div className="text-sm text-gray-400 flex items-center mt-2">
          <GrCalendar className="mr-1" />
          {event.date_started?.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          to {/* Convert string to Date and format */}
          {event.date_ended?.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <GrLocation className="ml-2 mr-1" /> {event.location}
        </div>
        <div className="text-sm text-gray-200 mt-2">{event.details}</div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleLikeClick}
            className="bg-orange-400 text-white py-1 px-3 rounded-md flex items-center"
          >
            {hasLiked ? (
              <FaHeart className="mr-2" />
            ) : (
              <CiHeart className="mr-2" />
            )}{" "}
            {event.likes?.length}
          </button>
          <Link
            href="/dashboard"
            className="bg-yellow-500 text-white py-1 px-3 rounded-md"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleEventPage;
