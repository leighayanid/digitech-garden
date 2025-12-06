# Digitech Garden 🌱 -> 🌳

A personal, AI-enhanced knowledge management system built with **Nuxt 4**, **Vue 3**, and **Tailwind CSS**.

This application serves as a "**Digitech Garden**"—a space to cultivate ideas from initial thoughts ("Seedlings") into mature articles ("Evergreen"). It integrates advanced AI chat capabilities to help you brainstorm and organize your thoughts.

## 📸 Screenshots

### Landing Page
![Landing Page](/public/screenshots/landing-page.png)
*Beautiful, serene landing page with modern design and smooth animations*

### Dashboard (Light Mode)
![Dashboard Light](/public/screenshots/dashboard-light.png)
*Clean and elegant light mode with high contrast and readable typography*

### Dashboard (Dark Mode)
![Dashboard Dark](/public/screenshots/dashboard-dark.png)
*Rich, deep dark mode with carefully crafted color palette*

### AI Chat Interface
![AI Chat](/public/screenshots/ai-chat.png)
*Integrated AI assistant powered by Claude or GPT-4*

> **Note**: To add screenshots, take screenshots of your running application and save them to `public/screenshots/` with the names shown above. The images will display once the screenshot files are added.

## ✨ Features

- **🌿 Digital Garden Metaphor**: Categorize notes by growth stage:
  - **🌱 Seedling**: Rough ideas and initial thoughts.
  - **🌿 Budding**: Developing concepts with some structure.
  - **🌳 Evergreen**: Polished, complete documents.
- **🤖 Artificial Intelligence**:
  - **AI Chat**: Integrated assistant powered by **Claude 3.5 Sonnet** or **GPT-4o**.
  - **Streaming Support**: Real-time responses using the Vercel AI SDK.
  - **Chat-to-Seed**: Instantly specific AI insights as new notes.
- **📅 Daily Journal**: A dedicated space for daily logs and reflections.
- **💻 Code Snippets**: Manage and store reusable code blocks with syntax highlighting.
- **📚 Reading List**: Track articles and resources you want to read.
- **🔐 Secure Authentication**: User management via `nuxt-auth-utils`.

## 🛠 Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com)
- **UI Library**: [Nuxt UI](https://ui.nuxt.com) (Tailwind CSS v4)
- **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io))
- **Container**: Docker Compose for PostgreSQL
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Authentication**: `nuxt-auth-utils`
- **Date Handling**: `date-fns`
- **Markdown**: `markdown-it` with `shiki` for syntax highlighting.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm
- Docker Desktop (for PostgreSQL database)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/digital-garden.git
    cd digital-garden
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    Update `.env` with your API keys:
    ```ini
    # Session secret (generate with: openssl rand -base64 32)
    NUXT_SESSION_PASSWORD=...

    # Database (already configured for local PostgreSQL)
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/digitech_garden"

    # AI Keys (At least one required)
    ANTHROPIC_API_KEY=sk-ant-...
    OPENAI_API_KEY=sk-...
    ```

4.  **Start PostgreSQL Database**:
    ```bash
    docker compose up -d
    ```
    This will start a PostgreSQL container in the background.

5.  **Initialize Database**:
    ```bash
    npx prisma migrate dev
    ```

6.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000` to start gardening!

### Database Management

- **Start database**: `docker compose up -d`
- **Stop database**: `docker compose down`
- **View logs**: `docker compose logs postgres`
- **Reset database**: `docker compose down -v` (warning: deletes all data)

## 📂 Project Structure

- **`app/pages`**: Application routes and views.
  - **`garden`**: Note management and visualization.
  - **`ai`**: Chat interface.
  - **`daily`**: Journal entries.
- **`server/api`**: Backend API endpoints.
- **`prisma`**: Database schema and migrations.
- **`app/composables`**: Reusable Vue composables (e.g., `useChat.ts`).

## ⚙️ Configuration

The project is configured via `nuxt.config.ts`.
- **Modules**: Includes `@nuxt/ui`, `@prisma/nuxt`, `nuxt-auth-utils`.
- **UI Theme**: Automatic dark/light mode based on system preferences with manual toggle available.
  - **Light Mode**: Clean Gray palette with Emerald accents
  - **Dark Mode**: Rich Slate palette with vibrant Emerald accents
- **Nitro**: Configured for server-side API handling.

## 🔮 Future Roadmap
- [ ] **🧠 Semantic Search (RAG)**: "Ask your Garden" functionality using vector embeddings to find related concepts.
- [ ] **⚡️ Code Playground**: Interactive execution environment for snippets using WebContainers.
- [ ] **🎨 Visual Whiteboarding**: Integrated canvas for diagrams and mind maps (e.g., Excalidraw).
- [ ] **🔗 GitHub Sync**: Auto-commit "Evergreen" notes to a private repository for backup and versioning.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

[MIT License](LICENSE)
