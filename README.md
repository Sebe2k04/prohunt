# ProHunt - Project Management and Team Matching Platform

ProHunt is a modern web application that helps teams find the perfect members for their projects through intelligent matching and recommendations. Built with Next.js and Python, it combines a beautiful UI with powerful recommendation algorithms.

## 🌟 Features

- **Smart Project Matching**: AI-powered recommendation system that matches projects with suitable team members
- **Portfolio Management**: Create and showcase your professional portfolio
- **Skill-Based Matching**: Advanced algorithms that consider skills, experience, and project requirements
- **Modern UI/UX**: Beautiful, responsive interface with smooth animations
- **Authentication**: Secure user authentication powered by Supabase
- **Real-time Updates**: Instant notifications and updates
- **Integration Support**: Connect with various development tools and platforms

## 🛠️ Tech Stack

### Frontend
- Next.js 15.1.7
- React 19
- Tailwind CSS
- Framer Motion
- Material Tailwind
- NextUI
- React Icons
- Axios

### Backend
- Python Flask
- Supabase
- SQLAlchemy
- Scikit-learn
- XGBoost
- Pandas
- NumPy

## 📁 Project Structure

```
prohunt/
├── client/                 # Frontend Next.js application
│   ├── src/
│   │   ├── app/           # Next.js pages and routes
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React context providers
│   │   ├── lib/          # Utility functions
│   │   └── supabase/     # Supabase client configuration
│   └── public/           # Static assets
│
└── recommendation/        # Python recommendation engine
    ├── app.py            # Main Flask application
    ├── integrations.py   # Integration handlers
    ├── collab.py        # Collaborative filtering
    └── requirements.txt  # Python dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn
- pip

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the recommendation directory:
   ```bash
   cd recommendation
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```

## 🔑 Environment Variables

Create a `.env` file in the client directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For any queries or support, please open an issue in the repository.
