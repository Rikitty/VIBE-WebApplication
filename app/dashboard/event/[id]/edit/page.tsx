"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig"; // Adjust path as per your Firebase config file
import EditForm from "@/components/events/editForm";

export default function Edit() {
  const router = useRouter();
  const { id } = router.query; // Extract `id` from URL query
  const [eventData, setEventData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const eventRef = doc(db, "events", id as string);
          const eventSnap = await getDoc(eventRef);

          if (eventSnap.exists()) {
            setEventData(eventSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching event:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [id]);

  return (
    <div className="flex h-[42rem] flex-col items-center justify-between">
      {loading ? (
        <p>Loading event...</p>
      ) : eventData ? (
        <EditForm id={id as string} eventData={eventData} />
      ) : (
        <p>Event not found.</p>
      )}
    </div>
  );
}
