import { useEffect, useState } from "react";
import styles from "./app.module.css";
interface Resp {
  discord_status: "online" | "dnd" | "idle";
  username: string;
  discriminator: string;
  discord_user: {
    username: string;
    discriminator: string;
    avatar: string;
    id: string;
  };
  spotify?: {
    track_id: string;
    song: string;
    artist: string;
    album_art_url: string;
  };
  activities: {
    id: string;
    name: string;
    state?: string;
    details?: string;
    assets?: {
      large_image?: string;
      small_image?: string;
    };
  }[];
}

const DcStatus: React.FC = () => {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ID = "754961569858846770";

    const fetchData = () => {
      fetch(`https://api.lanyard.rest/v1/users/${ID}`)
        .then((res) => res.json())
        .then((res) => {
          setData(res.data);
          setLoading(false);
        });
    };

    fetchData(); // fetch immediately
    const interval = setInterval(fetchData, 500);

    return () => clearInterval(interval); // cleanup
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500 ";
      case "idle":
        return "bg-yellow-400";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  if (loading || !data) {
    return (
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const avatarURL = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;

  // Find VS Code activity dynamically
  const vsCodeActivity = data.activities.find((a) => a.name === "Code");

  // Get large_image from any activity (e.g., Spotify or VS Code)
  const rawImage = vsCodeActivity?.assets?.large_image;
  const cleanedURL = rawImage?.includes("raw")
    ? "https://" + rawImage.substring(rawImage.indexOf("raw"))
    : undefined;

  return (
    <div className="bg-black h-[100vh] flex items-center justify-center">
      <div className="bg-white/10 w-[350px] md:w-[600px] justify-center h-[70vh] md:h-[500px] rounded-lg shadow-lg flex flex-col ">
        <div className="flex flex-col mt-1 items-center justify-center">
         

          <div
            className={`${getStatusColor(
              data.discord_status
            )} relative rounded-full inline-block p-[4px]`}
          >
            <img
              className="md:w-[96px] md:h-[96px] w-[76px] h-[76px] rounded-full"
              src={avatarURL}
              alt="User Avatar"
            />
          </div>

          <div className="text-white text-center mt-2">
            <p>
              {data.discord_user.username}
              <span className="text-sm text-gray-300">#4999</span>
            </p>
            <p className={styles[data.discord_status] + " font-semibold mb-10"}>
              {data.discord_status === "online"
                ? "Online"
                : data.discord_status === "dnd"
                ? "Do Not Disturb"
                : "Idle"}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 justify-center ">
          {/* VS Code Activity */}
          <div className=" hover:inset-shadow-white/15 hover:shadow-2xl transition-all duration-500 ease-in  text-[12px] p-3 rounded-3xl flex flex-col items-center inset-shadow-sm inset-shadow-black  bg-white/10  w-[250px]  justify-center text-white">
            {vsCodeActivity ? (
              <>
                <p className="text-center font-extrabold">VS Code</p>

                <div className="flex items-center gap-2">
                  {vsCodeActivity.assets?.large_image && (
                    <img
                      src={cleanedURL}
                      className="md:w-[80px] w-[50px]"
                      alt="Activity Image"
                    />
                  )}
                  <div>
                    <p className="text-sm">{vsCodeActivity.details}</p>
                    <p className="text-black font-bold">
                      {vsCodeActivity.state}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p>huh?!</p>
            )}
          </div>

          {/* Spotify */}
          <div className="  hover:inset-shadow-white/15 hover:shadow-2xl transition-all duration-500 ease-in  text-[12px] p-3 rounded-3xl flex flex-col items-center inset-shadow-sm inset-shadow-black  bg-white/10  w-[250px]  justify-center text-white">
            {data.spotify?.track_id ? (
              
              <>
                  <p className="text-center font-semibold">Spotify</p>
                <div className="flex items-center gap-2">
              
                  <img
                    src={data.spotify.album_art_url}
                    className="w-[50px] md:w-[80px] "
                    alt="Album Art"
                  />
                  
                  <div>
                    <p className="text-[12px]">{data.spotify.song}</p>
                    <p className="text-[10px] text-black font-bold md:text-[12px]">by {data.spotify.artist}</p>
                  </div>
                </div>
              </>
            ) : (
              <p>Hmm!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DcStatus;
