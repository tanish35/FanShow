# 🎟️ Fair & Transparent Event Booking with Spotify & Hive Blockchain

## 🚀 Overview

Our event booking platform ensures **fair and transparent ticket distribution** using a **priority queue system** powered by **Spotify listening history** and **Hive blockchain integration**. This eliminates scalpers and ensures that true fans get access to tickets first.

## 🔑 How It Works

1. **Login with Hive Keychain** and select an event.
2. **User Ranking & Priority:** Ranked based on your genuine engagement with an artist (percentage of their songs in your top 100 Spotify tracks).
3. **Live Queue Updates:** Users receive **real-time rank updates** via WebSockets.
4. **Rank #1?** You get **1 minute** to complete payment.
5. **Secure Ticketing:** Payment is broadcasted on the **Hive blockchain** to ensure **security and transparency**.
6. **Access Anytime:** Successfully booked tickets are stored securely on the blockchain.

## 🧠 Business Logic

✅ **User Ranking & Priority:** Higher affinity scores mean higher queue priority.
✅ **WebSocket-Based Real-Time Updates:** Get instant rank updates for a seamless experience.
✅ **Payment & Ticket Security:** Payments processed in **1-minute**, recorded on the **Hive blockchain** for fraud prevention.

## 💡 Why Choose Us Over BookMyShow?

Unlike traditional platforms like BookMyShow, which rely on a **first-come, first-served** model that scalpers exploit, our platform offers:

- **Fair Ticketing:** Genuine fans get priority, eliminating bot interference.
- **Real-Time Queue Tracking:** WebSocket-powered **live rank updates** eliminate uncertainty.
- **Blockchain-Powered Security:** Tickets and payments are **immutable**, preventing fraud and resale scams.

## 💰 Revenue Model

- **Service Fees** on successful ticket bookings.
- **Premium Access** for early entry or priority booking.
- **Partnerships** with artists & venues for exclusive content and promotions.

## 📈 Scalability

Built to handle **high user volumes** and **large-scale events** without performance issues. Our **fan-first ticketing system** ensures a seamless experience while offering a sustainable business model.

## 📥 User Onboarding Strategy

1. **Artist Partnerships** 🎤 – Exclusive early access for superfans.
2. **Spotify-Driven Engagement** 🎧 – "Test Your Fan Rank" feature to attract users.
3. **Referral System** 🎁 – Queue position boosts for bringing friends.
4. **NFT Ticketing & Perks** 🏆 – Digital tickets with exclusive benefits.
5. **Community Marketing** 🚀 – Engagement via Discord, Twitter, and Reddit.

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js (Express) / Deno
- **Database:** PostgreSQL (Managed via Prisma)
- **Blockchain:** Hive Blockchain for secure transactions
- **Authentication:** Hive Keychain + Spotify OAuth
- **WebSockets:** Real-time queue updates

## 🎯 Getting Started

### Prerequisites

- Node.js & npm
- Hive Keychain Extension
- Spotify Developer Account (for OAuth setup)

### Installation

```bash
git clone https://github.com/tanish35/FanShow.git
cd FanShow
npm install
npm start
```

### Environment Variables
Create a `.env` file and configure the following:
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
HIVE_KEYCHAIN_API=your_hive_api
DATABASE_URL=your_database_url
```

## 🌟 Explore

- [🔗 Frontend Repo](https://github.com/tanish35/FanShow)
- [🔗 Backend Repo](https://github.com/Somnath-Chattaraj/backend)
- [🔗 Deployed Project](https://fanshow.wedevelopers.online/)
- [🔗 Presentation](https://gamma.app/docs/Untitled-b1s879uei4758cx)

## 🏗️ Future Roadmap

- **AI-powered Fan Engagement Metrics** – Smarter ranking algorithms.
- **Multi-Blockchain Support** – Expanding beyond Hive.
- **Event Discovery** – Personalized recommendations for users.
- **Mobile App** – Native iOS & Android apps.

## 🤝 Contributing
We welcome contributions! Feel free to open issues or submit pull requests.

## 📜 License
This project is licensed under the MIT License.

---

Built with ❤️ for music fans. Let’s revolutionize ticketing! 🎶
