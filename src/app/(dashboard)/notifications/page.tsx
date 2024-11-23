"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

type Notification = {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
};

type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userSchool, setUserSchool] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          console.error("No user is logged in");
          return;
        }

        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        setUserRole(userData?.role || null);
        setUserSchool(userData?.school || null);

        console.log("User Role:", userData?.role); // Debug log
        console.log("User School:", userData?.school); // Debug log

        const notificationsQuery = query(collection(db, "notifications"), where("userId", "==", uid));
        const notificationsSnapshot = await getDocs(notificationsQuery);
        const notificationsList: Notification[] = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Notification));

        const eventsQuery = query(collection(db, "events"), where("school", "==", userData?.school));
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsList: Event[] = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Event));

        const announcementsQuery = query(collection(db, "announcements"), where("school", "==", userData?.school));
        const announcementsSnapshot = await getDocs(announcementsQuery);
        const announcementsList: Announcement[] = announcementsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Announcement));

        setNotifications(notificationsList);
        setEvents(eventsList);
        setAnnouncements(announcementsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleCreateNotification = async () => {
    const title = prompt("Enter notification title:");
    const description = prompt("Enter notification description:");
    if (title && description && userSchool) {
      try {
        await addDoc(collection(db, "notifications"), {
          title,
          description,
          type: "custom",
          date: new Date().toISOString(),
          school: userSchool,
          userId: auth.currentUser?.uid,
        });
        alert("Notification created successfully!");
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    }
  };

  const handlePushNotification = async (title: string, description: string) => {
    if (userSchool) {
      try {
        await addDoc(collection(db, "notifications"), {
          title,
          description,
          type: "auto",
          date: new Date().toISOString(),
          school: userSchool,
          userId: auth.currentUser?.uid,
        });
        alert("Notification pushed successfully!");
      } catch (error) {
        console.error("Error pushing notification:", error);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (notifications.length === 0 && events.length === 0 && announcements.length === 0) {
    return <p>No notifications, events, or announcements found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      {userRole === "Admin" && (
        <button
          onClick={handleCreateNotification}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Create Notification
        </button>
      )}
      <div className="space-y-4">
        {notifications.map(notification => (
          <div key={notification.id} className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-semibold">{notification.title}</h2>
            <p className="text-gray-600">{notification.description}</p>
            <p className="text-gray-400 text-sm">{notification.date}</p>
          </div>
        ))}
      </div>
      <h1 className="text-2xl font-semibold mt-8 mb-4">Events</h1>
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-gray-400 text-sm">{event.date}</p>
            {userRole === "Admin" && (
              <button
                onClick={() => handlePushNotification(event.title, event.description)}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Push Notification
              </button>
            )}
          </div>
        ))}
      </div>
      <h1 className="text-2xl font-semibold mt-8 mb-4">Announcements</h1>
      <div className="space-y-4">
        {announcements.map(announcement => (
          <div key={announcement.id} className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-semibold">{announcement.title}</h2>
            <p className="text-gray-600">{announcement.description}</p>
            <p className="text-gray-400 text-sm">{announcement.date}</p>
            {userRole === "Admin" && (
              <button
                onClick={() => handlePushNotification(announcement.title, announcement.description)}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Push Notification
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;