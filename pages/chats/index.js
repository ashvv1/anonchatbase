import styles from '../../styles/Chats.module.css';
import Head from 'next/head';
import { Auth } from "../../context/context";
import { useContext, useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { useRouter } from 'next/router';
import { signOut } from "firebase/auth";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Image from 'next/image';
const trashIcon = require("../../public/trashIcon.png");
const shareIcon = require("../../public/shareIcon.png");

const { Thread } = require("../../models/threadModel");

const Chats = () => {

  const authContext = useContext(Auth);
  const db = getFirestore();
  const myId = authContext.auth.currentUser && authContext.auth.currentUser.uid;

  const router = useRouter();

  const [userChats, setUserChats] = useState([]);
  const [createNew, setCreateNew] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect( () => {
    const chatsRef = query(collection(db, 'Chats'), where("recipients", "array-contains", myId))
    const unsub = onSnapshot(chatsRef, async (snapshot) => {
      
      const addChats = () => {
        let chats = [];
        snapshot.docs.forEach((doc) => {
          chats.push({ ...doc.data(), id: doc.id });
        });
        return chats;
      }

      setUserChats(addChats())
    })

    return () => unsub();
  }, [myId, db])
  
  useEffect(() => {
    const unsubscribe = authContext.auth.onAuthStateChanged(user => {
      !user && router.push("/")
    });

    // Return the unsubscribe function to clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [authContext.auth, router]);

  useEffect(() => {
    !authContext.auth.currentUser && router.push("/")
  })

  const createNewChat = async () => {
    const newThread = new Thread(newSubject, myId);
    setUpdating(prev => "Creating Chat");
    setCreateNew(false);
    await addDoc(collection(db, "Chats"), {
      subject: newSubject,
      recipients: [myId],
      messages: [],
      creator: myId
    });
    setUpdating(prev => "");
  }

  const deleteChat = async (id) => {
    setUpdating(prev => "Deleting Chat");
    await deleteDoc(doc(db, "Chats", id));
    setUpdating(prev => false);
  }

  const openChat = (chat_id) => {
    router.push(`./chats/${chat_id}`)
  }

  const handleSignOut = () => {
    confirmAlert({
      title: 'End Session?',
      message: 'Access to all chats will be revoked!',
      buttons: [
        {
          label: 'Yes',
          onClick: () => signOut(authContext.auth)
        },
        {
          label: 'No',
          onClick: () => null
        }
      ]
    });
    
  }

  const handleShare = (chat_id) => {
    navigator.share({
      title: 'Chat Invite',
      url: `${window.location.origin}/chats/${chat_id}`,
    })
  }

  console.log(userChats.filter(chat => chat.creator === myId))

  if(!authContext.auth.currentUser){
    return (
    <main className={styles.main}>
      redirecting
      </main>)
  }

  return (
    <>
      <Head>
        <title>My Chats</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {updating &&
          <div className={styles.updatingScreen}>
            {updating}
          </div>
        }
        <h3 className={styles.light} onClick={() => handleSignOut() }>End Session</h3>
        <div className={styles.chatList}>
          <div className={styles.header}>
            <h1>My Chats</h1>
            <button id={styles.addChat} onClick={() => setCreateNew(!createNew)}>+</button>
          </div>
          <div className={styles.listBody}>
            {userChats.length > 0 ? (
              userChats.map(chat => (
                <div className={styles.listTile} key={chat.id} >
                  <div className={styles.tileInfo} onClick={() => openChat(chat.id)}>
                    <div>{chat.subject}</div>
                    <div><span>Messages: </span>{chat.messages.length}</div>
                  </div>
                  <div className={styles.tileOptions}>
                  <div id={styles.shareIcon}>
                    <Image onClick={() => handleShare(chat.id)}  src={shareIcon} alt="share Icon"></Image>
                    </div>
                  <div className={`${styles.trashIcon} ${chat.creator !== myId && styles.hidden}`}>
                  <Image onClick={() => deleteChat(chat.id)}  src={trashIcon} alt="trash Icon"></Image>
                    </div>
                    </div>
                </div>
              ))
            ) :
              <h1 className={styles.center}>No Chats</h1>}

            {createNew &&
              <div className={styles.newSubjectBackdrop}>
                <div className={styles.newSubject}>
                  <h3 className={styles.light}> New Chat </h3>
                  <input placeholder='Subject' onChange={(e) => setNewSubject(e.target.value)}></input>
                  <button onClick={() => createNewChat()}>Create Chat</button>
                </div>
              </div>
            }

          </div>

        </div>

      </main>
    </>
  );
};

export default Chats;