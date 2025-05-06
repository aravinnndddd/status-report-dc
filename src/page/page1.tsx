import React, { useEffect, useState } from "react";

import styles from "./app.module.css"; // Import the CSS module


interface Resp {
	discord_status: 'online' | 'dnd' | 'idle';
	username: string;
	discriminator: string;
	discord_user: {
		username: string;
		discriminator: string;
		avatar: string;
		id: string;
	};
	spotify: {
		track_id: string;
		song: string;
		artist: string;
		album_art: string;
	};
  activities:{
    0:{
      id: string;
      name: string;
      state: string;
      details: string;
      assets:{
        large_image: string;
        small_image: string;
      };
    };
    
  };}

  
  
const Page: React.FC = () => {
  
const [data, setData] = useState<Resp>();
const [loading, setLoading] = useState(true);
 
useEffect(() => {
	const ID = '754961569858846770';
 
	fetch(`https://api.lanyard.rest/v1/users/${ID}`)
		.then((res) => res.json())
		.then((res) => {
			setData(res.data);
			setLoading(false);
		});
}, []);


  // Determine the status color based on the Discord status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-400";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-gray-400"; // offline or unknown
    }
  };

  // Return loading state spinner while fetching data
  if (loading || !data) {
    return (
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // Construct avatar URL
  const avatarURL = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;
  let raw = data.activities[0].assets.large_image;

  let cleanedURL = raw.substring(raw.indexOf("raw"));
  cleanedURL="https://"+ cleanedURL;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>My Discord Status</h1>
      </div>

      <div className={styles.gridWrapper}>
        <div className={styles.avatarWrapper}>
          <div className={`${getStatusColor(data.discord_status)} ${styles.avatarWrapper}`}>
            <img className={styles.avatarImage} src={avatarURL} alt="User Avatar" />
          </div>
        </div>

        <div className={styles.textWrapper}>
          <p className={styles.textTitle}>
            {data.discord_user.username}
            <span className={styles.textSubtitle}>#{data.discord_user.discriminator}</span>
          </p>

          <p className={styles.textBody}>
            {data.spotify
              ? `${data.spotify.song} by ${data.spotify.artist} `
              : "Not listening to anything"}
          </p>
          <p className={styles.textBody}>
            {data.discord_status === "online"
              ? "Online"
              : data.discord_status === "dnd"
              ? "Do Not Disturb"
              : "Idle"}
          </p>
          <p>
          {data.activities[0].id=="df90c6dd5a671069"? "VS code" : "no"} <br />
            {data.activities[0].id=="df90c6dd5a671069"? data.activities[0].details : "no"}
          </p>
          
 
          <img
  src={`${cleanedURL}`} width="100px" 
  alt="Activity Image"
/>
<p>{data.activities[0].state}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
