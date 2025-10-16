import spotifyLogo from "../../assets/images/spotify-logo.png";
import netflixLogo from "../../assets/images/netflix-logo.png";
import adobeLogo from "../../assets/images/adobe-logo.png";
import chatgptLogo from "../../assets/images/chatgpt-logo.png";
import antiVirusLogo from "../../assets/images/anti-virus-logo.png";
import vpnLogo from "../../assets/images/vpn-logo.png";
import elsaSpeakLogo from "../../assets/images/elsa-speak-logo.png";
import microsoftLogo from "../../assets/images/microsoft-logo.png";
import tinderLogo from "../../assets/images/tinder-logo.png";
import youtubeLogo from "../../assets/images/youtube_logo.png";
import duolingoLogo from "../../assets/images/duolingo-logo.png";
import "./InfinityScrollBar.css";

const logos = [
  { src: spotifyLogo, name: "Spotify" },
  { src: netflixLogo, name: "Netflix" },
  { src: adobeLogo, name: "Adobe" },
  { src: chatgptLogo, name: "Chat GPT 4.0" },
  { src: antiVirusLogo, name: "Anti Virus" },
  { src: vpnLogo, name: "VPN" },
  { src: elsaSpeakLogo, name: "Elsa Premium" },
  { src: microsoftLogo, name: "Microsoft" },
  { src: tinderLogo, name: "Tinder" },
  { src: youtubeLogo, name: "YouTube" },
  { src: duolingoLogo, name: "Duolingo" },
];

export default function InfinityScrollBar() {
  return (
    <div className="main-container">
      <div className="tag-list">
        <div className="inner">
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="tag">
              <img src={logo.src} alt={`${logo.name} Logo`} className="tag-logo" />
              <p className="tag-text">{logo.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
