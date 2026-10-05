# 🖼️ Infinite Scroll Gallery

A modern, responsive image gallery built with **Vanilla JavaScript, Tailwind CSS, and Vite**, powered by the **Unsplash API**.

This project was built to move beyond static frontend pages and get hands-on experience with real-world concepts such as API pagination, infinite scrolling, debounced search, lazy loading, asynchronous JavaScript, error handling, browser storage, and production deployment.

🔗 **Live Demo:** [Infinite Scroll Gallery](https://lnkd.in/eYjP6xCy)

---

## ✨ Features

### ♾️ Infinite Scrolling

- Automatically loads the next set of images as the user approaches the bottom of the page.
- Uses the **Intersection Observer API** instead of relying on continuous scroll-event listeners.
- Implements API pagination to progressively load more content.

### 🔎 Debounced Search

- Search requests are triggered **1 second after the user stops typing**.
- Prevents unnecessary API calls for every keystroke.
- Provides a smoother search experience while reducing API usage.

### 🖼️ Image Optimization

- Implements **lazy loading** so images are loaded when they are needed.
- Uses a blurred placeholder while high-quality images are loading.
- Improves perceived loading performance, especially on slower connections.

### ⚠️ Dynamic Error Handling

- Handles different API responses with custom UI states.
- Provides meaningful feedback instead of relying on browser `alert()` dialogs.

### 🔍 Conditional Empty State

- Displays a dedicated **"No Results Found"** state when a search returns no matching images.
- Keeps the UI informative instead of leaving the user with an empty gallery.

### 🖼️ Image Details Modal

Clicking an image opens a detailed modal containing:

- Selected image
- Image information
- Related images

The modal is implemented using the native HTML `<dialog>` element.

### ⌨️ Typewriter Animation

- Added a subtle typewriter animation to the page heading.
- Implemented using CSS/Tailwind utilities without relying on an external animation library.

### 👤 Editable User Profile

Users can customize their:

- Profile picture
- Username
- Bio

Profile information is stored in **Local Storage**, allowing the data to persist across page refreshes.

### 📋 Popup Footer

Because continuously scrolling content makes a traditional footer difficult to reach, the project uses a popup footer accessible from the navigation bar.

The popup is also implemented using the native HTML `<dialog>` element.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure and native dialog elements |
| **Tailwind CSS** | Responsive UI and styling |
| **JavaScript (ES6+)** | Application logic and DOM manipulation |
| **Unsplash API** | Image search and gallery data |
| **Vite** | Development server and production build |
| **Local Storage** | Persistent user profile data |
| **Intersection Observer API** | Infinite scrolling |
| **Fetch API** | Asynchronous API requests |
| **Vercel** | Production deployment |

---

## 🧠 Concepts Practiced

Building this project gave me practical experience with:

- Asynchronous JavaScript
- Promises and `async/await`
- Fetch API
- REST API consumption
- API pagination
- Intersection Observer API
- Debouncing
- Lazy loading
- Image loading states
- Local Storage
- Modular JavaScript
- DOM manipulation
- Native HTML `<dialog>`
- Error handling
- Conditional rendering
- Responsive layouts
- Performance optimization
- Environment variables
- Vite development & production builds
- Production deployment with Vercel
- Debugging deployment-related file path issues

---

## 📂 Project Structure

```text
Infinite-Scroll-gallery-project/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── scripts/
│   └── styles/
│
├── .env
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎥 Project Walkthrough
I also recorded a short 4-minute walkthrough demonstrating the project, its features, and the overall user experience.
##### 🎬 Walkthrough: Available in the project showcase / [LinkedIn post.](https://lnkd.in/p/d_YBiycB)
<br>

## 🎯 Why I Built This Project
Instead of building another static landing page, I wanted to challenge myself with a project that behaves more like a real-world frontend application.
The goal was not simply to consume an API, but to understand how different browser and JavaScript concepts work together to create a responsive and interactive application.

Through this project, I practiced making decisions around API requests, application state, loading states, error states, performance, user interactions, and production deployment.

<br>

## 👨‍💻 Author
### Siddharth Tayde 
#### Frontend Developer | JavaScript | React | Node.js
I enjoy building projects that help me understand how things work under the hood rather than simply following tutorials.

---

⭐ If you found this project interesting, feel free to explore the repository and share your feedback!
